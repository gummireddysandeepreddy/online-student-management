'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Modified User type
type User = {
  id: string;
  regd_no: string;
  role: 'student' | 'teacher';
};

type HeaderProps = {
  initialUser: User | null;
};

export default function Header({ initialUser }: HeaderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Update user state if initialUser changes
    if (initialUser) {
      setUser({
        ...initialUser,
        role: initialUser.regd_no === 'ADMIN' ? 'teacher' : 'student'
      });
    } else {
      setUser(null);
    }
  }, [initialUser]);

  const navItems = [
    { href: '/create-course', label: 'Create Course', role: 'teacher' },
    { href: '/select-course', label: 'Select Course', role: 'student' },
    { href: '/submit-feedback', label: 'Submit Feedback', role: 'student' },
  ];

  const authItems = user
    ? []
    : [
        { href: '/login', label: 'Login' },
        { href: '/signup-student', label: 'Student Signup' },
        { href: '/signup-teacher', label: 'Teacher Signup' },
      ];

  const handleLogout = () => {
    router.push('/logout');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                CourseManager
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) =>
                (user && user.role === item.role) ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.label}
                  </Link>
                ) : null
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <>
                <span className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Welcome, {user.regd_no} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </>
            ) : (
              authItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}