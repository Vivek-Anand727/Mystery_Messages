'use client';

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      toast.success("Verification Successful!", {
        description: response.data.message,
        duration: 4000,
        position: "top-center",
      });

      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Verification Failed", {
        description: axiosError.response?.data.message ?? "An error occurred. Please try again.",
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-black/80 backdrop-blur-md border border-blue-500 shadow-[0px_0px_20px_5px_rgba(0,0,255,0.4)] rounded-xl transition-all duration-500 hover:scale-105">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-blue-400 drop-shadow-lg">
            Verify Your Account
          </h1>
          <p className="mb-4 text-gray-300">Enter the code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-300">Verification Code</FormLabel>
                  <Input
                    {...field}
                    className="bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white transition-all duration-300 rounded-lg"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/50 transform hover:scale-110 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2"></div>
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
