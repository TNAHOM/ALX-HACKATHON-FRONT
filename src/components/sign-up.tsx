"use client";
import {
  FormTitle,
  FormWrapper,
  InputWrapper,
  FormButtons,
} from "@/components/forms/form-comp";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setPocketCookie } from "../../actions/user-is-valid";
import useAuth from "@/hooks/use-auth";

const schema = z.object({
  email: z
    .string()
    .email("email must be valid")
    .min(5, "email must be at least 5 characters"),
  password: z.string().min(8, "password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export function SignUpForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange", // triggers validation onChange
  });

  const onSubmit = async (data: FormData) => {
    const authData = await signUp(data.email, data.password, data.password);
    if (authData) {
      await setPocketCookie(authData.token);
      router.replace("/");
    }
  };

  return (
    <>
      <div className=" space-x-2 flex justify-center items-center">
        <h2>If you have an account</h2>
        <Link href="/">
          <Button variant="outline">sign in</Button>
        </Link>
      </div>
      <Card className="w-[400px] m-4 pt-4">
        <FormTitle>Create an Account</FormTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4 pt-0 gap-4 flex flex-col">
            <InputWrapper
              label="Email Address"
              description="Address must be a working email"
              error={errors.email?.message}
            >
              <Input {...register("email")} />
            </InputWrapper>
            <InputWrapper
              label="Password"
              description="Password must be at least 8 characters"
              error={errors.password?.message}
            >
              <Input {...register("password")} type="password" />
            </InputWrapper>
          </div>
          <FormButtons>
            <Button>Sign Up</Button>
          </FormButtons>
        </form>
      </Card>
    </>
  );
}
