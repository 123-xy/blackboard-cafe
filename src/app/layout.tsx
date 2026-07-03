import type { Metadata } from "next";
import { Baloo_2, Poppins } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Blackboard Cafe | Great Food, Great Life",
  description:
    "Blackboard Cafe is a Hyderabad-based cafe and hospitality & catering brand, a Bevgo Ventures Pvt. Ltd. company. Cafe dining, corporate catering, institutional catering, and event & exhibition catering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${baloo.variable} ${poppins.variable}`}>
      <body className="bg-cream text-body antialiased">{children}</body>
    </html>
  );
}
