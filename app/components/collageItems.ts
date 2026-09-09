/* ── shared placement vocabulary ── */
export type Placed = {
    col: "left" | "right";                // which column of the board
    width: string;                        // % of column for photos (can exceed 100% to span the gutter), rem for stickers
    align: "left" | "right" | "center";   // side-hug within the column
    mt?: string;                          // "mt-4" = rhythm · "-mt-12" = pull over predecessor
    z?: string;
    rotation: number;
};

export const alignCls = { left: "mr-auto", right: "ml-auto", center: "mx-auto" } as const;

export type StickerVariant = "polaroid" | "pad" | "bare";

export type PhotoItem = Placed & {
    id: string; kind: "photo"; src?: string; alt: string;
    variant: StickerVariant; padColor?: string; aspect: string;
    tape?: "top" | "corner" | null; caption?: string;
};
export type StickerItem = Placed & { id: string; kind: "sticker"; src: string };
export type RsvpItem = Placed & { id: string; kind: "rsvp" };
export type BadgeItem = Placed & {
    id: string; kind: "badge"; kicker: string; title: string; href: string;
};

export type CollageItem = PhotoItem | StickerItem | RsvpItem | BadgeItem;

/* Two dense columns, art-directed. Right column starts lower (board offset)
   → zigzag. Pull-ups + opposing tilts → tangles. Widths >100% cross the gutter. */
export const collageItems: CollageItem[] = [
    /* ── LEFT COLUMN ── */
    {
        id: "1", kind: "photo", alt: "", variant: "polaroid", aspect: "aspect-[4/5]",
        tape: "top", caption: "the yes", col: "left",
        width: "w-[92%]", align: "center", z: "z-10", rotation: -3
    },

    {
        id: "2", kind: "sticker", src: "/images/sticker-flower.png", col: "left",
        width: "w-28", align: "right", mt: "-mt-14", z: "z-20", rotation: 14
    },

    {
        id: "3", kind: "badge", kicker: "The", title: "Details", href: "/details", col: "left",
        width: "w-40", align: "center", mt: "-mt-10", z: "z-30", rotation: -6
    },

    {
        id: "4", kind: "photo", alt: "", variant: "pad", padColor: "#a9b5a0",
        aspect: "aspect-[3/4]", col: "left",
        width: "w-[85%]", align: "center", mt: "-mt-6", rotation: 3
    },

    // spans the gutter — 112% wide, centered, sticks out both sides
    {
        id: "5", kind: "photo", alt: "", variant: "bare", aspect: "aspect-[16/10]", col: "left",
        width: "w-[112%]", align: "center", mt: "mt-2", z: "z-10", rotation: -2
    },

    {
        id: "6", kind: "badge", kicker: "Frequently Asked", title: "Questions", href: "/faq", col: "left",
        width: "w-44", align: "center", mt: "-mt-8", z: "z-30", rotation: -3
    },

    /* ── RIGHT COLUMN (board offsets it down) ── */
    {
        id: "7", kind: "photo", alt: "", variant: "polaroid", aspect: "aspect-square",
        caption: "first date", col: "right",
        width: "w-[82%]", align: "center", z: "z-10", rotation: 4
    },

    {
        id: "8", kind: "sticker", src: "/images/sticker-bow.png", col: "right",
        width: "w-20", align: "left", mt: "-mt-12", z: "z-30", rotation: -12
    },

    {
        id: "9", kind: "rsvp", col: "right",
        width: "w-[95%]", align: "center", mt: "-mt-4", z: "z-20", rotation: 3
    },

    {
        id: "10", kind: "badge", kicker: "Our Love", title: "Story", href: "/story", col: "right",
        width: "w-40", align: "left", mt: "-mt-10", z: "z-30", rotation: 5
    },

    {
        id: "11", kind: "photo", alt: "", variant: "pad", padColor: "#f7f3e8",
        aspect: "aspect-square", col: "right",
        width: "w-[88%]", align: "center", mt: "mt-2", rotation: 2
    },
];