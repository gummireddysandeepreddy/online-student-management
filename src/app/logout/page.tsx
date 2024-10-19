import { redirect } from 'next/navigation';
import { logout } from '@/lib/logout';
import { validateRequest } from '@/lib/auth';

export default async function LogoutPage() {
	const { user } = await validateRequest();
	if (!user) {
		return redirect("/login");
	}
  	await logout();
  	redirect('/login');
}
