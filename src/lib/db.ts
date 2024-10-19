import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

await db.execute(`CREATE TABLE IF NOT EXISTS student (
    id TEXT NOT NULL PRIMARY KEY,
    regd_no TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    name TEXT NOT NULL,
    gpa TEXT NOT NULL,
    semester TEXT NOT NULL,
    program TEXT NOT NULL,
    dept TEXT NOT NULL
)`);


await db.execute(`CREATE TABLE IF NOT EXISTS teacher (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    mail TEXT NOT NULL,
    phone TEXT NOT NULL,
    dept TEXT NOT NULL,
    Designation TEXT NOT NULL
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS course (
  id TEXT NOT NULL PRIMARY KEY,
  course_name TEXT NOT NULL,
  course_code TEXT NOT NULL UNIQUE,
  course_type TEXT NOT NULL,
  credits NUMBER NOT NULL,
  semester NUMBER NOT NULL
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS course_selection (
  selection_id TEXT NOT NULL PRIMARY KEY,
  student_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES student(id),
  FOREIGN KEY (course_id) REFERENCES course(id),
  FOREIGN KEY (teacher_id) REFERENCES teacher(id)
)`);


await db.execute(`CREATE TABLE IF NOT EXISTS feedback (
  id TEXT NOT NULL PRIMARY KEY,
  student_id TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  rating NUMBER NOT NULL,
  comments TEXT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES student(id),
  FOREIGN KEY (teacher_id) REFERENCES teacher(id)
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES student(id)
)`);

export interface DatabaseUser {
	id: string;
	regd_no: string;
	password_hash: string;
}
