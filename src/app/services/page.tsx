import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import CoffeeCupSteam from "@/components/CoffeeCupSteam";
import ClickableImage from "@/components/ClickableImage";

export const metadata: Metadata = {
  title: "Services | Blackboard Cafe",
  description:
    "Premium café & dining, conference & meeting facilities, institutional catering, corporate catering, event & exhibition catering, and customized catering solutions.",
};

const STATS = [
  { value: "4,000+", label: "STUDENTS SERVED DAILY" },
  { value: "1,000+", label: "EMPLOYEE CATERING CAPACITY" },
  { value: "HITEX", label: "EXHIBITION CENTRE EXPERIENCE" },
];

const SERVICES = [
  { icon: "☕", title: "Premium Café & Dining", desc: "Multi-cuisine food and beverages in a cozy, welcoming café setting for walk-in guests.", tag: "Café Experience", placeholder: "Drop a café & dining photo", img: "/images/premium-cafe-dining.jpg" },
  { icon: "🏢", title: "Conference & Meeting Facilities", desc: "Conference and meeting room facilities alongside a co-working friendly environment for teams and guests alike.", tag: "Co-Working Friendly", placeholder: "Drop a conference/meeting photo", img: "/images/conference-meeting.jpg" },
  { icon: "🎓", title: "Institutional Catering", desc: "Nutritious, affordable, hygienic meals for schools, colleges, and large institutions, with meal-card and cashless payment systems.", tag: "4,000+ Students Daily", placeholder: "Drop an institutional catering photo", img: "/images/institutional-catering.png" },
  { icon: "🏭", title: "Corporate Catering", desc: "Customized weekly and monthly menus run from centralized kitchen operations, built for reliability at scale.", tag: "1,000+ Employees", placeholder: "Drop a corporate catering photo", img: "/images/corporate-catering.png" },
  { icon: "🎪", title: "Event & Exhibition Catering", desc: "High-volume catering for trade fairs, exhibitions, conferences, and corporate events — including at HITEX Exhibition Centre.", tag: "HITEX Exhibition Centre", placeholder: "Drop an event/exhibition photo", img: "/images/event-exhibition-catering.jpg" },
  { icon: "🍹", title: "Customized Catering Solutions", desc: "Tailored multi-cuisine menus built around each client’s scale and occasion, backed by an experienced leadership team.", tag: "Tailored to Scale", placeholder: "Drop a catering solutions photo", img: "/images/customized-catering.jpg" },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-cream font-body">
      <Header active="services" />

      <section className="relative overflow-hidden bg-dark px-5 py-10 text-center sm:px-8 sm:py-16 lg:px-14 lg:py-18">
        <Image src="/images/logo-badge.png" alt="" width={130} height={130} className="pointer-events-none absolute top-[12%] left-[6%] z-0 w-[130px] opacity-10 [animation:badgeFloatSm_9s_ease-in-out_infinite]" />
        <Image src="/images/logo-badge.png" alt="" width={150} height={150} className="pointer-events-none absolute bottom-[14%] right-[7%] z-0 w-[150px] opacity-[0.12] [animation:badgeFloatSm2_11s_ease-in-out_infinite]" />
        <CoffeeCupSteam className="absolute top-[10%] right-[20%] z-0 opacity-50" />

        <div className="relative z-10">
          <div className="mx-auto mb-6 h-[5px] w-16 rounded-full bg-gold" />
          <div className="mb-3.5 font-display text-sm font-bold tracking-[2px] text-gold">SERVICES</div>
          <h1 className="m-0 mb-5 font-display font-extrabold text-white" style={{ fontSize: "clamp(32px,7vw,52px)" }}>
            WHAT WE OFFER
          </h1>
          <p className="mx-auto mb-10 max-w-[560px] text-base text-muted-on-dark">
            Beyond the café counter — hospitality and catering built for workplaces, institutions, and events.
          </p>
          <div className="mx-auto grid max-w-[900px] gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-[28px] font-extrabold text-gold">{s.value}</div>
                <div className="mt-1.5 text-xs tracking-[0.5px] text-muted-on-dark">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1300px] px-5 py-9 sm:px-8 sm:py-18 lg:px-14 lg:py-20">
        <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {SERVICES.map((s) => (
            <div key={s.title} className="overflow-hidden rounded-[18px] border border-card-border bg-surface">
              <div className="relative h-40 w-full">
                {s.img ? (
                  <ClickableImage src={s.img} alt={s.title} fill sizes="400px" imgClassName="object-cover" />
                ) : (
                  <ImagePlaceholder label={s.placeholder} />
                )}
              </div>
              <div className="flex gap-5.5 p-9">
                <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full border-2 border-gold text-2xl text-gold [animation:iconPulse_2.6s_ease-in-out_infinite]">
                  {s.icon}
                </div>
                <div>
                  <div className="mb-2.5 font-display text-xl font-bold text-heading">{s.title}</div>
                  <div className="mb-3.5 text-sm leading-[1.7] text-muted">{s.desc}</div>
                  <span className="rounded-full bg-cream px-3 py-1.5 text-xs font-semibold text-gold-text">{s.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-dark px-5 py-8 sm:px-8 sm:py-14 lg:px-14">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="m-0 mb-2 font-display font-extrabold text-white" style={{ fontSize: "clamp(22px,4vw,30px)" }}>
              Planning an event or looking for a catering partner?
            </h2>
            <p className="m-0 text-[15px] text-muted-on-dark">
              Let&apos;s talk about how Blackboard Cafe can serve your team or event.
            </p>
          </div>
          <Link
            href="/contact"
            className="rounded-lg bg-gold px-8 py-4.5 text-sm font-bold tracking-[0.5px] text-dark no-underline shadow-[0_4px_0_#C97F16]"
          >
            GET IN TOUCH
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
