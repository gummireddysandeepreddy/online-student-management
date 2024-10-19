import { db } from "@/lib/db";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Form } from "@/lib/form";
import { generateId } from "lucia";

import type { ActionResult } from "@/lib/form";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a New Course
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form action={createCourse}>
            <div>
              <label htmlFor="course_name" className="block text-sm font-medium text-gray-700">
                Course Name
              </label>
              <div className="mt-1">
                <input
                  id="course_name"
                  name="course_name"
                  type="text"
                  required
                  className="block w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md shadow-sm placeholder-black-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="course_code" className="block text-sm font-medium text-gray-700">
                Course Code
              </label>
              <div className="mt-1">
                <input
                  id="course_code"
                  name="course_code"
                  type="text"
                  required
                  className="appearance-none block text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="course_type" className="block text-sm font-medium text-gray-700">
                Course Type
              </label>
              <div className="mt-1">
                <select
                  id="course_type"
                  name="course_type"
                  required
                  className="block w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select Course Type</option>
                  <option value="Core">Core</option>
                  <option value="Elective">Elective</option>
                  <option value="Lab">Lab</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
                Credits
              </label>
              <div className="mt-1">
                <input
                  id="credits"
                  name="credits"
                  type="number"
                  min="1"
                  max="5"
                  required
                  className="appearance-none block w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                Semester
              </label>
              <div className="mt-1">
                <select
                  id="semester"
                  name="semester"
                  required
                  className="block w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Course
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

async function createCourse(_: any, formData: FormData): Promise<ActionResult> {
  "use server";
  const course_name = formData.get("course_name");
  const course_code = formData.get("course_code");
  const course_type = formData.get("course_type");
  const credits = formData.get("credits");
  const semester = formData.get("semester");

  if (
    typeof course_name !== "string" ||
    typeof course_code !== "string" ||
    typeof course_type !== "string" ||
    typeof credits !== "string" ||
    typeof semester !== "string"
  ) {
    return {
      error: "Invalid form data"
    };
  }

  const id = generateId(15);

  try {
    await db.execute({
      sql: "INSERT INTO course (id, course_name, course_code, course_type, credits, semester) VALUES(?, ?, ?, ?, ?, ?)",
      args: [id, course_name, course_code, course_type, parseInt(credits), parseInt(semester)],
    });
  } catch (e) {
    console.error(e);
    if (e instanceof Error && e.message.includes("UNIQUE constraint failed: course.course_code")) {
      return {
        error: "Course code already exists"
      };
    }
    return {
      error: "An unknown error occurred"
    };
  }
  return redirect("/courses");
}