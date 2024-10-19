"use server";
import { lucia, validateRequest } from '@/lib/auth';
import { ActionResult } from '@/lib/form';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

export default async function LogoutPage() {
  await logout();
  redirect('/login');
}

async function logout(): Promise<ActionResult> {
	const { session } = await validateRequest();
	if (!session) {
		return {
			error: "Unauthorized"
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/login");
}