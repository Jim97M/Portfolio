export type BlogPost = {
  slug: string;
  number: string;
  category: string;
  readTime: string;
  title: string;
  summary: string;
  body: string[];
  videoSrc?: string;
  videoPoster?: string;
  captionsSrc?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "engineering-trade-offs",
    number: "01",
    category: "SYSTEM DESIGN",
    readTime: "6 MIN READ",
    title: "Senior engineering is mostly about trade-offs",
    summary: "A practical way to reason about reliability, complexity, and the needs of the team operating the system.",
    body: [
      "Most architecture decisions are not a choice between a good option and a bad one. They are a choice between different costs: operational load, delivery speed, flexibility, and the complexity a team has to carry.",
      "Start by making the constraints explicit. What needs to be reliable? What can change later? Who will operate this at 2 a.m.? A smaller design that answers those questions is often more useful than a clever one that solves for an imaginary future.",
      "Write down the important trade-offs and revisit them as the product changes. Good engineering judgment is less about predicting everything up front and more about making the consequences visible.",
    ],
  },
  {
    slug: "calmer-incidents",
    number: "02",
    category: "OPERATIONS",
    readTime: "5 MIN READ",
    title: "A calmer approach to production incidents",
    summary: "What good incident response looks like before, during, and after something goes wrong.",
    body: [
      "A useful incident process gives people room to think. The first job is to understand impact and establish a shared picture of what is happening, not to find someone to blame or rush into the first plausible fix.",
      "Clear roles help: one person coordinates, one investigates, and one keeps communication current. Keep a short timeline of observations and actions so the team can compare hypotheses instead of repeating work.",
      "After recovery, focus the review on conditions and follow-up. A small, owned change to an alert, runbook, or system boundary is more valuable than a long list of vague action items.",
    ],
  },
  {
    slug: "paved-road",
    number: "03",
    category: "DEVELOPER EXPERIENCE",
    readTime: "8 MIN READ",
    title: "Make the paved road the easy road",
    summary: "How thoughtful platform defaults can help teams move quickly without giving up safety.",
    body: [
      "An internal platform earns adoption when it removes friction from work teams already need to do. The goal is not to centralize every decision; it is to make common, safe paths easier to use than bespoke alternatives.",
      "Good defaults encode operational knowledge: sensible service templates, observable deployments, clear ownership, and security built into the workflow. Teams should still be able to step off the paved road when their problem genuinely calls for it.",
      "Measure whether the platform improves the developer experience: time to make a change, recovery effort, support load, and direct feedback. A growing catalogue of platform features is not the same thing as a better platform.",
    ],
  },
];