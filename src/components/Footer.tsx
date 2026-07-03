"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    text: "Hi! I'm the Blackboard Cafe assistant. Ask me about our story, services, or catering.",
  },
];

export default function Footer() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const history = [...messages, { role: "user" as const, text }];
    setMessages(history);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setMessages((s) => [...s, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((s) => [
        ...s,
        {
          role: "assistant",
          text: "Sorry, I couldn't reach the assistant right now — please try WhatsApp or call +91 99496-70225.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative bg-dark px-5 pt-8 pb-8 font-body text-on-dark-2 sm:px-8 sm:pt-14 lg:px-14">
      <a
        href="https://wa.me/919949670225?text=Hi%20Blackboard%20Cafe%2C%20I%27d%20like%20to%20know%20more!"
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
        className="fixed right-7 bottom-7 z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-white bg-gold shadow-[0_8px_20px_rgba(0,0,0,0.3)] no-underline transition-transform hover:scale-[1.06]"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.4 1.33-1.93 1.4-.49.07-1.11.1-1.79-.11-.41-.13-.94-.3-1.62-.6-2.86-1.24-4.72-4.13-4.87-4.32-.14-.2-1.17-1.56-1.17-2.98 0-1.41.74-2.1 1-2.39.26-.28.57-.36.76-.36.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.81 2 .88 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.35 1.46.29.15.46.13.63-.05.17-.19.72-.84.92-1.13.19-.29.38-.24.63-.14.26.1 1.65.78 1.93.92.29.14.48.22.55.34.07.12.07.7-.17 1.38Z" />
        </svg>
      </a>

      <button
        onClick={() => setAssistantOpen((o) => !o)}
        aria-label="Ask AI Assistant"
        className="fixed right-7 bottom-[100px] z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold bg-dark shadow-[0_8px_20px_rgba(0,0,0,0.3)] transition-transform hover:scale-[1.06]"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F2A93B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a7 7 0 0 0-7 7c0 2.1.9 3.98 2.34 5.3L7 20l3.2-1.3c.58.13 1.18.2 1.8.2a7 7 0 0 0 0-14Z" />
          <circle cx="9.5" cy="10" r="1" fill="#F2A93B" stroke="none" />
          <circle cx="14.5" cy="10" r="1" fill="#F2A93B" stroke="none" />
        </svg>
      </button>

      {assistantOpen && (
        <div className="fixed right-7 bottom-[166px] z-50 flex h-[440px] w-[340px] max-w-[calc(100vw-40px)] flex-col overflow-hidden rounded-[18px] border border-card-border bg-cream shadow-[0_16px_40px_rgba(0,0,0,0.5)] font-body">
          <div className="flex items-center justify-between bg-dark px-4.5 py-4">
            <div>
              <div className="font-display text-[15px] font-bold text-gold">
                Blackboard Cafe Assistant
              </div>
              <div className="text-[11px] text-muted-on-dark">
                Ask about us, services or catering
              </div>
            </div>
            <button
              onClick={() => setAssistantOpen(false)}
              aria-label="Close"
              className="border-none bg-transparent text-xl leading-none text-muted-on-dark"
            >
              ×
            </button>
          </div>
          <div
            ref={scrollRef}
            className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4.5 py-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "self-end max-w-[80%] rounded-[14px_14px_2px_14px] bg-gold px-3.5 py-2.5 text-[13px] leading-normal text-dark"
                    : "self-start max-w-[80%] rounded-[14px_14px_14px_2px] bg-surface px-3.5 py-2.5 text-[13px] leading-normal text-body"
                }
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="self-start rounded-[14px_14px_14px_2px] bg-surface px-3.5 py-2.5 text-[13px] text-muted-on-dark-2">
                Typing…
              </div>
            )}
          </div>
          <div className="flex gap-2 border-t border-card-border bg-cream p-3.5">
            <input
              type="text"
              placeholder="Type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              className="flex-1 rounded-[10px] border-[1.5px] border-card-border bg-cream-input px-3.5 py-2.5 font-body text-[13px] text-heading"
            />
            <button
              onClick={sendMessage}
              className="rounded-[10px] border-none bg-gold px-4 text-[13px] font-bold text-dark"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1400px] gap-12" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div>
          <div className="mb-4 inline-flex flex-col items-center rounded-[14px] bg-dark-2 px-5 pt-2.5 pb-2">
            <div className="font-display text-xl leading-none font-extrabold tracking-[0.5px] text-gold">
              BLACKBOARD
            </div>
            <div className="mt-0.5 font-display text-sm leading-none font-bold tracking-[2px] text-white">
              CAFE
            </div>
          </div>
          <p className="m-0 max-w-[320px] text-sm leading-[1.7] text-muted-on-dark">
            Where delicious food meets a warm and friendly atmosphere. A trusted hospitality &amp; catering partner since 2015.
          </p>
        </div>

        <div>
          <div className="mb-4.5 font-display text-base font-bold text-gold">QUICK LINKS</div>
          <div className="flex flex-col gap-3">
            <Link href="/" className="text-sm text-muted-on-dark no-underline transition-colors hover:text-gold">Home</Link>
            <Link href="/about" className="text-sm text-muted-on-dark no-underline transition-colors hover:text-gold">About Us</Link>
            <Link href="/services" className="text-sm text-muted-on-dark no-underline transition-colors hover:text-gold">Services</Link>
            <Link href="/gallery" className="text-sm text-muted-on-dark no-underline transition-colors hover:text-gold">Gallery</Link>
            <Link href="/contact" className="text-sm text-muted-on-dark no-underline transition-colors hover:text-gold">Contact</Link>
          </div>
        </div>

        <div>
          <div className="mb-4.5 font-display text-base font-bold text-gold">SERVICES</div>
          <div className="flex flex-col gap-3">
            <span className="text-sm text-muted-on-dark">Cafe Dining</span>
            <span className="text-sm text-muted-on-dark">Corporate Catering</span>
            <span className="text-sm text-muted-on-dark">Institutional Catering</span>
            <span className="text-sm text-muted-on-dark">Event &amp; Exhibition Catering</span>
          </div>
        </div>

        <div>
          <div className="mb-4.5 font-display text-base font-bold text-gold">GET IN TOUCH</div>
          <div className="flex flex-col gap-3 text-sm text-muted-on-dark">
            <div>Hyderabad, Telangana, India</div>
            <a href="tel:9949670225" className="text-muted-on-dark no-underline transition-colors hover:text-gold">
              +91 99496-70225
            </a>
            <a href="mailto:venuacha@whiteboard.cafe" className="text-muted-on-dark no-underline transition-colors hover:text-gold">
              venuacha@whiteboard.cafe
            </a>
          </div>
          <div className="mt-5 flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9.5 w-9.5 items-center justify-center rounded-full border border-[#3a362f] text-muted-on-dark no-underline transition-colors hover:border-gold hover:bg-gold hover:text-dark"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9.5 w-9.5 items-center justify-center rounded-full border border-[#3a362f] text-muted-on-dark no-underline transition-colors hover:border-gold hover:bg-gold hover:text-dark"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="flex h-9.5 w-9.5 items-center justify-center rounded-full border border-[#3a362f] text-muted-on-dark no-underline transition-colors hover:border-gold hover:bg-gold hover:text-dark"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 5.9c-.7.33-1.46.55-2.25.65a3.9 3.9 0 0 0 1.72-2.16c-.76.46-1.6.79-2.5.97a3.9 3.9 0 0 0-6.65 3.56A11.06 11.06 0 0 1 4.1 4.98a3.9 3.9 0 0 0 1.21 5.2 3.87 3.87 0 0 1-1.77-.49v.05a3.9 3.9 0 0 0 3.13 3.83 3.9 3.9 0 0 1-1.76.07 3.9 3.9 0 0 0 3.64 2.71A7.83 7.83 0 0 1 2 17.54a11.04 11.04 0 0 0 5.98 1.75c7.18 0 11.1-5.95 11.1-11.1l-.01-.5A7.9 7.9 0 0 0 22 5.9Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1400px] flex-wrap justify-between gap-2 border-t border-divider-dark pt-6">
        <span className="text-[13px] text-muted-on-dark-2">
          © 2026 Blackboard Cafe · Bevgo Ventures Pvt. Ltd. All rights reserved.
        </span>
        <span className="text-[13px] text-muted-on-dark-2">Great Food, Great Life</span>
      </div>
    </footer>
  );
}
