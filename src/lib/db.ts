import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

await db.execute(`CREATE TABLE IF NOT EXISTS student (
    id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    program TEXT NOT NULL,
    dept TEXT NOT NULL,
    FOREIGN KEY (dept) REFERENCES dept(id)
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS dept (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
)`);


await db.execute(`CREATE TABLE IF NOT EXISTS teacher (
    id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    dept TEXT NOT NULL,
    FOREIGN KEY (dept) REFERENCES dept(id)
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
    FOREIGN KEY (user_id) REFERENCES user(id)
)`);

export interface DatabaseUser {
	id: string;
	username: string;
	password_hash: string;
}
