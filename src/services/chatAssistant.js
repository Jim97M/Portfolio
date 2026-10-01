function normalize(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function matchingProjects(question, projects) {
  const normalizedQuestion = normalize(question);
  return projects
    .map((project) => {
      const title = normalize(project.title);
      const titleWords = title.split(/[^a-z0-9]+/).filter((word) => word.length > 2);
      const matchingWords = titleWords.filter((word) => normalizedQuestion.includes(word));
      const exactTitle = title.length > 3 && normalizedQuestion.includes(title);
      return { project, score: exactTitle ? 100 : matchingWords.length };
    })
    .filter((match) => match.score > 0)
    .sort((left, right) => right.score - left.score)
    .map(({ project }) => project);
}

function projectResponse(project, asksAboutStack, asksAboutRole) {
  const details = [project.summary];
  if (asksAboutRole && project.role) details.push(`Alex’s role: ${project.role}.`);
  if (asksAboutStack && project.techStack?.length) details.push(`Technologies: ${project.techStack.join(", ")}.`);

  return {
    reply: details.join(" "),
    links: [{ label: `View ${project.title}`, href: "/#work" }],
    suggestions: ["What technologies were used?", "How can I contact Alex?"],
  };
}

function createChatResponse(message, { projects = [], posts = [] } = {}) {
  const question = normalize(message.trim());
  const asksAboutStack = /\b(stack|technolog(?:y|ies)|language|framework|database|built with)\b/.test(question);
  const asksAboutRole = /\b(role|responsib|contribut|did alex|alex do)\b/.test(question);
  const projectMatches = matchingProjects(question, projects);

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(question)) {
    return {
      reply: "Hi, how may I help you today?",
      suggestions: ["Explore projects", "Read the blog", "Ask about Alex’s experience", "Contact Alex"],
    };
  }

  if (projectMatches.length > 0) {
    return projectResponse(projectMatches[0], asksAboutStack, asksAboutRole);
  }

  if (/\b(stack|technolog(?:y|ies)|language|framework|database|built with)\b/.test(question)) {
    const technologies = [...new Set(projects.flatMap((project) => project.techStack || []))];
    if (technologies.length > 0) {
      return {
        reply: `The published projects list these technologies: ${technologies.join(", ")}. Open a case study to see how each was used.`,
        links: [{ label: "Explore project work", href: "/#work" }],
        suggestions: ["Tell me about a project", "What does Alex specialize in?"],
      };
    }
    return {
      reply: "No published project stacks are available to reference yet. Check back after a case study is published, or ask Alex directly.",
      links: [{ label: "Email Alex", href: "mailto:hello@alexmorgan.dev" }],
      suggestions: ["View projects", "What does Alex work on?"],
    };
  }

  if (/\b(projects?|case studies?|portfolio|project work|show (?:me )?(?:your )?work)\b/.test(question)) {
    if (projects.length === 0) {
      return {
        reply: "There aren’t any published case studies yet. Alex’s portfolio focuses on backend systems and platform engineering; you can ask about his experience or get in touch.",
        links: [{ label: "Contact Alex", href: "mailto:hello@alexmorgan.dev" }],
        suggestions: ["What does Alex work on?", "How can I get in touch?"],
      };
    }

    const selection = projects.slice(0, 3).map((project) => project.title).join(", ");
    return {
      reply: `Published case studies include ${selection}. Ask about one by name for its role, summary, and listed technologies.`,
      links: [{ label: "Explore project work", href: "/#work" }],
      suggestions: projects.slice(0, 3).map((project) => `Tell me about ${project.title}`),
    };
  }

  if (/\b(blog|writing|article|video)\b/.test(question)) {
    const normalizedPosts = posts.map((post) => ({ post, text: normalize(`${post.title} ${post.excerpt || ""}`) }));
    const matchedPosts = normalizedPosts.filter(({ text }) => {
      const terms = question.split(/[^a-z0-9]+/).filter((term) => term.length > 3);
      return terms.some((term) => text.includes(term));
    });
    const selection = (matchedPosts.length ? matchedPosts : normalizedPosts).slice(0, 3).map(({ post }) => post);

    if (selection.length === 0) {
      return {
        reply: "There aren’t any published articles yet. Ask about Alex’s projects, engineering experience, or contact details instead.",
        links: [{ label: "Email Alex", href: "mailto:hello@alexmorgan.dev" }],
        suggestions: ["View projects", "What does Alex work on?"],
      };
    }

    return {
      reply: `You might find ${selection.map((post) => `“${post.title}”`).join(", ")} useful.`,
      links: selection.map((post) => ({ label: post.title, href: `/blog#${post.slug}` })),
      suggestions: ["Tell me about projects", "How can I get in touch?"],
    };
  }

  if (/\b(contact|email|hire|available|opportunit|reach|talk)\b/.test(question)) {
    return {
      reply: "For role discussions, collaborations, or a good engineering problem, email Alex directly.",
      links: [{ label: "Email Alex", href: "mailto:hello@alexmorgan.dev" }],
      suggestions: ["View projects", "What does Alex specialize in?"],
    };
  }

  if (/\b(experience|background|about|senior|engineer|speciali[sz]e|focus|what does alex work on|what does alex do)\b/.test(question)) {
    return {
      reply: "Alex is a senior software engineer focused on backend systems, platform engineering, and distributed architecture, working from technical direction through production operations.",
      links: [{ label: "About Alex", href: "/#about" }],
      suggestions: ["View projects", "How can I get in touch?"],
    };
  }

  return {
    reply: "I can answer from Alex’s published projects and writing, or point you to his background and contact details. What would you like to know?",
    suggestions: ["View projects", "Read the blog", "Contact Alex"],
  };
}

module.exports = { createChatResponse };