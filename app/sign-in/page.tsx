import type { Metadata } from "next";
import Link from "next/link";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "Admin sign in — Alex Morgan",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="admin-auth-page">
      <header className="admin-auth-header">
        <Link className="wordmark" href="/" aria-label="Alex Morgan, home">
          <span className="wordmark-mark">AM</span>
          <span>Alex Morgan</span>
        </Link>
        <span className="admin-auth-label">PRIVATE AREA / 01</span>
      </header>
      <section className="sign-in-panel" aria-labelledby="sign-in-title">
        <p className="eyebrow">Portfolio administration</p>
        <h1 id="sign-in-title">Good to have<br /><span className="serif-italic">you back.</span></h1>
        <p className="auth-intro">Sign in with your administrator account to manage writing and video.</p>
        <SignInForm />
        <Link className="auth-back-link" href="/">← Back to portfolio</Link>
      </section>
      <footer className="auth-footer"><span>PRIVATE / AUTHORIZED USERS ONLY</span><span>© 2026 ALEX MORGAN</span></footer>
    </main>
  );
}