"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminUser } from "./api";

type AdminHeaderProps = {
  user: AdminUser | null;
  active: "writing" | "projects";
};

export default function AdminHeader({ user, active }: AdminHeaderProps) {
  const router = useRouter();

  function signOut() {
    sessionStorage.removeItem("portfolio_admin_token");
    router.replace("/sign-in");
  }

  return (
    <header className="admin-header">
      <div className="admin-header-brand">
        <Link className="wordmark" href="/" aria-label="James Wabuya, home">
          <span className="wordmark-mark">JW</span><span>James Wabuya</span>
        </Link>
        <span className="admin-header-divider" />
        <span className="admin-header-title">CONTENT DESK</span>
      </div>
      <nav className="admin-tabs" aria-label="Admin sections">
        <Link aria-current={active === "writing" ? "page" : undefined} className={active === "writing" ? "is-active" : ""} href="/admin/blog">Writing</Link>
        <Link aria-current={active === "projects" ? "page" : undefined} className={active === "projects" ? "is-active" : ""} href="/admin/projects">Projects</Link>
      </nav>
      <div className="admin-user-menu">
        {user && <span>{user.name}</span>}
        <button className="admin-quiet-button" onClick={signOut} type="button">Sign out</button>
      </div>
    </header>
  );
}