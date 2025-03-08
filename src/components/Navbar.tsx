'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="p-4 md:p-5 bg-gray-900 text-white border-b border-gray-700">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-semibold hover:text-blue-400 transition">
          True Feedback
        </Link>
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm md:text-base">
              {user.username || user.email}
            </span>
            <Button onClick={() => signOut()} className="bg-blue-600 hover:bg-blue-700 text-white">
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
