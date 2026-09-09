export type StickerVariant = "polaroid" | "pad" | "bare";

export type PhotoItem = {
    id: string;
    kind: "photo";
    src?: string;              // omit → renders gray placeholder for now
    alt: string;
    variant: StickerVariant;
    padColor?: string;         // only used by "pad" variant
    aspect: string;            // tailwind class, e.g. "aspect-[3/4]"
    rotation: number;          // degrees
    tape?: "top" | "corner" | null;
    caption?: string;
};

export type StickerItem = {  // loose decorative PNGs between photos
    id: string;
    kind: "sticker";
    src: string;
    width: string;             // e.g. "w-24"
    rotation: number;
};

export type CollageItem = PhotoItem | StickerItem | { id: string; kind: "rsvp"; rotation: number };

export const collageItems: CollageItem[] = [
    {
        id: "1", kind: "photo", alt: "", variant: "polaroid",
        aspect: "aspect-[4/5]", rotation: -3, tape: "top", caption: "the yes",
    },
    {
        id: "2", kind: "photo", alt: "", variant: "pad", padColor: "#101c2c",
        aspect: "aspect-[3/4]", rotation: 2,
    },
    {
        id: "3", kind: "sticker", src: "/images/sticker-heart.png",
        width: "w-16", rotation: 8,
    },
    {
        id: "4", kind: "photo", alt: "", variant: "bare",
        aspect: "aspect-square", rotation: -2,
    },
    {
        id: "5", kind: "photo", alt: "", variant: "polaroid",
        aspect: "aspect-[3/4]", rotation: 4, caption: "first date",
    },
    {
        id: "6", kind: "sticker", src: "/images/sticker-flower.png",
        width: "w-20", rotation: -10,
    },
    {
        id: "7", kind: "photo", alt: "", variant: "pad", padColor: "#8a9a7b",
        aspect: "aspect-[4/5]", rotation: -1,
    },
    {
        id: "8", kind: "rsvp", rotation: 3,
    },
    {
        id: "9", kind: "photo", alt: "", variant: "bare",
        aspect: "aspect-[16/10]", rotation: 2,
    },
    {
        id: "10", kind: "sticker", src: "/images/sticker-bow.png",
        width: "w-14", rotation: 12,
    },
    {
        id: "11", kind: "photo", alt: "", variant: "polaroid",
        aspect: "aspect-[5/7]", rotation: -4, tape: "corner", caption: "golden hour",
    },
    {
        id: "12", kind: "sticker", src: "/images/sticker-coffee.png",
        width: "w-24", rotation: -6,
    },
];