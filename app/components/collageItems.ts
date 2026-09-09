export type CollageItem =
  | { id: string; kind: "photo"; rotation: number; caption?: string }
  | { id: string; kind: "rsvp"; rotation: number };

export const collageItems: CollageItem[] = [
  { id: "1", kind: "photo", rotation: -3, caption: "the yes" },
  { id: "2", kind: "photo", rotation: 2 },
  { id: "3", kind: "photo", rotation: -1, caption: "Hawaii, 2025" },
  { id: "5", kind: "photo", rotation: -2 },
  { id: "6", kind: "photo", rotation: 1 },
  { id: "4", kind: "rsvp", rotation: 2 },
  { id: "7", kind: "photo", rotation: -1 },
  { id: "8", kind: "photo", rotation: 2 },
  { id: "9", kind: "photo", rotation: 3 },
  { id: "10", kind: "photo", rotation: 2 },
  { id: "11", kind: "photo", rotation: 2 },
];