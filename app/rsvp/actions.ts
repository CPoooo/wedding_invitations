"use server";

import { db } from "../../db/drizzle";
import { rsvps } from "../../db/schema";
import { MAX_EXTRA_GUESTS } from "./config";

export type RsvpState =
    | { status: "idle" }
    | { status: "success"; attending: boolean }
    | { status: "error"; message: string };

export async function submitRsvp(
    _prev: RsvpState,
    formData: FormData,
): Promise<RsvpState> {
    const name = String(formData.get("name") ?? "").trim();
    if (!name) return { status: "error", message: "Please tell us your name." };

    const attending = formData.get("attending") === "true";

    try {
        if (!attending) {
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

        // guests = named additional guests; blank slots are dropped
        const guestNames = formData
            .getAll("guestName")
            .map((g) => String(g).trim())
            .filter(Boolean)
            .slice(0, MAX_EXTRA_GUESTS);

        // headcount = the person filling this out + named guests
        const guestCount = guestNames.length + 1;

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