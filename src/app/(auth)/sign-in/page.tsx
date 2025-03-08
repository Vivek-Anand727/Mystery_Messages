'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signInSchema } from '@/schemas/signInSchema';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error('Login Failed', {
          description: 'Incorrect username or password',
          duration: 4000,
          position: 'top-center',
        });
      } else {
        toast.error('Error', {
          description: result.error,
          duration: 4000,
          position: 'top-center',
        });
      }
    }

    if (result?.url) {
      toast.success('Login Successful!', {
        description: 'Redirecting to your dashboard...',
        duration: 4000,
        position: 'top-center',
      });
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-black/80 backdrop-blur-md border border-blue-500 shadow-[0px_0px_20px_5px_rgba(0,0,255,0.4)] rounded-xl transition-all duration-500 hover:scale-105">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-blue-400 drop-shadow-lg">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4 text-gray-300">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-300">Email/Username</FormLabel>
                  <Input
                    {...field}
                    className="bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white transition-all duration-300 rounded-lg"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-300">Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    className="bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white transition-all duration-300 rounded-lg"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/50 transform hover:scale-110 flex items-center justify-center"
              type="submit"
            >
              Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-400 hover:text-blue-600 transition-all duration-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
