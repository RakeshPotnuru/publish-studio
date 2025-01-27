"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  toast,
} from "@itsrakesh/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { Shake } from "@/components/ui/shake";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

import { Captcha } from "./captcha";
import { ShowPassword } from "./show-password";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Please enter your password" }),
});

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isCaptchaCompleted, setIsCaptchaCompleted] = useState(false);
  const [isCaptchaVerificationLoading, setIsCaptchaVerificationLoading] =
    useState(false);

  const { mutateAsync: login, isLoading: isLoggingIn } =
    trpc.admin.auth.login.useMutation({
      onSuccess: ({ data }) => {
        toast.success("Logged in successfully", {
          description: `Welcome back, ${data.user.first_name} ${data.user.last_name}!`,
        });

        setTimeout(() => {
          window.location.href = siteConfig.pages.dashboard.link;
        }, 1000);
      },
      onError: (error) => {
        setError(error.message);
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!isCaptchaCompleted) {
      setError("Please complete the captcha");
      return;
    }

    try {
      setError(null);
      await login(data);
    } catch {
      // Ignore
    }
  };

  const isLoading =
    form.formState.isSubmitting || isLoggingIn || isCaptchaVerificationLoading;

  return (
    <Shake isShaking={error}>
      <div className="space-y-6">
        <Heading level={2}>Sign in to your account</Heading>
        {error && (
          <Center>
            <ErrorBox title="Login failed" description={error} />
          </Center>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="me@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="********"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <ShowPassword
                    passwordVisible={passwordVisible}
                    setPasswordVisible={setPasswordVisible}
                  />
                </FormItem>
              )}
            />
            <Center>
              <Captcha
                setIsSuccess={setIsCaptchaCompleted}
                setErrorMessage={setError}
                setIsLoading={setIsCaptchaVerificationLoading}
              />
            </Center>
            <Button
              type="submit"
              className="w-full"
              disabled={
                !form.formState.isDirty || isLoading || !isCaptchaCompleted
              }
            >
              <ButtonLoader isLoading={isLoggingIn}>Continue</ButtonLoader>
            </Button>
          </form>
        </Form>
      </div>
    </Shake>
  );
}
