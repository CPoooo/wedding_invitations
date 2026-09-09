"use server";

import { db } from "../../db/drizzle";
import { rsvps } from "../../db/schema";

export type RsvpState =
    | { status: "idle" }
    | { status: "success"; attending: boolean }
    | { status: "error"; message: string };

const MAX_GUESTS = 2; // just a plus one? or should some people have more guests?

export async function submitRsvp(
    _prev: RsvpState,
    formData: FormData,
): Promise<RsvpState> {
    const name = String(formData.get("name") ?? "").trim();
    if (!name) return { status: "error", message: "Please tell us your name." };

    const attending = formData.get("attending") === "true";

    try {
        if (!attending) {
            // decline: 0 guests, everything else null — fields aren't shown, so none arrive
            await db.insert(rsvps).values({
                name,
                attending: false,
                guestCount: 0,
                guestNames: [],
                dietaryRestrictions: null,
                message: null,
            });
            return { status: "success", attending: false };
        }

        // ── accept path, unchanged ──
        let guestCount = Number(formData.get("guestCount") ?? 1);
        if (!Number.isFinite(guestCount) || guestCount < 1) guestCount = 1;
        guestCount = Math.min(Math.trunc(guestCount), MAX_GUESTS);

        const guestNames = formData
            .getAll("guestName")
            .map((g) => String(g).trim())
            .filter(Boolean)
            .slice(0, guestCount - 1);

        const dietaryRestrictions = String(formData.get("dietaryRestrictions") ?? "").trim() || null;
        const message = String(formData.get("message") ?? "").trim() || null;

        await db.insert(rsvps).values({
            name, attending, guestCount, guestNames, dietaryRestrictions, message,
        });
        return { status: "success", attending: true };
    } catch (err) {
        console.error("RSVP insert failed:", err);
        return { status: "error", message: "Something went wrong on our end — please try again." };
    }
}