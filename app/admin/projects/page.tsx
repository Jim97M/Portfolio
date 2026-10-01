import type { Metadata } from "next";
import ProjectsEditor from "./ProjectsEditor";

export const metadata: Metadata = {
  title: "Project administration — Alex Morgan",
  robots: { index: false, follow: false },
};

export default function AdminProjectsPage() {
  return <ProjectsEditor />;
}