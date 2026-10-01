"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../AdminHeader";
import { AdminUser, apiRequest, BlogPost } from "../api";

type PostForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
};

type BlogListResponse = { posts: BlogPost[] };
type UserResponse = { user: AdminUser };
const emptyForm: PostForm = { title: "", slug: "", excerpt: "", content: "", status: "draft" };
const tokenKey = "portfolio_admin_token";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export default function BlogEditor() {
  const router = useRouter();
  const tokenRef = useRef("");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPoster, setVideoPoster] = useState<File | null>(null);
  const [captions, setCaptions] = useState<File | null>(null);
  const [removeCoverImage, setRemoveCoverImage] = useState(false);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [removeVideoPoster, setRemoveVideoPoster] = useState(false);
  const [removeCaptions, setRemoveCaptions] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadPosts(accessToken: string) {
    const result = await apiRequest<BlogListResponse>("/api/admin/blog", {}, accessToken);
    setPosts(result.posts);
  }

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
      apiRequest<BlogListResponse>("/api/admin/blog", {}, savedToken),
    ]).then(([userResult, postsResult]) => {
      if (!userResult.user.roles.includes("admin")) {
        sessionStorage.removeItem(tokenKey);
        router.replace("/sign-in");
        return;
      }
      if (active) {
        setUser(userResult.user);
        setPosts(postsResult.posts);
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

  function clearMediaState() {
    setCoverImage(null);
    setVideo(null);
    setVideoPoster(null);
    setCaptions(null);
    setRemoveCoverImage(false);
    setRemoveVideo(false);
    setRemoveVideoPoster(false);
    setRemoveCaptions(false);
  }

  function startNewPost() {
    setEditingId(null);
    setForm(emptyForm);
    clearMediaState();
    setError("");
    setNotice("");
  }

  function editPost(post: BlogPost) {
    setEditingId(post.id);
    setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, status: post.status });
    clearMediaState();
    setError("");
    setNotice("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const accessToken = tokenRef.current;
    if (!accessToken) return;
    setSaving(true);
    setError("");
    setNotice("");

    const body = new FormData();
    body.append("title", form.title);
    if (form.slug.trim()) body.append("slug", form.slug);
    body.append("excerpt", form.excerpt);
    body.append("content", form.content);
    body.append("status", form.status);
    if (coverImage) body.append("coverImage", coverImage);
    if (video) body.append("video", video);
    if (videoPoster) body.append("videoPoster", videoPoster);
    if (captions) body.append("captions", captions);
    if (removeCoverImage) body.append("removeCoverImage", "true");
    if (removeVideo) body.append("removeVideo", "true");
    if (removeVideoPoster) body.append("removeVideoPoster", "true");
    if (removeCaptions) body.append("removeCaptions", "true");

    try {
      await apiRequest(
        editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog",
        { method: editingId ? "PATCH" : "POST", body },
        accessToken,
      );
      await loadPosts(accessToken);
      setNotice(editingId ? "Post updated." : "Post created.");
      setEditingId(null);
      setForm(emptyForm);
      clearMediaState();
    } catch (saveError) {
      setError(errorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(post: BlogPost) {
    const accessToken = tokenRef.current;
    if (!accessToken || !window.confirm(`Delete “${post.title}”? This also removes its uploaded media.`)) return;
    setError("");
    setNotice("");
    try {
      await apiRequest(`/api/admin/blog/${post.id}`, { method: "DELETE" }, accessToken);
      setPosts((currentPosts) => currentPosts.filter((item) => item.id !== post.id));
      if (editingId === post.id) startNewPost();
      setNotice("Post deleted.");
    } catch (deleteError) {
      setError(errorMessage(deleteError));
    }
  }

  if (loading) {
    return <main className="admin-loading"><span className="availability-dot" /> Checking administrator access…</main>;
  }

  return (
    <main className="admin-page">
      <AdminHeader active="writing" user={user} />

      <div className="admin-workspace">
        <aside className="admin-sidebar" aria-label="Blog posts">
          <div className="admin-sidebar-heading">
            <div><p className="eyebrow">Portfolio / writing</p><h1>Blog posts</h1></div>
            <span className="admin-post-count">{posts.length.toString().padStart(2, "0")}</span>
          </div>
          <button className="admin-new-button" onClick={startNewPost} type="button"><span aria-hidden="true">+</span> New post</button>
          <div className="admin-post-list">
            {posts.length === 0 && <p className="admin-empty-list">No posts yet. Start with a new draft.</p>}
            {posts.map((post) => (
              <article className={`admin-post-row${editingId === post.id ? " is-selected" : ""}`} key={post.id}>
                <button className="admin-post-select" onClick={() => editPost(post)} type="button">
                  <span className={`admin-status-dot status-${post.status}`} />
                  <span className="admin-post-title">{post.title}</span>
                  <span className="admin-post-date">{post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : ""}</span>
                </button>
                <button className="admin-delete-button" aria-label={`Delete ${post.title}`} onClick={() => deletePost(post)} type="button">×</button>
              </article>
            ))}
          </div>
        </aside>

        <section className="admin-editor" aria-labelledby="editor-heading">
          <div className="admin-editor-heading">
            <div><p className="eyebrow">{editingId ? "Edit entry" : "New entry"}</p><h2 id="editor-heading">{editingId ? "Refine the story." : "Start with a draft."}</h2></div>
            <span className={`admin-status-label status-${form.status}`}>{form.status}</span>
          </div>

          {error && <p className="admin-alert admin-alert-error" role="alert">{error}</p>}
          {notice && <p className="admin-alert admin-alert-success" role="status">{notice}</p>}

          <form className="admin-post-form" onSubmit={handleSubmit}>
            <label className="admin-field">
              <span>Title</span>
              <input maxLength={180} onChange={(event) => setForm({ ...form, title: event.target.value })} required value={form.title} />
            </label>
            <label className="admin-field">
              <span>URL slug <small>Leave blank to use the title</small></span>
              <input maxLength={200} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="generated-from-title" value={form.slug} />
            </label>
            <label className="admin-field">
              <span>Excerpt</span>
              <textarea maxLength={500} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} rows={2} value={form.excerpt} />
            </label>
            <label className="admin-field">
              <span>Article content <small>Plain text paragraphs are separated by line breaks</small></span>
              <textarea className="admin-content-input" onChange={(event) => setForm({ ...form, content: event.target.value })} required rows={11} value={form.content} />
            </label>

            <div className="admin-media-fields">
              <label className="admin-file-field"><span>Cover image <small>JPG, PNG, or WebP</small></span><input accept="image/jpeg,image/png,image/webp" onChange={(event) => setCoverImage(event.target.files?.[0] || null)} type="file" />{coverImage && <small>Selected: {coverImage.name}</small>}</label>
              <label className="admin-file-field"><span>Video <small>MP4 or WebM</small></span><input accept="video/mp4,video/webm" onChange={(event) => setVideo(event.target.files?.[0] || null)} type="file" />{video && <small>Selected: {video.name}</small>}</label>
              <label className="admin-file-field"><span>Video poster <small>JPG, PNG, or WebP</small></span><input accept="image/jpeg,image/png,image/webp" onChange={(event) => setVideoPoster(event.target.files?.[0] || null)} type="file" />{videoPoster && <small>Selected: {videoPoster.name}</small>}</label>
              <label className="admin-file-field"><span>Captions <small>WebVTT (.vtt)</small></span><input accept=".vtt,text/vtt" onChange={(event) => setCaptions(event.target.files?.[0] || null)} type="file" />{captions && <small>Selected: {captions.name}</small>}</label>
            </div>

            {editingId && <div className="admin-remove-media">
              {([[
                "Remove current cover image", removeCoverImage, setRemoveCoverImage,
              ], [
                "Remove current video", removeVideo, setRemoveVideo,
              ], [
                "Remove current video poster", removeVideoPoster, setRemoveVideoPoster,
              ], [
                "Remove current captions", removeCaptions, setRemoveCaptions,
              ]] as const).map(([label, checked, setChecked]) => (
                <label key={label}><input checked={checked} onChange={(event) => setChecked(event.target.checked)} type="checkbox" />{label}</label>
              ))}
            </div>}

            <div className="admin-form-footer">
              <label className="admin-status-select"><span>Publish status</span><select onChange={(event) => setForm({ ...form, status: event.target.value as PostForm["status"] })} value={form.status}><option value="draft">Draft</option><option value="published">Published</option></select></label>
              <div className="admin-form-actions">
                {editingId && <button className="admin-quiet-button" onClick={startNewPost} type="button">Cancel edit</button>}
                <button className="admin-primary-button" disabled={saving} type="submit">{saving ? "Saving…" : editingId ? "Save changes" : "Save post"}<span aria-hidden="true">↗</span></button>
              </div>
            </div>
          </form>
          {error.includes("Cannot reach the API") && <button className="admin-quiet-button admin-retry-button" onClick={() => loadPosts(tokenRef.current).then(() => setError("")).catch((retryError: unknown) => setError(errorMessage(retryError)))} type="button">Retry connection</button>}
        </section>
      </div>
    </main>
  );
}