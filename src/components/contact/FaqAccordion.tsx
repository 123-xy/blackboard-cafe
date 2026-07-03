"use client";

import { useState } from "react";

const FAQS = [
  {
    question: "What services does Blackboard Cafe offer?",
    answer:
      "Premium café dining, conference & meeting facilities, and customized catering for corporate offices, educational institutions, and events.",
  },
  {
    question: "Do you cater for corporate offices?",
    answer:
      "Yes — we run centralized-kitchen corporate catering with customized weekly and monthly menus, at a capacity of 1,000+ employees.",
  },
  {
    question: "Do you cater for schools and colleges?",
    answer:
      "Yes — our institutional catering serves 4,000+ students daily with nutritious, hygienic meals and cashless meal-card payment systems.",
  },
  {
    question: "Have you handled large events or exhibitions?",
    answer:
      "Yes — we have event and exhibition catering experience at HITEX Exhibition Centre, covering trade fairs, conferences, and corporate events.",
  },
  {
    question: "How do I reach you for a catering enquiry?",
    answer:
      "Call +91 99496-70225, email venuacha@whiteboard.cafe, or use the contact form or WhatsApp button on this page.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {FAQS.map((f, i) => {
        const open = openIndex === i;
        return (
          <div key={f.question} className="overflow-hidden rounded-[14px] bg-surface">
            <button
              onClick={() => setOpenIndex(open ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 border-none bg-none px-6 py-5 text-left font-body"
            >
              <span className="text-[15px] font-semibold text-heading">{f.question}</span>
              <span className="flex-none text-xl font-bold text-gold-text">{open ? "−" : "+"}</span>
            </button>
            {open && (
              <div className="px-6 pb-5 text-sm leading-[1.7] text-muted">{f.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
