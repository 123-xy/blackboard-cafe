import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: "Blackboard Cafe | Great Food, Great Life",
  description:
    "Welcome to Blackboard Cafe, where delicious food meets a warm and friendly atmosphere. Cafe dining, corporate catering, institutional catering, and event & exhibition catering in Hyderabad.",
};

export default function HomePage() {
  return <HomeClient />;
}
