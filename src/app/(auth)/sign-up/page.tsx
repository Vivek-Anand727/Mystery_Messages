'use client'
import * as z from "zod" 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: '', email: '', password: '' }
  });

  const debounced = useDebounceCallback(setUsername, 500);

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message || "Error checking Username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast.success(response.data.message);
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-black/80 backdrop-blur-md border border-blue-500 shadow-[0px_0px_20px_5px_rgba(0,0,255,0.4)] rounded-xl transition-all duration-500 hover:scale-105">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-blue-400 drop-shadow-lg">
            Join True Feedback
          </h1>
          <p className="mb-4 text-gray-300">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-300">Username</FormLabel>
                  <Input
                    {...field}
                    className="bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white transition-all duration-300 rounded-lg"
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {isCheckingUsername && (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mt-2"></div>
                  )}
                  {!isCheckingUsername && usernameMessage && (
                    <p className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-500' : 'text-red-500'}`}>
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-300">Email</FormLabel>
                  <Input {...field} className="bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white transition-all duration-300 rounded-lg" />
                  <p className='text-gray-400 text-sm'>We will send you a verification code</p>
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
                  <Input type="password" {...field} className="bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white transition-all duration-300 rounded-lg" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/50 transform hover:scale-110 flex items-center justify-center' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2"></div>
                  Please wait...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-600 transition-all duration-300 underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;
