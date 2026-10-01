import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "../blog-posts";
import PortfolioChat from "../components/PortfolioChat";

export const metadata: Metadata = {
  title: "Writing — Alex Morgan, Senior Software Engineer",
  description:
    "Notes on system design, production operations, and developer experience from Alex Morgan.",
};

export default function BlogPage() {
  return (
    <main id="top">
      <div className="site-shell">
        <header className="site-header">
          <Link className="wordmark" href="/" aria-label="Alex Morgan, home">
            <span className="wordmark-mark">AM</span>
            <span>Alex Morgan</span>
          </Link>
          <nav className="main-nav" aria-label="Main navigation">
            <Link href="/#work">Work</Link>
            <Link href="/blog" aria-current="page">Writing</Link>
            <Link href="/#about">About</Link>
            <a className="nav-contact" href="mailto:hello@alexmorgan.dev">
              Let&apos;s talk <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </header>

        <section className="blog-page-intro" aria-labelledby="blog-page-title">
          <p className="eyebrow">Notes from the systems layer</p>
          <h1 className="blog-page-title" id="blog-page-title">
            Writing on<br /><span className="serif-italic">reliable software.</span>
          </h1>
          <p className="blog-page-summary">
            Practical ideas on system design, production operations, and building platforms that help teams do their best work.
          </p>
          <a className="text-link" href="mailto:hello@alexmorgan.dev?subject=Writing%20and%20video">
            Suggest a topic <span aria-hidden="true">↗</span>
          </a>
        </section>

        <section className="blog-articles" aria-label="Articles">
          {blogPosts.map((post) => (
            <article className="blog-article" id={post.slug} key={post.slug}>
              <div className="blog-article-meta">
                <span>{post.number} / {post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <div className="blog-article-content">
                <h2>{post.title}</h2>
                <p className="blog-article-summary">{post.summary}</p>
                <div className="blog-article-body">
                  {post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {post.videoSrc && (
                  <video className="blog-video" controls playsInline preload="metadata" poster={post.videoPoster} aria-label={`Video: ${post.title}`}>
                    <source src={post.videoSrc} />
                    {post.captionsSrc && <track kind="captions" src={post.captionsSrc} srcLang="en" label="English captions" default />}
                    Your browser does not support embedded video.
                  </video>
                )}
              </div>
            </article>
          ))}
        </section>

        <footer className="site-footer">
          <a className="footer-invite" href="mailto:hello@alexmorgan.dev">Let&apos;s build<br /><span>something lasting.</span> <span className="footer-arrow" aria-hidden="true">↗</span></a>
          <div className="footer-bottom">
            <Link className="wordmark" href="/"><span className="wordmark-mark">AM</span><span>Alex Morgan</span></Link>
            <span>Senior software engineer · Backend &amp; platform</span>
            <a href="mailto:hello@alexmorgan.dev">hello@alexmorgan.dev</a>
            <span>© 2026</span>
          </div>
        </footer>
      </div>
      <PortfolioChat />
    </main>
  );
}