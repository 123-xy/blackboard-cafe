import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CoffeeCupSteam from "@/components/CoffeeCupSteam";
import ContactForm from "@/components/contact/ContactForm";
import ContactMap from "@/components/contact/ContactMap";
import FaqAccordion from "@/components/contact/FaqAccordion";

export const metadata: Metadata = {
  title: "Contact | Blackboard Cafe",
  description:
    "Questions, bookings, or catering enquiries — reach Blackboard Cafe by phone, email, or the contact form. Located in Hyderabad, Telangana, India.",
};

const CONTACT_DETAILS = [
  {
    label: "PHONE",
    value: "+91 99496-70225",
    href: "tel:9949670225",
    note: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M4 4h4l2 4-2 1.5a10 10 0 0 0 3.5 3.5L13 11l4 2v4a1 1 0 0 1-1 1A16 16 0 0 1 3 5a1 1 0 0 1 1-1z"
          stroke="#F2A93B"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    label: "EMAIL",
    value: "venuacha@whiteboard.cafe",
    href: "mailto:venuacha@whiteboard.cafe",
    note: "For corporate, institutional & event catering enquiries",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="5" width="16" height="10" rx="1.5" stroke="#F2A93B" strokeWidth="1.5" />
        <path d="M2 6l8 5 8-5" stroke="#F2A93B" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "LOCATION",
    value: "Blackboard Cafe, Hyderabad, Telangana, India",
    href: null,
    note: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 18s6-5 6-9.5a6 6 0 0 0-12 0C4 13 10 18 10 18z" stroke="#F2A93B" strokeWidth="1.5" />
        <circle cx="10" cy="8.5" r="2" stroke="#F2A93B" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream font-body">
      <Header active="contact" />

      {/* Dark hero */}
      <section className="relative overflow-hidden bg-dark px-5 py-10 text-center sm:px-8 sm:py-16 lg:px-14 lg:py-18">
        <Image src="/images/logo-badge.png" alt="" width={130} height={130} className="pointer-events-none absolute top-[12%] left-[6%] z-0 w-[130px] opacity-10 [animation:badgeFloatSm_9s_ease-in-out_infinite]" />
        <Image src="/images/logo-badge.png" alt="" width={150} height={150} className="pointer-events-none absolute bottom-[14%] right-[7%] z-0 w-[150px] opacity-[0.12] [animation:badgeFloatSm2_11s_ease-in-out_infinite]" />
        <CoffeeCupSteam className="absolute top-[10%] right-[20%] z-0 opacity-50" />

        <div className="relative z-10">
          <div className="mx-auto mb-6 h-[5px] w-16 rounded-full bg-gold" />
          <div className="mb-3.5 font-display text-sm font-bold tracking-[2px] text-gold">CONTACT</div>
          <h1 className="m-0 mb-5 font-display font-extrabold text-white" style={{ fontSize: "clamp(32px,7vw,52px)" }}>
            GET IN TOUCH
          </h1>
          <p className="mx-auto max-w-[560px] text-base text-muted-on-dark">
            Questions, bookings, or catering enquiries — we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Gold info band */}
      <section className="bg-gold px-5 py-4.5 sm:px-8 lg:px-14">
        <div className="mx-auto flex max-w-[1300px] flex-wrap items-center justify-center gap-9 text-sm font-semibold text-dark">
          <span>🏢 Corporate Offices</span>
          <span>🎓 Educational Institutions</span>
          <span>🎪 Exhibition Venues</span>
          <span className="opacity-70">A Bevgo Ventures Pvt. Ltd. brand</span>
        </div>
      </section>

      {/* Contact info + form */}
      <section
        className="mx-auto grid max-w-[1300px] gap-12 px-5 py-9 sm:px-8 sm:py-18 lg:px-14 lg:py-20"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
      >
        <div>
          <div className="mb-9 flex flex-col gap-6">
            {CONTACT_DETAILS.map((d) => (
              <div key={d.label} className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full border-2 border-gold [animation:iconPulse_2.6s_ease-in-out_infinite]">
                  {d.icon}
                </div>
                <div>
                  <div className="mb-1 font-display text-[15px] font-bold text-heading">{d.label}</div>
                  {d.href ? (
                    <a href={d.href} className="text-[15px] text-muted no-underline">
                      {d.value}
                    </a>
                  ) : (
                    <div className="text-[15px] leading-[1.6] text-muted">{d.value}</div>
                  )}
                  {d.note && <div className="mt-1.5 text-[13px] text-muted-on-dark-2">{d.note}</div>}
                </div>
              </div>
            ))}
          </div>

          <ContactMap />
        </div>

        <ContactForm />
      </section>

      {/* FAQ */}
      <section className="bg-cream px-5 pb-12 sm:px-8 sm:pb-16 lg:px-14 lg:pb-22">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-11 text-center">
            <div className="mx-auto mb-6 h-[5px] w-16 rounded-full bg-gold" />
            <h2 className="m-0 font-display font-extrabold text-heading" style={{ fontSize: "clamp(24px,4vw,32px)" }}>
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      <Footer />
    </div>
  );
}
