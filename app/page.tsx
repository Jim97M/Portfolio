import Link from "next/link";
import { blogPosts } from "./blog-posts";
import type { Project } from "./admin/api";
import PortfolioChat from "./components/PortfolioChat";

async function getPublishedProjects(): Promise<Project[]> {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

  try {
    const response = await fetch(`${apiUrl}/api/projects`, { signal: AbortSignal.timeout(2500) });
    if (!response.ok) return [];
    const result = await response.json() as { projects?: Project[] };
    return Array.isArray(result.projects) ? result.projects : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const projects = await getPublishedProjects();

  return (
    <main>
      <div className="site-shell">
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Alex Morgan, home">
            <span className="wordmark-mark">AM</span>
            <span>Alex Morgan</span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#work">Work</a>
            <Link href="/blog">Writing</Link>
            <a href="#about">About</a>
            <a className="nav-contact" href="mailto:hello@alexmorgan.dev">
              Let&apos;s talk <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </header>

        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="availability-dot" /> Senior software engineer · Backend &amp; platform</p>
            <h1 id="hero-title">Building systems<br />for the <span className="serif-italic">long run.</span></h1>
            <div className="hero-bottom">
              <p className="hero-intro">I build reliable backend platforms and developer tools, from architecture decisions through production operations.</p>
              <a className="text-link" href="#work">Explore engineering work <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="hero-art" role="img" aria-label="Illustrated service architecture showing an API gateway, queue, workers, and database">
            <div className="terminal-art">
              <div className="terminal-top">
                <span className="terminal-lights"><i /><i /><i /></span>
                <span>services / platform.ts</span>
                <span className="terminal-branch">main</span>
              </div>
              <div className="terminal-code" aria-hidden="true">
                <span><b>const</b> platform = {'{'}</span>
                <span>&nbsp;&nbsp;availability: <em>&quot;always&quot;</em>,</span>
                <span>&nbsp;&nbsp;scale: <em>&quot;with demand&quot;</em>,</span>
                <span>&nbsp;&nbsp;operators: <em>&quot;humans&quot;</em></span>
                <span>{'}'}</span>
              </div>
              <div className="architecture-flow" aria-hidden="true">
                <span className="flow-label">A REQUEST, END TO END</span>
                <div className="flow-row"><span>API</span><i>→</i><span>QUEUE</span><i>→</i><span>WORKERS</span><i>→</i><span>DATA</span></div>
                <div className="flow-baseline"><span>DESIGN</span><span>BUILD</span><span>OPERATE</span></div>
              </div>
            </div>
            <span className="hero-index">SYSTEMS / 001</span>
          </div>
          <div className="hero-side-note">BACKEND<br />PLATFORM<br />DISTRIBUTED SYSTEMS</div>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Problems worth solving</p>
              <h2 id="work-title">Engineering work<span className="heading-period">.</span></h2>
            </div>
            <span className="section-count">PLATFORMS · SYSTEMS · TOOLING</span>
          </div>

          {projects.length > 0 ? (
            <div className="project-grid">
              {projects.map((project, index) => {
                const imageUrl = project.imageUrl
                  ? `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "")}${project.imageUrl}`
                  : undefined;

                return (
                  <article className={`portfolio-project${project.featured ? " is-featured" : ""}`} key={project.id}>
                    <div
                      aria-label={imageUrl ? `${project.title} project cover` : `${project.title} project artwork`}
                      className={`portfolio-project-visual project-tone-${index % 3 + 1}`}
                      role="img"
                      style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : undefined}
                    >
                      <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
                      {!imageUrl && <span className="portfolio-project-mark">{project.title.slice(0, 2).toUpperCase()}</span>}
                      {project.featured && <span className="portfolio-project-featured">FEATURED</span>}
                    </div>
                    <div className="portfolio-project-meta">
                      <div className="portfolio-project-title-row"><h3>{project.title}</h3>{project.role && <span>{project.role}</span>}</div>
                      <p>{project.summary}</p>
                      {project.techStack.length > 0 && <ul className="project-tech-list">{project.techStack.map((technology) => <li key={technology}>{technology}</li>)}</ul>}
                      <details className="project-details"><summary>Project details</summary><p>{project.description}</p></details>
                      {(project.liveUrl || project.sourceUrl) && <div className="project-actions">
                        {project.liveUrl && <a href={project.liveUrl} rel="noreferrer" target="_blank">Live project <span aria-hidden="true">↗</span></a>}
                        {project.sourceUrl && <a href={project.sourceUrl} rel="noreferrer" target="_blank">Source code <span aria-hidden="true">↗</span></a>}
                      </div>}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : <p className="projects-empty-state">Published case studies will appear here.</p>}
          <div className="work-footnote"><span>Architecture · Delivery · Operations</span><span>↘</span></div>
        </section>

        <section className="blog-section" id="writing" aria-labelledby="blog-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Notes from the systems layer</p>
              <h2 id="blog-title">Writing<span className="heading-period">.</span></h2>
            </div>
            <span className="section-count">ARTICLES · VIDEO</span>
          </div>
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <article className="blog-post" key={post.number}>
                <div className="blog-post-meta"><span>{post.category}</span><span>{post.readTime}</span></div>
                <h3><Link href={`/blog#${post.slug}`}>{post.title}</Link></h3>
                <p>{post.summary}</p>
              </article>
            ))}
          </div>
          <div className="blog-footnote">
            <span>Practical notes on building and operating software systems.</span>
            <Link href="/blog">Visit the blog <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <p className="eyebrow">How I approach the work</p>
          <div className="about-layout">
            <h2 id="about-title">Clear thinking.<br /><span className="serif-italic">Reliable systems.</span></h2>
            <div className="about-copy">
              <p>I’m Alex, a senior software engineer focused on backend systems, platform engineering, and distributed architecture. I work from technical direction through implementation and production operations.</p>
              <p>I value pragmatic design, calm incident response, and helping teams make sound decisions without adding unnecessary complexity.</p>
              <a className="text-link" href="mailto:hello@alexmorgan.dev">Discuss an engineering role <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="services-row" aria-label="Services">
            <span>01 / System design</span><span>02 / Backend &amp; APIs</span><span>03 / Cloud infrastructure</span><span>04 / Technical leadership</span>
          </div>
        </section>

        <footer className="site-footer">
          <a className="footer-invite" href="mailto:hello@alexmorgan.dev">Let&apos;s build<br /><span>something lasting.</span> <span className="footer-arrow" aria-hidden="true">↗</span></a>
          <div className="footer-bottom">
            <a className="wordmark" href="#top"><span className="wordmark-mark">AM</span><span>Alex Morgan</span></a>
            <span>Senior software engineer · Backend &amp; platform</span>
            <a href="mailto:hello@alexmorgan.dev">hello@alexmorgan.dev</a>
            <Link href="/sign-in">Admin</Link>
            <span>© 2026</span>
          </div>
        </footer>
      </div>
      <PortfolioChat />
    </main>
  );
}
