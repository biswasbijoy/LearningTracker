"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signIn } from "next-auth/react";

const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"details" | "otp">("details");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const submittedEmail = (formData.get("email") as string).trim();
    const submittedName = (formData.get("name") as string).trim();
    const submittedPassword = formData.get("password") as string;
    const confirm = formData.get("confirmPassword") as string;
    const submittedOtp = formData.get("otp") as string;

    if (step === "details") {
      if (submittedPassword !== confirm) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (!strongPasswordPattern.test(submittedPassword)) {
        setError(
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
        );
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: submittedEmail, name: submittedName, password: submittedPassword }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Registration failed");
        }

        setEmail(submittedEmail);
        setName(submittedName);
        setPassword(submittedPassword);
        setStep("otp");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Registration failed");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: submittedOtp }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "OTP verification failed");
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/onboarding");
        router.refresh();
        return;
      }

      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Set up your SQA learning tracker</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={step === "otp"}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-800"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={step === "otp"}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-800"
            />
          </div>
          {step === "details" ? (
            <>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-describedby="password-requirements"
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-800"
                />
                <p id="password-requirements" className="text-xs text-neutral-500">
                  Use 8+ characters with uppercase, lowercase, number, and special character.
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-800"
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                minLength={6}
                maxLength={6}
                required
                autoComplete="one-time-code"
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm tracking-[0.35em] text-center focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-800"
              />
              <p className="text-xs text-neutral-500">
                Enter the 6-digit code sent to {email}.
              </p>
            </div>
          )}
          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (step === "details" ? "Sending OTP..." : "Verifying OTP...") : step === "details" ? "Send OTP" : "Verify OTP"}
          </Button>
        </form>
        {step === "otp" && (
          <button
            type="button"
            className="mt-3 w-full text-sm font-medium text-neutral-700 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
            onClick={() => {
              setStep("details");
              setError(null);
            }}
          >
            Change email or password
          </button>
        )}
        <p className="mt-4 text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-700 dark:text-neutral-50"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
