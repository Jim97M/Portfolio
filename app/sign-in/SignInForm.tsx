"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminUser, apiRequest } from "../admin/api";

type LoginResponse = { token: string; user: AdminUser };

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await apiRequest<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!result.user.roles.includes("admin")) {
        throw new Error("This account does not have administrator access.");
      }

      sessionStorage.setItem("portfolio_admin_token", result.token);
      router.replace("/admin/blog");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in.");
      setSubmitting(false);
    }
  }

  return (
    <form className="sign-in-form" onSubmit={handleSubmit}>
      <label htmlFor="admin-email">Email address</label>
      <input
        autoComplete="username"
        id="admin-email"
        name="email"
        onChange={(event) => setEmail(event.target.value)}
        required
        type="email"
        value={email}
      />
      <label htmlFor="admin-password">Password</label>
      <input
        autoComplete="current-password"
        id="admin-password"
        name="password"
        onChange={(event) => setPassword(event.target.value)}
        required
        type="password"
        value={password}
      />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="admin-primary-button" disabled={submitting} type="submit">
        {submitting ? "Signing in…" : "Sign in"}<span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}