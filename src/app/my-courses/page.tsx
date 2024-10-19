import Link from "next/link";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

type CourseSelection = {
  selection_id: string;
  course_name: string;
  course_code: string;
  teacher_name: string;
  credits: number;
  semester: number;
};

export default async function MyCoursesPage() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const selectedCourses = await db.execute({
    sql: `
      SELECT 
        cs.selection_id, 
        c.course_name, 
        c.course_code, 
        t.name as teacher_name, 
        c.credits, 
        c.semester
      FROM 
        course_selection cs
      JOIN 
        course c ON cs.course_id = c.id
      JOIN 
        teacher t ON cs.teacher_id = t.id
      WHERE 
        cs.student_id = ?
      ORDER BY 
        c.semester, c.course_name
    `,
    args: [user.id],
  });

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">My Courses</h1>
        <div className="mb-6">
          <Link
            href="/select-course"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Select Another Course
          </Link>
        </div>
        {selectedCourses.rows.length === 0 ? (
          <p className="text-gray-500 text-lg">You haven&apos;t selected any courses yet.</p>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {(selectedCourses.rows as unknown as CourseSelection[]).map((course: CourseSelection) => (
                <li key={course.selection_id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {course.course_name}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {course.course_code}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Teacher: {course.teacher_name}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          Credits: {course.credits}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Semester: {course.semester}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}