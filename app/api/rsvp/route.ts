import { NextResponse } from "next/server";
import { db } from "@/db/drizzle"
import { rsvps } from "@/db/schema"

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body.name || typeof body.attending !== "boolean") {
            return NextResponse.json({ error: "name and attending are required" }, { status: 400 });
        }

        const [saved] = await db.insert(rsvps).values({
            name: body.name,
            attending: body.attending,
            guestCount: body.guestCount ?? 1,
            guestNames: body.guestNames ?? [],  // drizzle accepts string[] for .array() columns
            dietaryRestrictions: body.dietaryRestrictions || null,
            message: body.message || null,
        }).returning();

        return NextResponse.json({ ok: true, id: saved.id });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}