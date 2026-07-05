import { z } from "zod";

// ---------- Reservation creation ----------
export const reservationSchema = z.object({
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255)
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^[+]?[\d\s-]{10,15}$/, "Please enter a valid phone number")
    .trim(),
  guests: z
    .number({ error: "Number of guests is required" })
    .int("Guests must be a whole number")
    .min(1, "At least 1 guest is required")
    .max(10, "Maximum 10 guests per booking"),
  reservationDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .refine(
      (val) => {
        const date = new Date(val + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      { message: "Cannot book a date in the past" }
    ),
  reservationTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid time format (use HH:mm)"),
  notes: z.string().max(500, "Notes must be at most 500 characters").optional().default(""),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type ReservationFormInput = z.input<typeof reservationSchema>;

// ---------- Status update ----------
export const updateReservationSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"], {
    error: "Status must be PENDING, CONFIRMED, COMPLETED, or CANCELLED",
  }),
});

export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;

// ---------- Availability query ----------
export const availabilityQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (use YYYY-MM-DD)")
    .refine(
      (val) => {
        const date = new Date(val + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      { message: "Cannot check availability for past dates" }
    ),
});

// ---------- Confirmation code lookup ----------
export const confirmationCodeSchema = z.object({
  code: z
    .string()
    .length(8, "Confirmation code must be 8 characters")
    .toUpperCase()
    .trim(),
});

// ---------- Contact inquiry ----------
const noHtml = (label: string) =>
  z
    .string()
    .refine((val) => !/<[a-z][\s\S]*>/i.test(val), `${label} must not contain HTML`);

export const inquirySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim()
    .and(noHtml("Name")),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255)
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .max(20, "Phone number must be at most 20 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .min(2, "Subject is required")
    .max(150, "Subject must be at most 150 characters")
    .trim()
    .and(noHtml("Subject")),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must be at most 2000 characters")
    .and(noHtml("Message")),
  // Honeypot — must stay empty. Real users never see or fill this field.
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
  recaptchaToken: z.string().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

// ---------- Inquiry status update ----------
export const updateInquirySchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED"], {
    error: "Status must be NEW, IN_PROGRESS, or RESOLVED",
  }),
});

export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>;
