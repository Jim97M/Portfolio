"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../AdminHeader";
import { AdminUser, apiRequest, Project } from "../api";

type ProjectForm = {
  title: string;
  slug: string;
  role: string;
  summary: string;
  description: string;
  techStack: string;
  liveUrl: string;
  sourceUrl: string;
  featured: boolean;
  sortOrder: string;
  status: "draft" | "published";
};

type ProjectListResponse = { projects: Project[] };
type UserResponse = { user: AdminUser };
const tokenKey = "portfolio_admin_token";
const emptyForm: ProjectForm = {
  title: "", slug: "", role: "", summary: "", description: "", techStack: "",
  liveUrl: "", sourceUrl: "", featured: false, sortOrder: "0", status: "draft",
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export default function ProjectsEditor() {
  const router = useRouter();
  const tokenRef = useRef("");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    const savedToken = sessionStorage.getItem(tokenKey);
    if (!savedToken) {
      router.replace("/sign-in");
      return () => { active = false; };
    }
    tokenRef.current = savedToken;

    Promise.all([
      apiRequest<UserResponse>("/api/auth/me", {}, savedToken),
      apiRequest<ProjectListResponse>("/api/admin/projects", {}, savedToken),
    ]).then(([userResult, projectResult]) => {
      if (!userResult.user.roles.includes("admin")) {
        sessionStorage.removeItem(tokenKey);
        router.replace("/sign-in");
        return;
      }
      if (active) {
        setUser(userResult.user);
        setProjects(projectResult.projects);
        setLoading(false);
      }
    }).catch((loadError: unknown) => {
      if (!active) return;
      const message = errorMessage(loadError);
      if (message.includes("Invalid or expired token") || message.includes("Authentication required")) {
        sessionStorage.removeItem(tokenKey);
        router.replace("/sign-in");
        return;
      }
      setError(message);
      setLoading(false);
    });

    return () => { active = false; };
  }, [router]);

  async function reloadProjects() {
    const result = await apiRequest<ProjectListResponse>("/api/admin/projects", {}, tokenRef.current);
    setProjects(result.projects);
  }

  function resetEditor() {
    setEditingId(null);
    setForm(emptyForm);
    setImage(null);
    setRemoveImage(false);
    setError("");
    setNotice("");
  }

  function editProject(project: Project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      slug: project.slug,
      role: project.role,
      summary: project.summary,
      description: project.description,
      techStack: project.techStack.join(", "),
      liveUrl: project.liveUrl || "",
      sourceUrl: project.sourceUrl || "",
      featured: project.featured,
      sortOrder: String(project.sortOrder),
      status: project.status,
    });
    setImage(null);
    setRemoveImage(false);
    setError("");
    setNotice("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tokenRef.current) return;
    setSaving(true);
    setError("");
    setNotice("");

    const body = new FormData();
    body.append("title", form.title);
    if (form.slug.trim()) body.append("slug", form.slug);
    body.append("role", form.role);
    body.append("summary", form.summary);
    body.append("description", form.description);
    body.append("techStack", form.techStack);
    body.append("liveUrl", form.liveUrl);
    body.append("sourceUrl", form.sourceUrl);
    body.append("featured", String(form.featured));
    body.append("sortOrder", form.sortOrder);
    body.append("status", form.status);
    if (image) body.append("image", image);
    if (removeImage) body.append("removeImage", "true");

    try {
      await apiRequest(
        editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects",
        { method: editingId ? "PATCH" : "POST", body },
        tokenRef.current,
      );
      await reloadProjects();
      setNotice(editingId ? "Project updated." : "Project created.");
      setEditingId(null);
      setForm(emptyForm);
      setImage(null);
      setRemoveImage(false);
    } catch (saveError) {
      setError(errorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(project: Project) {
    if (!window.confirm(`Delete “${project.title}”? This also removes its uploaded image.`)) return;
    setError("");
    setNotice("");
    try {
      await apiRequest(`/api/admin/projects/${project.id}`, { method: "DELETE" }, tokenRef.current);
      setProjects((current) => current.filter((item) => item.id !== project.id));
      if (editingId === project.id) resetEditor();
      setNotice("Project deleted.");
    } catch (deleteError) {
      setError(errorMessage(deleteError));
    }
  }

  if (loading) return <main className="admin-loading"><span className="availability-dot" /> Checking administrator access…</main>;

  return (
    <main className="admin-page">
      <AdminHeader active="projects" user={user} />
      <div className="admin-workspace">
        <aside className="admin-sidebar" aria-label="Projects">
          <div className="admin-sidebar-heading">
            <div><p className="eyebrow">Portfolio / case studies</p><h1>Projects</h1></div>
            <span className="admin-post-count">{projects.length.toString().padStart(2, "0")}</span>
          </div>
          <button className="admin-new-button" onClick={resetEditor} type="button"><span aria-hidden="true">+</span> New project</button>
          <div className="admin-post-list">
            {projects.length === 0 && <p className="admin-empty-list">No projects yet. Add a case study to feature it on your portfolio.</p>}
            {projects.map((project) => (
              <article className={`admin-post-row${editingId === project.id ? " is-selected" : ""}`} key={project.id}>
                <button className="admin-post-select" onClick={() => editProject(project)} type="button">
                  <span className={`admin-status-dot status-${project.status}`} />
                  <span className="admin-post-title">{project.title}</span>
                  <span className="admin-post-date">{project.featured ? "FEATURED · " : ""}{project.status.toUpperCase()}</span>
                </button>
                <button className="admin-delete-button" aria-label={`Delete ${project.title}`} onClick={() => deleteProject(project)} type="button">×</button>
              </article>
            ))}
          </div>
        </aside>

        <section className="admin-editor" aria-labelledby="project-editor-heading">
          <div className="admin-editor-heading">
            <div><p className="eyebrow">{editingId ? "Edit case study" : "New case study"}</p><h2 id="project-editor-heading">{editingId ? "Refine the project." : "Add your work."}</h2></div>
            <span className={`admin-status-label status-${form.status}`}>{form.status}</span>
          </div>
          {error && <p className="admin-alert admin-alert-error" role="alert">{error}</p>}
          {notice && <p className="admin-alert admin-alert-success" role="status">{notice}</p>}

          <form className="admin-post-form" onSubmit={handleSubmit}>
            <label className="admin-field"><span>Project title</span><input maxLength={180} onChange={(event) => setForm({ ...form, title: event.target.value })} required value={form.title} /></label>
            <div className="admin-fields-two">
              <label className="admin-field"><span>URL slug <small>Leave blank to generate from title</small></span><input maxLength={200} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="project-name" value={form.slug} /></label>
              <label className="admin-field"><span>Your role</span><input maxLength={120} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder="Senior Engineer / Tech Lead" value={form.role} /></label>
            </div>
            <label className="admin-field"><span>Short summary</span><textarea maxLength={500} onChange={(event) => setForm({ ...form, summary: event.target.value })} required rows={2} value={form.summary} /></label>
            <label className="admin-field"><span>Case study <small>Describe the problem, your approach, and the result</small></span><textarea className="admin-content-input" onChange={(event) => setForm({ ...form, description: event.target.value })} required rows={8} value={form.description} /></label>
            <label className="admin-field"><span>Technology <small>Separate stack items with commas</small></span><input onChange={(event) => setForm({ ...form, techStack: event.target.value })} placeholder="TypeScript, PostgreSQL, AWS" value={form.techStack} /></label>
            <div className="admin-fields-two">
              <label className="admin-field"><span>Live project URL</span><input onChange={(event) => setForm({ ...form, liveUrl: event.target.value })} placeholder="https://" type="url" value={form.liveUrl} /></label>
              <label className="admin-field"><span>Source code URL</span><input onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })} placeholder="https://github.com/" type="url" value={form.sourceUrl} /></label>
            </div>

            <div className="admin-project-options">
              <label className="admin-file-field"><span>Cover image <small>JPG, PNG, or WebP · optional</small></span><input accept="image/jpeg,image/png,image/webp" onChange={(event) => setImage(event.target.files?.[0] || null)} type="file" />{image && <small>Selected: {image.name}</small>}</label>
              {editingId && <label className="admin-remove-image"><input checked={removeImage} onChange={(event) => setRemoveImage(event.target.checked)} type="checkbox" />Remove current cover image</label>}
              <label className="admin-featured-toggle"><input checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} type="checkbox" /><span>Feature this project</span></label>
              <label className="admin-field admin-sort-field"><span>Display order</span><input min="0" max="10000" onChange={(event) => setForm({ ...form, sortOrder: event.target.value })} type="number" value={form.sortOrder} /></label>
            </div>

            <div className="admin-form-footer">
              <label className="admin-status-select"><span>Publish status</span><select onChange={(event) => setForm({ ...form, status: event.target.value as ProjectForm["status"] })} value={form.status}><option value="draft">Draft</option><option value="published">Published</option></select></label>
              <div className="admin-form-actions">{editingId && <button className="admin-quiet-button" onClick={resetEditor} type="button">Cancel edit</button>}<button className="admin-primary-button" disabled={saving} type="submit">{saving ? "Saving…" : editingId ? "Save project" : "Create project"}<span aria-hidden="true">↗</span></button></div>
            </div>
          </form>
          {error.includes("Cannot reach the API") && <button className="admin-quiet-button admin-retry-button" onClick={() => reloadProjects().then(() => setError("")).catch((retryError: unknown) => setError(errorMessage(retryError)))} type="button">Retry connection</button>}
        </section>
      </div>
    </main>
  );
}