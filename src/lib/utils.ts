import { customAlphabet } from "nanoid";
import { format, parse } from "date-fns";

// ---------- Confirmation code ----------
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0,O,1,I to avoid confusion
const nanoid = customAlphabet(alphabet, 8);

export function generateConfirmationCode(): string {
  return nanoid();
}

// ---------- Date / time helpers ----------
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMMM d, yyyy");
}

export function formatTime(time: string): string {
  const parsed = parse(time, "HH:mm", new Date());
  return format(parsed, "h:mm a");
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy");
}

// ---------- Classname merge ----------
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
