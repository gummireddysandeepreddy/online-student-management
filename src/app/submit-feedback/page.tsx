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

  const teachers = await db.execute({
    sql: "SELECT DISTINCT teacher.id, teacher.name FROM teacher JOIN course_selection ON teacher.id = course_selection.teacher_id WHERE course_selection.student_id = ?",
    args: [user.id],
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Submit Feedback
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form action={submitFeedback}>
            <div>
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

            <div className="mt-4">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <div className="mt-1">
                <select
                  id="rating"
                  name="rating"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {[1, 2, 3, 4, 5].map((rating) => 
                    <option key={rating} value={rating}>{rating}</option>
                  )}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="comments"
                  name="comments"
                  rows={4}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Feedback
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

async function submitFeedback(_: any, formData: FormData): Promise<ActionResult> {
  "use server";
  const { user } = await validateRequest();
  if (!user) {
    return {
      error: "Unauthorized"
    };
  }

  const teacher_id = formData.get("teacher_id");
  const rating = formData.get("rating");
  const comments = formData.get("comments");

  if (
    typeof teacher_id !== "string" ||
    typeof rating !== "string" ||
    typeof comments !== "string"
  ) {
    return {
      error: "Invalid form data"
    };
  }

  const id = generateId(15);

  try {
    await db.execute({
      sql: "INSERT INTO feedback (id, student_id, teacher_id, rating, comments) VALUES(?, ?, ?, ?, ?)",
      args: [id, user.id, teacher_id, parseInt(rating), comments],
    });
  } catch (e) {
    console.error(e);
    return {
      error: "An error occurred while submitting feedback"
    };
  }
  return redirect("/my-feedback");
}