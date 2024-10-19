import Link from "next/link";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Form } from "@/lib/form";
import { generateId } from "lucia";
import crypto from 'crypto';

import type { ActionResult } from "@/lib/form";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create an account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form action={signup}>
            <div>
              <label htmlFor="regd_no" className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <div className="mt-1">
                <input
                  id="regd_no"
                  name="regd_no"
                  type="text"
                  required
                  className="appearance-none text-gray-700 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none text-gray-700 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none text-gray-700 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="gpa" className="block text-sm font-medium text-gray-700">
                GPA
              </label>
              <div className="mt-1">
                <input
                  id="gpa"
                  name="gpa"
                  type="text"
                  required
                  className="appearance-none text-gray-700 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="program" className="block text-sm font-medium text-gray-700">
                Program
              </label>
              <div className="mt-1">
                <select
                  id="program"
                  name="program"
                  required
                  className="block w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select Program</option>
                  <option value="B.Tech.">B.Tech.</option>
                  <option value="M.Tech.">M.Tech.</option>
                  <option value="MBA">MBA</option>
                  <option value="MCA">MCA</option>
                  <option value="PG">PG</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="dept" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <div className="mt-1">
                <select
                  id="dept"
                  name="dept"
                  required
                  className="block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                  <option value="CS">CS</option>
                  <option value="AIML">AIML</option>
                  <option value="DS">DS</option>
                  <option value="BS">BS</option>
                  <option value="EEE">EEE</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                Semester
              </label>
                <div className="mt-1">
                <select
                  id="semester"
                  name="semester"
                  required
                  className="block w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select Semester</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </select>
                </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </button>
            </div>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function signup(_: unknown, formData: FormData): Promise<ActionResult> {
  "use server";
  const regd_no = formData.get("regd_no");
  if (
    typeof regd_no !== "string" ||
    regd_no.length < 3 ||
    regd_no.length > 31 ||
    !/^[A-Z0-9_-]+$/.test(regd_no)
  ) {
    return {
      error: "Invalid Registration Number. It must be 3-31 characters long and contain only lowercase letters, numbers, hyphens, and underscores."
    };
  }
  const password = formData.get("password");
  if (typeof password !== "string" || password.length < 6 || password.length > 255) {
    return {
      error: "Invalid password. It must be 6-255 characters long."
    };
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  const userId = generateId(15);
  const name = formData.get("name");
  const gpa = formData.get("gpa");
  const semester = formData.get("semester");
  const program = formData.get("program");
  const dept = formData.get("dept");

  if (
    typeof name !== "string" ||
    typeof gpa !== "string" ||
    typeof semester !== "string" ||
    typeof program !== "string" ||
    typeof dept !== "string"
  ) {
    return {
      error: "Invalid form data"
    };
  }

  try {
    await db.execute({
      sql: "INSERT INTO student (id, regd_no, password_hash, salt, name, gpa, semester, program, dept) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [userId, regd_no, passwordHash, salt, name, gpa, semester, program, dept],
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  } catch (e) {
    console.error(e);
    if (e instanceof Error && e.message.includes("UNIQUE constraint failed: student.regd_no")) {
      return {
        error: "Registration Number already used"
      };
    }
    return {
      error: "An unknown error occurred"
    };
  }
  return redirect("/");
}