"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actionLoginUser } from "@/lib/server-actions/authActions";

function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsLoading(true);

    try {
      const { error } = await actionLoginUser({ email, password });
      if (error) {
        setSubmitError(error.message || "Error logging in");
        return;
      }
      router.push("/");
    } catch (err) {
      setSubmitError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full sm:justify-center sm:w-[400px] flex flex-col"
    >
      <Link href={"/"} className="w-full flex justify-start items-center">
        <span className="text-3xl font-semibold">
          Arc<span className="text-purple-400">ane</span>
        </span>
      </Link>
      <p className="text-foreground/60 mt-1">
        All in one workspace for teams and creators.
      </p>

      <Input
        className="mt-4"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />

      <Input
        className="mt-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />

      {submitError && (
        <p className="text-red-500 text-sm mt-2">{submitError}</p>
      )}

      <Button
        className="w-full p-6 mt-6"
        type="submit"
        disabled={isLoading}
        size="lg"
      >
        {isLoading ? "Loading..." : "Login"}
      </Button>

      <span className="self-contain mt-6">
        Don&apos;t have an account?{" "}
        <Link href={"/signup"} className="text-primary">
          Sign Up
        </Link>
      </span>
    </form>
  );
}

export default Page;
