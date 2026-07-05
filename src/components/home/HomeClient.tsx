"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import ClickableImage from "@/components/ClickableImage";

const FEATURES = [
  { icon: "🍴", title: "DELICIOUS FOOD", desc: "Fresh and tasty dishes made with love." },
  { icon: "☕", title: "COZY AMBIENCE", desc: "A warm and welcoming space for everyone." },
  { icon: "🤝", title: "FRIENDLY SERVICE", desc: "Dedicated to making your experience special." },
];

const SLIDES = [
  { src: "/images/inside-1.jpg", alt: "Blackboard Cafe main dining hall", caption: "The Dining Hall" },
  { src: "/images/inside-2.jpg", alt: "Guests dining with the Blackboard Cafe team", caption: "Great Food, Great Company" },
  { src: "/images/inside-3.jpg", alt: "Framed wall art and pendant lighting", caption: "Curated Interiors" },
  { src: "/images/inside-4.jpg", alt: "Reception with plants and Ganesha idol", caption: "A Warm Welcome" },
  { src: "/images/inside-5.jpg", alt: "Buffet counter with decorative lighting", caption: "Buffet & Live Counters" },
  { src: "/images/inside-6.jpg", alt: "Blackboard Cafe branded wall posters", caption: "Food, Friends, Conversations" },
  { src: "/images/inside-7.jpg", alt: "Brass buffet service station", caption: "Crafted Catering Setups" },
];

const HIGHLIGHTS = [
  { icon: "🥐", title: "Cafe Dining", desc: "All-day breakfast, coffee and comfort food in a cozy, co-working friendly setting.", placeholder: "Drop a cafe dining photo", img: "/images/cafe-dining.jpg" as string | null },
  { icon: "🎓", title: "Institutional Catering", desc: "Nutritious, hygienic meals for 4,000+ students daily, with cashless meal-card payment.", placeholder: "Drop an institutional catering photo", img: "/images/institutional-catering.png" },
  { icon: "🏢", title: "Corporate Catering", desc: "Customized menus for 1,000+ employees, run from centralized kitchens.", placeholder: "Drop a corporate catering photo", img: "/images/corporate-catering-home.jpg" },
  { icon: "🎪", title: "Event Catering", desc: "High-volume catering for exhibitions and conferences, including HITEX Exhibition Centre.", placeholder: "Drop an event catering photo", img: "/images/event-exhibition-catering.jpg" },
];

const REASONS = [
  { icon: "🏆", title: "30+ Years of Experience", desc: "Founder-led hospitality expertise from IIT Roorkee, ISB and Harvard Business School, running since 2015.", img: "/images/why-1.jpg" },
  { icon: "🌱", title: "Quality & Hygiene", desc: "High food quality and hygiene standards maintained across every café, campus and corporate kitchen.", img: "/images/why-2.jpg" },
  { icon: "📈", title: "Scalable Operations", desc: "Centralized kitchens built to reliably serve 4,000+ students and 1,000+ employees daily, without compromise.", img: "/images/why-3.jpg" },
  { icon: "🎪", title: "Proven Track Record", desc: "Trusted event & exhibition catering experience, including large-scale service at HITEX Exhibition Centre.", img: "/images/why-4.jpg" },
];

const MARKETS = [
  { icon: "🏢", label: "Corporate Offices" },
  { icon: "🎓", label: "Educational Institutions" },
  { icon: "🎪", label: "Exhibition Venues" },
];

const STATS = [
  { value: "2015", label: "FOUNDED AS WHITEBOARD CAFÉ" },
  { value: "30+", label: "YEARS OF FOUNDER EXPERIENCE" },
  { value: "4,000+", label: "STUDENTS SERVED DAILY" },
  { value: "1,000+", label: "EMPLOYEE CATERING CAPACITY" },
];

const REVIEWS = [
  {
    stars: "★★★★★",
    text: "The all-day breakfast and coffee are consistently excellent, and it’s the perfect spot to work quietly or catch up with friends. A genuine second home between work and home.",
    name: "Priya Reddy",
    role: "CAFÉ REGULAR",
    initial: "P",
  },
  {
    stars: "★★★★★",
    text: "Blackboard has handled our corporate catering for over a year — reliable, hygienic, and the menu variety keeps our team happy every single day. Highly recommended at scale.",
    name: "Arun Mehta",
    role: "HR LEAD, TECH FIRM",
    initial: "A",
  },
  {
    stars: "★★★★★",
    text: "They catered our exhibition at HITEX flawlessly. High volume, on time, and the food quality never dropped. Our guests kept asking who did the catering!",
    name: "Sneha Kulkarni",
    role: "EVENT ORGANIZER",
    initial: "S",
  },
];

const SLIDE_INTERVAL = 4500;

export default function HomeClient() {
  const [activeSlide, setActiveSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const storeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveSlide((s) => (s + 1) % SLIDES.length);
    }, SLIDE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goToSlide = (i: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveSlide(i);
    timerRef.current = setInterval(() => {
      setActiveSlide((s) => (s + 1) % SLIDES.length);
    }, SLIDE_INTERVAL);
  };

  const prevSlide = () => goToSlide((activeSlide + SLIDES.length - 1) % SLIDES.length);
  const nextSlide = () => goToSlide((activeSlide + 1) % SLIDES.length);

  const onStoreMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = storeRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.animation = "none";
    el.style.transition = "transform 0.12s ease-out";
    el.style.transform = `perspective(1000px) rotateY(${px * 16}deg) rotateX(${-py * 12}deg) scale(1.03)`;
  };

  const onStoreLeave = () => {
    const el = storeRef.current;
    if (!el) return;
    el.style.transition = "transform 0.6s ease";
    el.style.transform = "";
    setTimeout(() => {
      if (storeRef.current) storeRef.current.style.animation = "storefrontSway 8s ease-in-out infinite";
    }, 600);
  };

  return (
    <div className="min-h-screen bg-cream font-body">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="chalkTexture" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={7} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={3} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" result="speckle" />
          <feComposite in="displaced" in2="speckle" operator="out" result="chalked" />
          <feMerge>
            <feMergeNode in="chalked" />
          </feMerge>
        </filter>
      </svg>

      <Header active="home" />

      {/* Hero */}
      <section className="relative mx-auto grid max-w-[1400px] items-center gap-10 overflow-hidden px-5 pt-10 pb-6 sm:px-8 sm:pt-16 sm:pb-10 lg:px-14"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <Image src="/images/logo-badge.png" alt="" width={280} height={280} className="pointer-events-none absolute -top-[6%] left-[2%] z-0 w-[280px] opacity-[0.16] [animation:badgeFloat_8s_ease-in-out_infinite] [filter:drop-shadow(0_20px_24px_rgba(0,0,0,0.2))]" />
        <Image src="/images/logo-badge.png" alt="" width={180} height={180} className="pointer-events-none absolute bottom-[2%] left-[36%] z-0 w-[180px] opacity-[0.12] [animation:badgeFloat2_9.5s_ease-in-out_infinite] [filter:drop-shadow(0_16px_18px_rgba(0,0,0,0.18))]" />
        <Image src="/images/logo-badge.png" alt="" width={220} height={220} className="pointer-events-none absolute top-[22%] right-[-2%] z-0 w-[220px] opacity-[0.14] [animation:badgeFloat3_10.5s_ease-in-out_infinite] [filter:drop-shadow(0_18px_20px_rgba(0,0,0,0.18))]" />

        <div className="relative z-10">
          <div className="mb-7 h-[5px] w-16 rounded-full bg-gold" />
          <h1
            className="m-0 mb-6 font-display font-extrabold leading-[1.05] text-transparent"
            style={{
              fontSize: "clamp(36px, 7vw, 64px)",
              filter: "url(#chalkTexture)",
              backgroundImage:
                "radial-gradient(circle at 5px 5px, var(--color-cream) 1.8px, transparent 1.9px), linear-gradient(var(--color-heading), var(--color-heading))",
              backgroundSize: "10px 10px, 100% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            GREAT FOOD,
            <br />
            GREAT LIFE
          </h1>
          <p className="m-0 max-w-[440px] text-lg leading-[1.7] text-muted">
            Welcome to Blackboard Cafe, where delicious food meets a warm and friendly atmosphere.
          </p>
        </div>

        <div
          className="relative flex justify-center"
          style={{ perspective: "1200px" }}
          onMouseMove={onStoreMove}
          onMouseLeave={onStoreLeave}
        >
          <div
            ref={storeRef}
            className="relative w-full max-w-[620px] [animation:storefrontSway_8s_ease-in-out_infinite] [transform-style:preserve-3d]"
          >
            <div
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "130%",
                height: "130%",
                background:
                  "radial-gradient(circle, rgba(242,169,59,0.22) 0%, rgba(242,169,59,0.10) 45%, transparent 72%)",
              }}
            />
            <Image
              src="/images/storefront.png"
              alt="Blackboard Cafe storefront illustration"
              width={620}
              height={620}
              className="block h-auto w-full object-contain"
              priority
            />
            <div
              className="pointer-events-none absolute h-[5%] w-[5%] rounded-full [animation:lampTwinkle_2.6s_ease-in-out_infinite] [mix-blend-mode:screen]"
              style={{
                left: "50.5%",
                top: "49.5%",
                background: "radial-gradient(circle,#FFD27A 0%,rgba(242,169,59,0.5) 40%,rgba(242,169,59,0) 72%)",
              }}
            />
            <div
              className="pointer-events-none absolute h-[5%] w-[5%] rounded-full [animation:lampTwinkle_3.1s_ease-in-out_0.7s_infinite] [mix-blend-mode:screen]"
              style={{
                left: "67.5%",
                top: "50.5%",
                background: "radial-gradient(circle,#FFD27A 0%,rgba(242,169,59,0.5) 40%,rgba(242,169,59,0) 72%)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="mt-6 bg-dark px-5 py-7 sm:px-8 sm:py-11 lg:px-14">
        <div className="mx-auto grid max-w-[1200px] gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="flex h-13 w-13 flex-none items-center justify-center rounded-full border-2 border-gold text-xl text-gold [animation:iconPulse_2.6s_ease-in-out_infinite]">
                {f.icon}
              </div>
              <div>
                <div className="mb-1.5 font-display text-base font-bold tracking-[0.5px] text-white">{f.title}</div>
                <div className="max-w-[260px] text-sm leading-[1.6] text-muted-on-dark">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inside carousel */}
      <section className="mx-auto max-w-[1400px] px-5 pt-12 sm:px-8 sm:pt-16 lg:px-14 lg:pt-22">
        <div className="mb-11 text-center">
          <div className="mx-auto mb-7 h-[5px] w-16 rounded-full bg-gold" />
          <h2 className="m-0 font-display text-4xl font-extrabold text-heading">INSIDE BLACKBOARD CAFE</h2>
        </div>
        <div
          className="relative mx-auto max-h-[480px] overflow-hidden rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
          style={{ maxWidth: "1000px", aspectRatio: "16/10" }}
        >
          {SLIDES.map((s, i) => (
            <div
              key={s.src}
              className="absolute inset-0 transition-opacity duration-500"
              style={{ opacity: activeSlide === i ? 1 : 0, pointerEvents: activeSlide === i ? "auto" : "none" }}
            >
              <ClickableImage
                src={s.src}
                alt={s.alt}
                fill
                sizes="(max-width: 1000px) 100vw, 1000px"
                imgClassName="block object-cover [animation:kenBurns_14s_ease-in-out_infinite_alternate]"
                imgStyle={{ filter: "contrast(1.28) saturate(1.18) brightness(0.86)" }}
                priority={i === 0}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(16,14,12,0.45) 0%, rgba(16,14,12,0) 26%, rgba(16,14,12,0) 52%, rgba(16,14,12,0.9) 100%)",
                }}
              />
              <div className="pointer-events-none absolute z-[2]" style={{ left: "clamp(20px,4vw,36px)", bottom: "clamp(28px,7vw,64px)" }}>
                <div className="mb-3.5 h-1 w-11 rounded-full bg-gold" />
                <div
                  className="font-display font-bold tracking-[0.3px] text-heading"
                  style={{ fontSize: "clamp(16px,3vw,24px)", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
                >
                  {s.caption}
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-5 left-1/2 z-[5] flex -translate-x-1/2 gap-2.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label="Go to slide"
                className="h-2.5 w-2.5 rounded-full border-none"
                style={{ background: activeSlide === i ? "#F2A93B" : "rgba(255,255,255,0.5)" }}
              />
            ))}
          </div>

          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute top-1/2 left-4 z-[5] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-none text-lg text-white"
            style={{ background: "rgba(28,26,23,0.55)" }}
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute top-1/2 right-4 z-[5] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-none text-lg text-white"
            style={{ background: "rgba(28,26,23,0.55)" }}
          >
            ›
          </button>
        </div>
      </section>

      {/* Taste of what we do */}
      <section className="mx-auto max-w-[1400px] px-5 pt-12 pb-0 text-center sm:px-8 sm:pt-16 lg:px-14 lg:pt-22">
        <div className="mx-auto mb-7 h-[5px] w-16 rounded-full bg-gold" />
        <h2 className="m-0 mb-4 font-display font-extrabold text-heading" style={{ fontSize: "clamp(28px,5vw,40px)" }}>
          A TASTE OF WHAT WE DO
        </h2>
        <p className="mx-auto mb-12 max-w-[560px] text-base text-muted">
          From cozy café mornings to large corporate events, here&apos;s a quick look at how Blackboard Cafe serves.
        </p>
        <div className="grid gap-6 pb-12 sm:pb-16 lg:pb-22" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="overflow-hidden rounded-2xl border border-card-border bg-surface text-left">
              <div className="relative h-[140px] w-full">
                {h.img ? (
                  <ClickableImage src={h.img} alt={h.title} fill sizes="300px" imgClassName="object-cover" />
                ) : (
                  <ImagePlaceholder label={h.placeholder} />
                )}
              </div>
              <div className="p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border-2 border-gold text-lg text-gold [animation:iconPulse_2.6s_ease-in-out_infinite]">
                  {h.icon}
                </div>
                <div className="mb-2 font-display text-lg font-bold text-heading">{h.title}</div>
                <div className="text-sm leading-[1.6] text-muted">{h.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-[1400px] px-5 pb-12 sm:px-8 sm:pb-16 lg:px-14 lg:pb-22">
        <div className="mb-11 text-center">
          <div className="mx-auto mb-7 h-[5px] w-16 rounded-full bg-gold" />
          <h2 className="m-0 mb-4 font-display font-extrabold text-heading" style={{ fontSize: "clamp(28px,5vw,40px)" }}>
            WHY CHOOSE US
          </h2>
          <p className="mx-auto max-w-[560px] text-base text-muted">
            Over 30 years of hospitality experience behind every plate we serve.
          </p>
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {REASONS.map((r) => (
            <div key={r.title} className="overflow-hidden rounded-2xl border border-card-border bg-surface text-left">
              <div className="relative h-[140px] w-full">
                <ClickableImage src={r.img} alt={r.title} fill sizes="300px" imgClassName="object-cover" />
              </div>
              <div className="px-6 py-8">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border-2 border-gold text-lg text-gold [animation:iconPulse_2.6s_ease-in-out_infinite]">
                  {r.icon}
                </div>
                <div className="mb-2 font-display text-lg font-bold text-heading">{r.title}</div>
                <div className="text-sm leading-[1.6] text-muted">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stat band */}
      <section className="bg-dark px-5 py-8 sm:px-8 sm:py-14 lg:px-14">
        <div className="mx-auto grid max-w-[1200px] gap-6 text-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-[34px] font-extrabold text-gold">{s.value}</div>
              <div className="mt-2 text-xs tracking-[0.5px] text-muted-on-dark">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Where we serve */}
      <section className="bg-surface px-5 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-22">
        <div className="mx-auto grid max-w-[1200px] items-center gap-14" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          <div>
            <div className="mb-6 h-[5px] w-16 rounded-full bg-gold" />
            <h2 className="m-0 mb-5 font-display font-extrabold text-heading" style={{ fontSize: "clamp(24px,4vw,32px)" }}>
              WHERE WE SERVE
            </h2>
            <p className="m-0 mb-7 max-w-[480px] text-base leading-[1.7] text-muted">
              Beyond the café counter, Blackboard Cafe is a trusted hospitality &amp; catering partner across:
            </p>
            <div className="flex flex-col gap-4">
              {MARKETS.map((m) => (
                <div key={m.label} className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] bg-cream text-lg">{m.icon}</div>
                  <div className="text-[15px] font-semibold text-heading">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-cream p-10">
            <div className="m-0 mb-5 text-[15px] leading-[1.8] text-body italic">
              &quot;Over 30 years of hospitality experience, built on a simple idea — every café should feel like a second home between work and home.&quot;
            </div>
            <div className="font-display text-base font-bold text-heading">Dr. Jagannath Kallakurchi</div>
            <div className="mt-0.5 text-[13px] font-semibold tracking-[0.5px] text-gold-text">FOUNDER, BLACKBOARD CAFE</div>
            <Link href="/about" className="mt-5 inline-block text-sm font-semibold text-heading underline">
              Meet the leadership team →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream px-5 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-22">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-6 h-[5px] w-16 rounded-full bg-gold" />
            <div className="mb-3.5 font-display text-sm font-bold tracking-[2px] text-gold">TESTIMONIALS</div>
            <h2 className="m-0 mb-4 font-display font-extrabold text-heading" style={{ fontSize: "clamp(28px,5vw,40px)" }}>
              WHAT OUR GUESTS SAY
            </h2>
            <p className="mx-auto max-w-[560px] text-base text-muted">
              Loved by café regulars, corporate partners, and event hosts across Hyderabad.
            </p>
          </div>
          <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {REVIEWS.map((rev) => (
              <div key={rev.name} className="flex flex-col rounded-[18px] border border-card-border bg-surface p-9">
                <div className="mb-4.5 text-base tracking-[2px] text-gold">{rev.stars}</div>
                <p className="m-0 mb-6 flex-1 text-[15px] leading-[1.8] text-body italic">&quot;{rev.text}&quot;</p>
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gold font-display text-xl font-extrabold text-dark">
                    {rev.initial}
                  </div>
                  <div>
                    <div className="font-display text-base font-bold text-heading">{rev.name}</div>
                    <div className="mt-0.5 text-[13px] font-semibold tracking-[0.3px] text-gold-text">{rev.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-gold px-5 py-8 sm:px-8 sm:py-14 lg:px-14">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="m-0 mb-2 font-display font-extrabold text-dark" style={{ fontSize: "clamp(24px,4vw,32px)" }}>
              Ready for great food &amp; great life?
            </h2>
            <p className="m-0 text-[15px]" style={{ color: "#4a3c1a" }}>
              Book a table or reach out to plan your next event with us.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/contact" className="rounded-lg bg-dark px-8 py-4.5 text-sm font-bold tracking-[0.5px] text-gold no-underline">
              BOOK A TABLE
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
