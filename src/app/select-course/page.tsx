import Link from "next/link";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Form } from "@/lib/form";
import { generateId } from "lucia";

import type { ActionResult } from "@/lib/form";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const courses = await db.execute({
    sql: "SELECT * FROM course",
    args: [],
  });

  const teachers = await db.execute({
    sql: "SELECT * FROM teacher",
    args: [],
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Select a Course
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form action={selectCourse}>
            <div>
              <label htmlFor="course_id" className="block text-sm font-medium text-gray-700">
                Course
              </label>
              <div className="mt-1">
                <select
                  id="course_id"
                  name="course_id"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {courses.rows.map((course: any) => (
                    <option key={course.id} value={course.id}>
                      {course.course_name} ({course.course_code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700">
                Teacher
              </label>
              <div className="mt-1">
                <select
                  id="teacher_id"
                  name="teacher_id"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {teachers.rows.map((teacher: any) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Select Course
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

async function selectCourse(_: any, formData: FormData): Promise<ActionResult> {
  "use server";
  const { user } = await validateRequest();
  if (!user) {
    return {
      error: "Unauthorized"
    };
  }

  const course_id = formData.get("course_id");
  const teacher_id = formData.get("teacher_id");

  if (
    typeof course_id !== "string" ||
    typeof teacher_id !== "string"
  ) {
    return {
      error: "Invalid form data"
    };
  }

  const selection_id = generateId(15);

  try {
    await db.execute({
      sql: "INSERT INTO course_selection (selection_id, student_id, course_id, teacher_id) VALUES(?, ?, ?, ?)",
      args: [selection_id, user.id, course_id, teacher_id],
    });
  } catch (e) {
    console.error(e);
    return {
      error: "An error occurred while selecting the course"
    };
  }
  return redirect("/my-courses");
}