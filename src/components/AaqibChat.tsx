"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useContent } from "./ContentProvider";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Who is Aaqib?",
  "What projects has Aaqib worked on?",
  "What technologies does Aaqib use?",
  "How can I get in touch?",
];

export function AaqibChat() {
  const data = useContent();
  const { home, brand } = data;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError("");
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/aaqib-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.reply) {
        setMessages((m) => [...m, { role: "assistant", content: body.reply }]);
      } else {
        setError(body.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-[100dvh] max-w-3xl flex-col px-4 pb-4 pt-2">
      {/* Header with profile photo */}
      <header className="flex items-center gap-4 py-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-frame">
          <Image
            src={home.photo.src}
            alt={home.photo.alt}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold leading-tight">
            Ask {brand} AI
          </h1>
          <p className="text-sm text-text-muted">
            Ask me anything about {brand}.
          </p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl bg-surface p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-frame">
              <Image
                src={home.photo.src}
                alt={home.photo.alt}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <p className="max-w-sm text-text-muted">
              Hi! I&apos;m {brand}&apos;s AI assistant. Pick a question to start,
              or type your own below.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="rounded-full border border-border bg-surface-alt px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-text"
                  : "bg-surface-alt text-text"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-surface-alt px-4 py-3 text-text-muted">
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-text-muted [animation-delay:-0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-text-muted [animation-delay:-0.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-text-muted" />
              </span>
            </div>
          </div>
        )}

        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${brand}…`}
          aria-label="Your message"
          className="flex-1 rounded-full border border-border bg-surface-alt px-5 py-3 text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || input.trim() === ""}
          className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-text transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
