"use client";
import { Button } from "./ui/button";
import { use, useEffect, useState } from "react";
import useAuth from "@/hooks/use-auth";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import RedirectOr from "./redirect";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useRouter } from "next/navigation";
import { useLogOut } from "@/hooks/mutation/login";
import { LoginForm } from "./log-in";

export default function Auth({ children }: { children: React.ReactNode }) {
  const { email, isLoggedIn } = useAuth();
  const { mutate: logOut } = useLogOut();
  const router = useRouter();

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <RedirectOr>{children}</RedirectOr>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className=" space-x-2 flex justify-center items-center">
            <h2>If you don't have an account</h2>
            <Link href="/signup">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </div>
          <LoginForm />
        </div>
      )}
    </div>
  );
}
