import type { Metadata } from "next";
import BlogEditor from "./BlogEditor";

export const metadata: Metadata = {
  title: "Blog administration — James Wabuya",
  robots: { index: false, follow: false },
};

export default function AdminBlogPage() {
  return <BlogEditor />;
}