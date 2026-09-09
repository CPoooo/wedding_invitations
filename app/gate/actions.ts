"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function unlock(formData: FormData) {
    const password = String(formData.get("password") ?? "");
    const from = String(formData.get("from") ?? "");

    if (password && password === process.env.GATE_PASSWORD) {
        const jar = await cookies(); 
        jar.set("rc_gate", process.env.GATE_COOKIE_SECRET ?? "", {
            httpOnly: true,                          // invisible to browser JS
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,               // 30 days — enter once, stays welcome
        });
        // only ever redirect to internal paths (open-redirect guard)
        redirect(from.startsWith("/") ? from : "/");
    }

    redirect("/gate?e=1");
}