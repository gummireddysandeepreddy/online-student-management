import { Form } from "@/lib/form";
import { Button } from "@/components/ui/button";
import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

