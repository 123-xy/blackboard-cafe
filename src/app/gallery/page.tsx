import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import CoffeeCupSteam from "@/components/CoffeeCupSteam";
import ClickableImage from "@/components/ClickableImage";

export const metadata: Metadata = {
  title: "Gallery | Blackboard Cafe",
  description:
    "Moments from our café, kitchen, corporate accounts, and events — café interior, coffee bar, outdoor seating, signature dishes, event catering, and more.",
};

const CATEGORIES = ["Café Dining", "Institutional Catering", "Corporate Catering", "Event & Exhibition Catering"];

const TILES = [
  { label: "Drop a café interior photo", caption: "Café Interior", img: "/images/cafe-interior.jpg" },
  { label: "Drop an outdoor seating photo", caption: "Outdoor Seating", img: "/images/outdoor-seating.jpg" },
  { label: "Drop a signature dishes photo", caption: "Signature Dishes", img: "/images/signature-dishes.jpg" },
  { label: "Drop an event catering photo", caption: "Event Catering", img: "/images/event-catering.jpg" },
  { label: "Drop a fresh bakes photo", caption: "Fresh Bakes", img: "/images/fresh-bakes.jpg" },
  { label: "Drop a corporate setup photo", caption: "Corporate Setup", img: "/images/corporate-setup.jpg" },
  { label: "Drop a celebrations photo", caption: "Celebrations", img: "/images/celebrations.jpg" },
  { label: "Drop a behind-the-scenes photo", caption: "Behind the Scenes", img: "/images/behind-the-scenes.jpg" },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-cream font-body">
      <Header active="gallery" />

      <section className="relative overflow-hidden bg-dark px-5 py-10 text-center sm:px-8 sm:py-16 lg:px-14 lg:py-18">
        <Image src="/images/logo-badge.png" alt="" width={130} height={130} className="pointer-events-none absolute top-[12%] left-[6%] z-0 w-[130px] opacity-10 [animation:badgeFloatSm_9s_ease-in-out_infinite]" />
        <Image src="/images/logo-badge.png" alt="" width={150} height={150} className="pointer-events-none absolute bottom-[14%] right-[7%] z-0 w-[150px] opacity-[0.12] [animation:badgeFloatSm2_11s_ease-in-out_infinite]" />
        <CoffeeCupSteam className="absolute top-[10%] right-[20%] z-0 opacity-50" />

        <div className="relative z-10">
          <div className="mx-auto mb-6 h-[5px] w-16 rounded-full bg-gold" />
          <div className="mb-3.5 font-display text-sm font-bold tracking-[2px] text-gold">GALLERY</div>
          <h1 className="m-0 mb-5 font-display font-extrabold text-white" style={{ fontSize: "clamp(32px,7vw,52px)" }}>
            A LOOK INSIDE
          </h1>
          <p className="mx-auto mb-7 max-w-[560px] text-base text-muted-on-dark">
            Moments from our café, kitchen, corporate accounts, and events. Photos coming soon — placeholders shown below.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((c) => (
              <span key={c} className="rounded-full border border-[#3a362f] px-4 py-2 text-xs font-semibold tracking-[0.5px] text-gold">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1300px] px-5 py-9 sm:px-8 sm:py-18 lg:px-14 lg:py-20">
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {TILES.map((t) => (
            <div key={t.caption}>
              <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "4/3" }}>
                {t.img ? (
                  <ClickableImage src={t.img} alt={t.caption} fill sizes="300px" imgClassName="object-cover" />
                ) : (
                  <ImagePlaceholder label={t.label} />
                )}
              </div>
              <div className="mt-3.5 text-center font-display text-[15px] font-bold tracking-[0.5px] text-heading">
                {t.caption}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
