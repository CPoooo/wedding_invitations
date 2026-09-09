export type CollageItem =
  | { id: string; kind: "photo"; rotation: number; caption?: string }
  | { id: string; kind: "rsvp"; rotation: number };

export const collageItems: CollageItem[] = [
  { id: "1", kind: "photo", rotation: -3, caption: "the yes" },
  { id: "2", kind: "photo", rotation: 2 },
  { id: "3", kind: "photo", rotation: -1, caption: "lisbon, 2023" },
  { id: "4", kind: "rsvp", rotation: 3 },
];