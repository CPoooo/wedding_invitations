"use server";

import { db } from "../../db/drizzle";        
import { rsvps } from "../../db/schema";

export type RsvpState =
  | { status: "idle" }
  | { status: "success"; attending: boolean }
  | { status: "error"; message: string };

const MAX_GUESTS = 6;

export async function submitRsvp(
  _prev: RsvpState,
  formData: FormData,
): Promise<RsvpState> {
  // name → text NOT NULL
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { status: "error", message: "Please tell us your name." };

  // attending → boolean NOT NULL (from the hidden input)
  const attending = formData.get("attending") === "true";

  // guestCount → integer, default 1, clamped
  let guestCount = Number(formData.get("guestCount") ?? 1);
  if (!Number.isFinite(guestCount) || guestCount < 1) guestCount = 1;
  guestCount = Math.min(Math.trunc(guestCount), MAX_GUESTS);

  // guestNames → text[] (one input per extra guest, capped at count - 1)
  const guestNames = formData
    .getAll("guestName")
    .map((g) => String(g).trim())
    .filter(Boolean)
    .slice(0, guestCount - 1);

  // optional fields → null when empty, matching nullable columns
  const dietaryRestrictions = String(formData.get("dietaryRestrictions") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim() || null;

  try {
    await db.insert(rsvps).values({
      name, attending, guestCount, guestNames, dietaryRestrictions, message,
    });
    return { status: "success", attending };
  } catch (err) {
    console.error("RSVP insert failed:", err);
    return { status: "error", message: "Something went wrong on our end — please try again." };
  }
}