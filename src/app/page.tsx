import { Form } from "@/lib/form";
import { Button } from "@/components/ui/button";
import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ActionResult } from "@/lib/form";
import { db } from "@/lib/db";


export default async function Page() {
	const { user } = await validateRequest();
	if (!user) {
		return redirect("/login");
	}
	// const usr = await db.execute({
	// 	sql : `SELECT * FROM student WHERE regd_no = ?`,
	// 	args : [user.regd_no]
	// });
	// console.log(usr);
	return (
		<div className="h-full">
			<div className="flex justify-center items-center h-full">
				{user?.regd_no}
			</div>
		</div>
	);
}

async function logout(): Promise<ActionResult> {
	"use server";
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
