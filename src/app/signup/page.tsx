"use client";
import { SignUpForm } from "@/components/sign-up";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // if(isLoggedIn){
  //   router.replace('/')
  // }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <SignUpForm />
    </div>
  );
}
