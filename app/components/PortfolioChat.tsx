"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { apiRequest } from "../admin/api";

type ChatLink = { label: string; href: string };
type ChatResponse = { reply: string; links?: ChatLink[]; suggestions?: string[] };

type Message = {
  id: string;
  sender: "assistant" | "visitor";
  text: string;
  links?: ChatLink[];
  suggestions?: string[];
};

const quickQuestions = ["Explore projects", "Read the blog", "Ask about Alex’s experience", "Contact Alex"];
const greetingPattern = /^(hi|hello|hey|good morning|good afternoon|good evening)\b/i;
const greetingReply = "Hi, how may I help you today?";

export default function PortfolioChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Hi, how may I help you today?",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  async function sendMessage(question: string) {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isSending) return;

    setMessages((currentMessages) => [...currentMessages, {
      id: crypto.randomUUID(),
      sender: "visitor",
      text: trimmedQuestion,
    }]);
    setInput("");

    if (greetingPattern.test(trimmedQuestion)) {
      setMessages((currentMessages) => [...currentMessages, {
        id: crypto.randomUUID(),
        sender: "assistant",
        text: greetingReply,
        suggestions: quickQuestions,
      }]);
      return;
    }

    setIsSending(true);

    try {
      const result = await apiRequest<ChatResponse>("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: trimmedQuestion }),
        signal: AbortSignal.timeout(8000),
      });
      setMessages((currentMessages) => [...currentMessages, {
        id: crypto.randomUUID(),
        sender: "assistant",
        text: result.reply,
        links: result.links,
        suggestions: result.suggestions,
      }]);
    } catch (error) {
      const detail = error instanceof Error && !error.message.startsWith("Cannot reach the API")
        ? ` ${error.message}`
        : " The assistant is temporarily unable to reach the portfolio data.";
      setMessages((currentMessages) => [...currentMessages, {
        id: crypto.randomUUID(),
        sender: "assistant",
        text: `I can’t look that up right now.${detail} Please try again shortly, or contact Alex directly.`,
        links: [{ label: "Email Alex", href: "mailto:hello@alexmorgan.dev" }],
      }]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="portfolio-chat">
      {isOpen && (
        <section
          aria-labelledby="portfolio-chat-title"
          className="chat-panel"
          id="portfolio-chat-dialog"
          role="dialog"
        >
          <header className="chat-header">
            <div className="chat-header-mark" aria-hidden="true">AM</div>
            <div className="chat-header-copy">
              <h2 id="portfolio-chat-title">Portfolio assistant</h2>
              <p><span className="chat-online-dot" /> Here to point you in the right direction</p>
            </div>
            <button
              aria-label="Close portfolio assistant"
              className="chat-close-button"
              onClick={() => setIsOpen(false)}
              type="button"
            >×</button>
          </header>

          <div aria-busy={isSending} aria-live="polite" className="chat-messages" role="log">
            {messages.map((message) => (
              <div className={`chat-message chat-message-${message.sender}`} key={message.id}>
                <p>{message.text}</p>
                {message.links?.map((link) => <Link className="chat-response-link" href={link.href} key={`${message.id}-${link.href}`}>{link.label}<span aria-hidden="true">↗</span></Link>)}
              </div>
            ))}
            {messages.length === 1 && (
              <div className="chat-quick-questions" aria-label="Suggested questions">
                {quickQuestions.map((question) => (
                  <button disabled={isSending} key={question} onClick={() => sendMessage(question)} type="button">{question}<span aria-hidden="true">↗</span></button>
                ))}
              </div>
            )}
            {!isSending && messages.length > 1 && messages[messages.length - 1].sender === "assistant" && messages[messages.length - 1].suggestions && (
              <div className="chat-quick-questions" aria-label="Suggested follow-up questions">
                {messages[messages.length - 1].suggestions?.map((question) => (
                  <button disabled={isSending} key={question} onClick={() => sendMessage(question)} type="button">{question}<span aria-hidden="true">↗</span></button>
                ))}
              </div>
            )}
            {isSending && <p className="chat-typing" role="status">Checking published portfolio data…</p>}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-composer" onSubmit={handleSubmit}>
            <label className="chat-sr-only" htmlFor="portfolio-chat-input">Ask a question</label>
            <input
              autoComplete="off"
              autoFocus
              id="portfolio-chat-input"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about Alex’s work…"
              disabled={isSending}
              value={input}
            />
            <button aria-label="Send message" disabled={!input.trim() || isSending} type="submit"><span aria-hidden="true">↑</span></button>
          </form>
          <p className="chat-disclaimer">Answers based on published portfolio data</p>
        </section>
      )}

      <button
        aria-controls="portfolio-chat-dialog"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close portfolio assistant" : "Open portfolio assistant"}
        className={`chat-launcher${isOpen ? " is-open" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span className="chat-launcher-icon" aria-hidden="true" />
        <span className="chat-launcher-label">Ask Alex</span>
      </button>
    </div>
  );
}