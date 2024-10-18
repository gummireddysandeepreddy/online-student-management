import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Form } from "@/lib/form";
import crypto from 'crypto';

import type { ActionResult } from "@/lib/form";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";

export default async function Page() {
  const { user } = await validateRequest();
  if (user?.username == "admin") {
    return redirect("/admin");
  }
  if (user) {
    return redirect("/");
  }
  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your Credentials below to login.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form action={login}>
            <div className="grid gap-2">
              <Label htmlFor="username">User Name</Label>
              <Input id="username" type="text" name="username" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button className="w-full mt-4">Sign in</Button>
          </Form>
        </CardContent>
        <CardFooter>
          <Link href="/signup-student" className="text-sm text-blue-600 hover:underline">Sign up</Link>
        </CardFooter>
      </Card>
    </div>
  )
}

async function login(_: any, formData: FormData): Promise<ActionResult> {
  "use server";
  const username = formData.get("username");
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31
  ) {
    return {
      error: "Invalid username"
    };
  }
  const password = formData.get("password");
  if (typeof password !== "string" || password.length < 6 || password.length > 255) {
    return {
      error: "Invalid password"
    };
  }

  const existingUsers = await db.execute({
    sql: `SELECT * FROM student WHERE username = ?`,
    args: [username],
  });

  if (!existingUsers || existingUsers.rows.length === 0) {
    return {
      error: "Incorrect username or password"
    };
  }
  const existingUser = existingUsers.rows[0];
  const storedHash = existingUser.password_hash as string;
  const salt = existingUser.salt as string;

  const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  
  if (storedHash !== hashedPassword) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling, 2FA, etc.
    // If usernames are public, you can outright tell the user that the username is invalid.
    return {
      error: "Incorrect username or password"
    };
  }
  const id: string = existingUser.id as string;
  const session = await lucia.createSession(id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect("/");
}
