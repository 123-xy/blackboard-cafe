import type { Metadata } from "next";
import BookATableClient from "./BookATableClient";

export const metadata: Metadata = {
  title: "Book a Table | Blackboard Cafe",
  description:
    "Reserve a table at Blackboard Cafe, Hyderabad. Choose your date, time, and number of guests for a delightful dining experience.",
};

export default function BookATablePage() {
  return <BookATableClient />;
}
