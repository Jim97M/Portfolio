import type { Metadata } from "next";
import BlogEditor from "./BlogEditor";

export const metadata: Metadata = {
  title: "Blog administration — Alex Morgan",
  robots: { index: false, follow: false },
};

export default function AdminBlogPage() {
  return <BlogEditor />;
}