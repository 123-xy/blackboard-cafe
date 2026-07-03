"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type ActivePage = "home" | "about" | "services" | "gallery" | "contact";

const LINKS: Record<ActivePage, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  gallery: "/gallery",
  contact: "/contact",
};

const NAV_ITEMS: { key: ActivePage; label: string }[] = [
  { key: "home", label: "HOME" },
  { key: "about", label: "ABOUT US" },
  { key: "services", label: "SERVICES" },
  { key: "gallery", label: "GALLERY" },
  { key: "contact", label: "CONTACT" },
];

export default function Header({ active }: { active: ActivePage }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      const mobile = window.innerWidth < 880;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <header className="relative z-20 bg-cream border-b border-card-border font-body">
      <div className="flex items-center justify-between gap-5 px-5 py-3.5 sm:px-8 lg:px-14">
        <Link
          href="/"
          className="flex flex-none flex-col items-center gap-0 rounded-[14px] bg-dark px-5 pt-2.5 pb-2 no-underline shadow-[0_6px_0_rgba(0,0,0,0.15)]"
        >
          <div className="font-display text-[22px] leading-none font-extrabold tracking-[0.5px] text-gold">
            BLACKBOARD
          </div>
          <div className="mt-0.5 font-display text-base leading-none font-bold tracking-[2px] text-white">
            CAFE
          </div>
          <div className="mt-1 rounded-lg bg-gold px-2 py-0.5 text-[8px] font-bold tracking-[1px] text-dark">
            GREAT FOOD, GREAT LIFE
          </div>
        </Link>

        {!isMobile && (
          <>
            <nav className="flex items-center gap-9">
              {NAV_ITEMS.map((item) => {
                const isActive = item.key === active;
                return (
                  <Link
                    key={item.key}
                    href={LINKS[item.key]}
                    className="pb-1.5 text-sm font-semibold tracking-[1px] text-heading no-underline transition-colors hover:text-gold-hover"
                    style={{
                      borderBottom: `3px solid ${isActive ? "#F2A93B" : "transparent"}`,
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/contact"
              className="flex-none whitespace-nowrap rounded-lg bg-gold px-[26px] py-3.5 text-[13px] font-bold tracking-[1px] text-dark no-underline shadow-[0_4px_0_#C97F16] transition-colors hover:bg-gold-hover-2"
            >
              BOOK A TABLE
            </Link>
          </>
        )}

        {isMobile && (
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex h-11 w-11 flex-none items-center justify-center rounded-lg border-[1.5px] border-gold bg-transparent text-xl text-gold"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        )}
      </div>

      {isMobile && mobileOpen && (
        <div className="flex flex-col gap-1 border-t border-card-border px-5 pt-2 pb-5 sm:px-8">
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={LINKS[item.key]}
                className="border-b border-card-border py-3.5 px-1 text-[15px] font-semibold tracking-[0.5px] no-underline"
                style={{ color: isActive ? "#F2A93B" : "#EFE9E0" }}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="mt-3 rounded-lg bg-gold px-[26px] py-3.5 text-center text-[13px] font-bold tracking-[1px] text-dark no-underline"
            onClick={() => setMobileOpen(false)}
          >
            BOOK A TABLE
          </Link>
        </div>
      )}
    </header>
  );
}
