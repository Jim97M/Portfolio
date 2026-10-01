const test = require("node:test");
const assert = require("node:assert/strict");
const { createChatResponse } = require("../src/services/chatAssistant");

const projects = [
  {
    title: "Payments Platform",
    slug: "payments-platform",
    role: "Lead engineer",
    summary: "Reliable payment processing with clear service ownership.",
    techStack: ["Node.js", "PostgreSQL", "Kafka"],
    status: "published",
  },
];

const posts = [{ title: "Designing calm incident response", slug: "calm-incidents", excerpt: "Practical production incident guidance." }];

test("answers a project technology question from the published project record", () => {
  const response = createChatResponse("What technologies were used on the payments platform?", { projects });
  assert.match(response.reply, /Node\.js, PostgreSQL, Kafka/);
  assert.equal(response.links[0].href, "/#work");
});

test("greets visitors and offers clear next-step buttons", () => {
  const response = createChatResponse("Hi", { projects, posts });
  assert.equal(response.reply, "Hi, how may I help you today?");
  assert.deepEqual(response.suggestions, [
    "Explore projects",
    "Read the blog",
    "Ask about Alex’s experience",
    "Contact Alex",
  ]);
});

test("suggests a matching article with its public URL", () => {
  const response = createChatResponse("Can you share writing about incidents?", { posts });
  assert.equal(response.links[0].href, "/blog#calm-incidents");
  assert.match(response.reply, /calm incident response/i);
});

test("does not invent case studies when no projects are published", () => {
  const response = createChatResponse("Show me your projects", { projects: [] });
  assert.match(response.reply, /aren’t any published case studies yet/i);
  assert.doesNotMatch(response.reply, /Payments Platform/);
});

test("answers what Alex works on as an engineering focus question", () => {
  const response = createChatResponse("What does Alex work on?", { projects, posts });
  assert.match(response.reply, /senior software engineer focused on backend systems/i);
  assert.equal(response.links[0].href, "/#about");
});

test("asks for clarification instead of fabricating answers to unknown questions", () => {
  const response = createChatResponse("What is Alex's favorite movie?", { projects, posts });
  assert.match(response.reply, /published projects and writing/i);
  assert.equal(response.links, undefined);
});