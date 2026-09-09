import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const unlocked =
        request.cookies.get("rc_gate")?.value === process.env.GATE_COOKIE_SECRET;

    // the gate itself: strangers may see it, unlocked users skip past it
    if (pathname === "/gate") {
        if (unlocked) {
            const url = request.nextUrl.clone();
            url.pathname = "/";
            url.search = "";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    if (unlocked) return NextResponse.next();

    // no wristband → to the gate, remembering where they were headed
    const url = request.nextUrl.clone();
    url.pathname = "/gate";
    url.search = pathname === "/" ? "" : `?from=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
}

export const config = {
    // everything except Next internals, assets, and the gate's own needs
    matcher: ["/((?!_next|images|sounds|favicon.ico).*)"],
};