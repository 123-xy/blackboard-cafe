import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CoffeeCupSteam from "@/components/CoffeeCupSteam";
import ClickableImage from "@/components/ClickableImage";

export const metadata: Metadata = {
  title: "About Us | Blackboard Cafe",
  description:
    "Blackboard Cafe began its journey in 2015 as Whiteboard Cafe. Learn our story, vision, mission, leadership, values, and sustainability commitments.",
};

const TIMELINE = [
  { year: "2015", desc: "Founded as Whiteboard Café — a warm, minimalist-meets-vibrant space with meeting rooms for work and quiet alike." },
  { year: "2018", desc: "Rebranded to Blackboard Restaurant, opening at Cyber Towers, Hyderabad with multi-cuisine, veg & non-veg dining." },
  { year: "2022", desc: "Launched a new branch at HITEX Exhibition Centre in March, expanding into exhibition & event catering." },
  { year: "Today", desc: "A trusted hospitality & catering partner across cafés, corporates, campuses and 38+ exhibitions." },
];

const STATS = [
  { value: "30+", label: "YEARS OF FOUNDER EXPERIENCE" },
  { value: "4,000+", label: "STUDENTS SERVED DAILY" },
  { value: "1,000+", label: "EMPLOYEE CATERING CAPACITY" },
  { value: "2015", label: "FOUNDED AS WHITEBOARD CAFÉ" },
];

const VISION_POINTS = [
  "Healthy, diverse, high-quality food",
  "High standards of customer satisfaction",
  "Memorable dining experiences through innovation and service excellence",
];

const LEADERS = [
  {
    name: "Dr. Jagannath Kallakurchi",
    role: "FOUNDER & MANAGING DIRECTOR",
    bio: "Ran Choice Solutions, an IT services firm, for 30+ years before founding Blackboard Café, shaping its vision of healthy, vegetarian and vegan hospitality — “a second home between work and home.”",
    tags: ["30+ Years Experience", "IIT Roorkee", "IIT Mumbai", "ISB", "Harvard Business School"],
    img: "/images/leader-founder.webp",
  },
  {
    name: "Venu Gopal Acha",
    role: "GENERAL MANAGER – OPERATIONS",
    bio: "Joined Bevgo Ventures in December 2015 as Operations Manager and was promoted to General Manager – Operations in January 2017, bringing hospitality discipline from leading hotel brands.",
    tags: ["Novotel Hyderabad Convention Centre", "Taj Deccan Hyderabad", "Bevgo Ventures Pvt. Ltd."],
    img: "/images/leader-gm.webp",
  },
];

const CHEF = {
  role: "CHEF",
  quote:
    "Good food starts with good ingredients and a kitchen that never cuts corners — that's the standard we hold at every counter, every day.",
  bio: "Leads Blackboard Café's kitchens with over 15 years of multi-cuisine experience, blending Hyderabadi classics with health-conscious, farm-fresh cooking. Trains and mentors every chef across our café, corporate, and institutional kitchens to keep quality and consistency high at scale.",
  tags: ["15+ Years Experience", "Multi-Cuisine Specialist", "Farm-to-Table Sourcing"],
};

const VALUES = [
  { icon: "🌱", title: "Quality & Hygiene", desc: "High food quality and hygiene standards across every kitchen." },
  { icon: "📈", title: "Scalable Operations", desc: "Centralized kitchens built to reliably serve small cafés and 1,000+ person accounts alike." },
  { icon: "❤️", title: "Customer-Centric Service", desc: "An experienced leadership team focused on a genuinely customer-first experience." },
  { icon: "🏆", title: "Proven Track Record", desc: "A strong institutional and corporate catering history, including event catering experience at HITEX Exhibition Centre." },
];

const SUSTAINABILITY = [
  "Eliminating single-use plastics and packaging in favor of compostable or reusable items.",
  "Self-service beverage stations instead of single-use cans and bottles.",
  "A dedicated system for composting food waste at scale.",
  "Local sourcing and mindful menu planning to reduce waste and cost.",
];

const QUOTES = [
  {
    text: "By using sustainable food practices like reducing the amount of food we waste and making good decisions about the food we eat, we can preserve the world’s food supplies and lessen our impact on the environment.",
    name: "Venu Gopal Acha",
    role: "GENERAL MANAGER OPERATIONS, BEVGO VENTURES",
  },
  {
    text: "We are known for maintaining the highest standards of quality and cleanliness of equipment in the kitchen. The main reason for our success is a clear focus on a ‘Customer First’ attitude and taking care of our employees.",
    name: "Jagannath Kallakurchi",
    role: "MANAGING DIRECTOR, BEVGO VENTURES",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream font-body">
      <Header active="about" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark px-5 pt-10 text-center sm:px-8 sm:pt-16 lg:px-14 lg:pt-18">
        <Image src="/images/logo-badge.png" alt="" width={120} height={120} className="pointer-events-none absolute top-[8%] left-[6%] z-0 w-[120px] opacity-10 [animation:badgeFloatSm_9s_ease-in-out_infinite]" />
        <Image src="/images/logo-badge.png" alt="" width={150} height={150} className="pointer-events-none absolute top-[20%] right-[7%] z-0 w-[150px] opacity-[0.12] [animation:badgeFloatSm2_11s_ease-in-out_infinite]" />
        <CoffeeCupSteam className="absolute top-[14%] right-[22%] z-0 opacity-50" />

        <div className="relative z-10">
          <div className="mx-auto mb-6 h-[5px] w-16 rounded-full bg-gold" />
          <div className="mb-3.5 font-display text-sm font-bold tracking-[2px] text-gold">ABOUT US</div>
          <h1 className="m-0 mb-10 font-display font-extrabold text-white" style={{ fontSize: "clamp(32px,7vw,52px)" }}>
            OUR STORY
          </h1>
          <div className="relative mx-auto max-h-[360px] overflow-hidden rounded-t-[20px]" style={{ maxWidth: "1000px", aspectRatio: "16/9" }}>
            <ClickableImage
              src="/images/about-hero.jpg"
              alt="Blackboard Cafe team and interior"
              fill
              sizes="1000px"
              imgClassName="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-[1000px] px-5 py-9 sm:px-8 sm:py-18 lg:px-14 lg:py-20">
        <p className="m-0 mb-7 text-lg leading-[1.9] text-body">
          Blackboard Café began its journey in 2015 as Whiteboard Café with a simple vision — to create a welcoming space where great food, meaningful conversations, and exceptional hospitality come together. As the brand grew and expanded its presence across corporate workplaces, educational institutions, and large-scale events, it evolved into Blackboard Café in 2018 under Bevgo Ventures Pvt. Ltd.
        </p>
        <p className="m-0 mb-7 text-lg leading-[1.9] text-body">
          Today, Blackboard Café is more than a café. We are a trusted hospitality and catering partner, serving thousands of customers every day with fresh, high-quality meals, specialty beverages, and reliable service. From cozy café experiences to corporate dining, institutional catering, and exhibition events, our commitment remains the same: delivering memorable experiences through quality, innovation, and genuine hospitality.
        </p>
        <p className="m-0 text-lg leading-[1.9] text-body italic">
          Every meal we serve reflects our belief that a café should feel like a second home — a place where people connect, recharge, and enjoy food made with care.
        </p>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-[1200px] px-5 pb-12 sm:px-8 sm:pb-16 lg:px-14 lg:pb-22">
        <div className="relative flex flex-wrap items-start justify-center gap-6">
          {TIMELINE.map((t) => (
            <div key={t.year} className="max-w-[260px] flex-1 basis-[200px] px-3 text-center">
              <div className="mx-auto mb-5 h-5 w-5 rounded-full border-4 border-cream bg-gold" />
              <div className="font-display text-[28px] font-extrabold text-heading">{t.year}</div>
              <div className="mt-2 text-sm leading-[1.6] text-muted">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stat band */}
      <section className="bg-dark px-5 py-8 sm:px-8 sm:py-14 lg:px-14">
        <div className="mx-auto grid max-w-[1200px] gap-6 text-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-4xl font-extrabold text-gold">{s.value}</div>
              <div className="mt-2 text-[13px] tracking-[0.5px] text-muted-on-dark">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision / Mission */}
      <section className="bg-cream px-5 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-22">
        <div className="mx-auto grid max-w-[1200px] gap-14" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <div>
            <div className="mb-6 h-[5px] w-16 rounded-full bg-gold" />
            <h2 className="m-0 mb-5 font-display font-extrabold text-heading" style={{ fontSize: "clamp(24px,4vw,32px)" }}>
              OUR VISION
            </h2>
            <p className="m-0 mb-6 text-[17px] leading-[1.8] text-body">
              To create <strong>&quot;a second home between work and home&quot;</strong> — a place people return to, not just for the food, but for how it makes them feel.
            </p>
            <div className="flex flex-col gap-3.5">
              {VISION_POINTS.map((p) => (
                <div key={p} className="flex items-start gap-3 text-[15px] leading-[1.6] text-body">
                  <span className="flex-none font-bold text-gold">✓</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-6 h-[5px] w-16 rounded-full bg-gold" />
            <h2 className="m-0 mb-5 font-display font-extrabold text-heading" style={{ fontSize: "clamp(24px,4vw,32px)" }}>
              OUR MISSION
            </h2>
            <p className="m-0 text-[17px] leading-[1.8] text-body">
              To serve every guest — whether at a café table, an office desk, a campus canteen, or an exhibition hall — with healthy, diverse, high-quality food and hospitality that consistently exceeds expectations, delivered through innovation and service excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-cream px-5 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-22">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-14 text-center">
            <div className="mx-auto mb-6 h-[5px] w-16 rounded-full bg-gold" />
            <h2 className="m-0 font-display font-extrabold text-heading" style={{ fontSize: "clamp(26px,4.5vw,36px)" }}>
              LEADERSHIP
            </h2>
          </div>
          <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {LEADERS.map((l) => (
              <div key={l.name} className="flex flex-wrap gap-6 rounded-[18px] bg-surface p-9">
                <div className="relative h-24 w-24 flex-none overflow-hidden rounded-full">
                  <ClickableImage
                    src={l.img}
                    alt={l.name}
                    fill
                    sizes="96px"
                    imgClassName="object-cover"
                    imgStyle={{ objectPosition: "50% 12%" }}
                  />
                </div>
                <div>
                  <div className="mb-1 font-display text-xl font-bold text-heading">{l.name}</div>
                  <div className="mb-4 text-[13px] font-semibold tracking-[0.5px] text-gold-text">{l.role}</div>
                  <p className="m-0 mb-5 text-sm leading-[1.7] text-muted">{l.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {l.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-cream px-3 py-1.5 text-xs font-semibold text-heading">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet our chef */}
      <section className="bg-cream px-5 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-22">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-14 text-center">
            <div className="mx-auto mb-6 h-[5px] w-16 rounded-full bg-gold" />
            <h2 className="m-0 mb-4 font-display font-extrabold text-heading" style={{ fontSize: "clamp(26px,4.5vw,36px)" }}>
              MEET OUR EXPERT CHEF
            </h2>
            <p className="mx-auto max-w-[640px] text-base text-muted">
              Behind every memorable meal is a team of passionate culinary experts. Our experienced chefs combine creativity, hygiene and excellence to deliver world-class dining and catering experiences.
            </p>
          </div>
          <div className="mx-auto flex max-w-[900px] flex-wrap items-center gap-9 rounded-[18px] bg-surface p-9 sm:p-11">
            <div className="relative mx-auto h-40 w-40 flex-none overflow-hidden rounded-full sm:mx-0">
              <ClickableImage
                src="/images/chef-head.jpg"
                alt="Head chef plating a dish"
                fill
                sizes="160px"
                imgClassName="object-cover"
                imgStyle={{ objectPosition: "50% 22%" }}
              />
            </div>
            <div className="min-w-[240px] flex-1 text-center sm:text-left">
              <div className="mb-4 font-display text-xl font-bold text-gold-text">{CHEF.role}</div>
              <p className="m-0 mb-4 text-[15px] leading-[1.8] text-body italic">&quot;{CHEF.quote}&quot;</p>
              <p className="m-0 mb-5 text-sm leading-[1.7] text-muted">{CHEF.bio}</p>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {CHEF.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-cream px-3 py-1.5 text-xs font-semibold text-heading">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we stand for */}
      <section className="bg-cream px-5 py-20 sm:px-14">
        <div className="mx-auto max-w-[1200px] text-center">
          <div className="mx-auto mb-6 h-[5px] w-16 rounded-full bg-gold" />
          <h2 className="m-0 mb-12 font-display font-extrabold text-heading" style={{ fontSize: "clamp(26px,4.5vw,36px)" }}>
            WHAT WE STAND FOR
          </h2>
          <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl bg-surface px-6 py-9">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold text-[28px] [animation:iconPulse_2.6s_ease-in-out_infinite]">
                  {v.icon}
                </div>
                <div className="mb-2.5 font-display text-lg font-bold text-heading">{v.title}</div>
                <div className="text-sm leading-[1.6] text-muted">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="bg-cream px-5 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-22">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-6 h-[5px] w-16 rounded-full bg-gold" />
            <h2 className="m-0 mb-4 font-display font-extrabold text-heading" style={{ fontSize: "clamp(26px,4.5vw,36px)" }}>
              SUSTAINABILITY
            </h2>
            <p className="mx-auto max-w-[640px] text-base text-muted">
              Serving thousands daily while working to lighten our footprint on the planet.
            </p>
          </div>
          <div className="mb-14 grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {SUSTAINABILITY.map((s) => (
              <div key={s} className="flex items-start gap-3 rounded-[14px] border border-card-border bg-surface p-5">
                <span className="flex-none font-bold text-gold">✓</span>
                <span className="text-sm leading-[1.6] text-body">{s}</span>
              </div>
            ))}
          </div>
          <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {QUOTES.map((q) => (
              <div key={q.name} className="rounded-[20px] bg-surface p-9">
                <div className="m-0 mb-5 text-[15px] leading-[1.8] text-body italic">&quot;{q.text}&quot;</div>
                <div className="font-display text-base font-bold text-heading">{q.name}</div>
                <div className="mt-0.5 text-[13px] font-semibold tracking-[0.5px] text-gold-text">{q.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="bg-cream px-5 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-22">
        <div className="mx-auto max-w-[1000px] text-center">
          <div className="mx-auto mb-6 h-[5px] w-16 rounded-full bg-gold" />
          <h2 className="m-0 mb-4 font-display font-extrabold text-heading" style={{ fontSize: "clamp(26px,4.5vw,36px)" }}>
            AWARDS &amp; RECOGNITION
          </h2>
          <p className="mx-auto mb-10 max-w-[600px] text-base text-muted">
            Recognized back-to-back at the HYBIZ TV Food Awards for excellence in food and hospitality.
          </p>
          <div className="relative mb-7 overflow-hidden rounded-2xl" style={{ aspectRatio: "3/4" }}>
            <ClickableImage
              src="/images/hybiz-awards.jpg"
              alt="HYBIZ TV Food Awards trophies — 2024 and 2025"
              fill
              sizes="1000px"
              imgClassName="object-cover"
              imgStyle={{ objectPosition: "50% 0%" }}
            />
          </div>
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            <div className="rounded-[14px] bg-surface p-5">
              <div className="font-display text-base font-bold text-gold">HYBIZ TV Food Awards — 4th Edition</div>
              <div className="mt-1 text-[13px] text-muted">2025 · HICC Novotel, Hyderabad</div>
            </div>
            <div className="rounded-[14px] bg-surface p-5">
              <div className="font-display text-base font-bold text-gold">HYBIZ TV Food Awards — 3rd Edition</div>
              <div className="mt-1 text-[13px] text-muted">2024 · Taj Deccan, Hyderabad</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
