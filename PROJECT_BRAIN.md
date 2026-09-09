# PROJECT BRAIN — Rachel & Cameron Wedding Invitation
---

## 1. What this is

A single-page wedding invitation experience with this user flow:

1. Guest lands → sees a closed envelope (full-screen overlay, page not scrollable)
2. Click envelope → sound plays → (currently: overlay slides up — real animation pending, Task B1)
3. Beneath: a Pinterest-style collage board of polaroid/sticker cards that reveal on scroll
4. One card is an RSVP card → links to `/rsvp`
5. RSVP form posts via **Server Action** → persisted in **Neon Postgres** via **Drizzle**

Couple: **Rachel & Cameron**. Aesthetic: **old money / heirloom stationery** — ivory paper,
hunter green, wine, brass gold, Cormorant Garamond + Pinyon Script, hairline rules,
small-caps letterspaced "eyebrows". No hard-coded hex in components — use theme tokens.

## 2. Stack & non-negotiable conventions

- **Next.js App Router + TypeScript**, `framer-motion` for animation
- **Tailwind v4** — NO `tailwind.config.js`. Theme lives in `app/globals.css` via `@theme`.
  Semantic utilities: `bg-surface`, `bg-surface-raised`, `text-ink`, `text-ink-soft`,
  `bg-accent`, `bg-accent-deep`, `text-gold`, `bg-wine`, `border-line`, `border-line-strong`,
  `font-display`, `font-monogram`, plus a custom `eyebrow` utility.
  → **Rule: components never hard-code hex values.**
- **Fonts** wired in `app/layout.tsx` via next/font: `--font-cormorant` (Cormorant Garamond),
  `--font-script` (Pinyon Script). These variable names are load-bearing — they're referenced
  inside `@theme` as `--font-display` / `--font-monogram`.
- **Components are FLAT** in `app/components/` — no subfolders. Do not introduce them.
- All collage content is **data-driven** in `app/components/collageItems.ts` (discriminated
  union). Adding images = editing data, not components.
- Animation springs: `{ type: "spring", stiffness: 110, damping: 14 }` (shared constant in
  `app/components/motion.ts` / duplicated locally in cards). (should resolve this into a motion.ts file if we really want to but for now it is working via duplication)
- **No sessionStorage / "skip envelope" logic** — intentionally removed. Envelope opens every visit.
- Names/monogram are hard-coded (no `couple.ts` by owner's choice). Always "Rachel & Cameron",
  monogram "R&C".

## 3. Current file map

```
app/
├── layout.tsx                  # fonts, metadata "Rachel & Cameron"
├── globals.css                 # @theme tokens, paper grain, eyebrow utility
├── page.tsx                    # renders <ExperienceGate /> — nothing else
├── components/                 # FLAT — no subfolders
│   ├── ExperienceGate.tsx      # owns phase state + sound + scroll lock; renders envelope + board
│   ├── Envelope.tsx            # closed envelope (letterhead, layered CSS envelope, seal, CTA)
│   ├── CollageBoard.tsx        # masonry via CSS columns; includes LooseSticker internally
│   ├── CollageCard.tsx         # photo cards: variants polaroid | pad | bare
│   ├── RsvpCard.tsx            # links to /rsvp, same reveal treatment
│   ├── useReveal.ts            # shared scroll-reveal hook
│   └── collageItems.ts         # 15-item data array (photos have no src yet → gray placeholders)
├── rsvp/
│   ├── page.tsx                # "use client" form; useActionState; stationery design; ThankYou view
│   └── actions.ts              # "use server" submitRsvp(_prev, formData) → inserts via Drizzle
db/
├── drizzle.ts                       # Drizzle client for Neon (pre-existing)
└── schema.ts                   # rsvps table (pre-existing)
public/
├── images/                     # sticker PNGs + photos go here
└── sounds/                     # open.mp3 referenced by ExperienceGate (file may not exist yet)
```

## 4. Architecture (how the pieces work — read before touching anything)

### 4.1 Phase machine (ExperienceGate)
- `type Phase = "sealed" | "opening" | "open"` owned by ExperienceGate.
- Scroll lock: `document.body.style.overflow` tied to phase, cleanup on unmount.
- Click → play `/sounds/open.mp3` **inside the click handler** (autoplay policy) → `"opening"`
  → Envelope calls `onOpened()` → `"open"` → AnimatePresence slides overlay up (0.9s).
- Board is always mounted **behind** the overlay (preloads images while guest reads envelope).
- `revealed` boolean flips true 1200ms after open — ends the entrance-stagger window.

### 4.2 Reveal system (the one rule)
`visible = open && inView` — implemented in `useReveal(ref, { open, revealed, index })` →
`{ visible, delay }`. Rationale: IntersectionObserver can't see the overlay, so visibility
must be gated on BOTH the phase and geometry. `useInView` with `{ once: true,
margin: "0px 0px -60px 0px" }`. `delay` = stagger (`0.2 + index*0.08`, capped 0.7) until
`revealed`, then 0. ALL board children (CollageCard, RsvpCard, LooseSticker) use it, with
`animate={visible ? {...in} : {...out}}` two-state form. New board components MUST follow this.

### 4.3 Collage data model
```ts
type StickerVariant = "polaroid" | "pad" | "bare";
type PhotoItem   = { id; kind: "photo"; src?; alt; variant; padColor?; aspect; rotation; tape?: "top"|"corner"|null; caption? }
type StickerItem = { id; kind: "sticker"; src; width; rotation }
type CollageItem = PhotoItem | StickerItem | { id; kind: "rsvp"; rotation }
```
Layout: CSS columns (`columns-2 md:columns-3`). Cards: `break-inside-avoid mb-4`, small
rotation, `whileHover={{ rotate: 0, scale: 1.05, zIndex: 40 }}`. Die-cut outline via
box-shadow trick: `shadow-[0_0_0_5px_<paper>,0_12px_28px_rgba(40,35,25,0.22)]`.

### 4.4 RSVP server action contract
`app/rsvp/actions.ts` → `submitRsvp(_prev: RsvpState, formData: FormData): Promise<RsvpState>`
where `RsvpState = { status: "idle" } | { status: "success"; attending: boolean } | { status: "error"; message: string }`.
Page uses `useActionState` (React 19 / Next 15; on Next 14 it's `useFormState` from `react-dom`).
Form fields: `name`, hidden `attending` ("true"/"false"), `guestCount`, repeated `guestName`,
`dietaryRestrictions`, `message`. Optional text fields → `null` when empty. `guestNames`
capped at `guestCount - 1`, `MAX_GUESTS = 6`.

### 4.5 DB schema (fixed — do not change without owner)
```ts
rsvps: id (uuid pk), name (text NOT NULL), attending (boolean NOT NULL),
guest_count (int NOT NULL default 1), guest_names (text[]),
dietary_restrictions (text), message (text), created_at (timestamptz)
```

## 5. Known gotchas (learned the hard way)

- CSS columns fill top-to-bottom per column — item order ≠ visual left-to-right order.
- `box-shadow` is clipped away by `clip-path`; use `filter: drop-shadow(...)` for shaped elements.
- Audio must start inside a user-gesture handler.
- A `date`-math component WILL hydration-mismatch — render placeholder until mounted (Task C4).
- `useInView` doesn't know about the overlay — always gate on `open` too (§4.2).
- Tailwind v4: `font-display`/`font-monogram` come from `@theme --font-*` entries.
- next/font caches aggressively — restart dev server if fonts look stale.

## 6. Outstanding inconsistency
Envelope seal and RSVP letterhead still say "A&M" / "Adeline & Morgan" (from an old reference
photo) — must become "R&C" / "Rachel & Cameron". Covered in Task A1.

---

## 7. TASKS (feed one per chat, in order within a phase)

### Phase A — Cleanup & content

**[ ] A1 — Name sweep + repo hygiene** · *no dependencies*
Files: Envelope.tsx, rsvp/page.tsx (letterhead + ThankYou), public/.
Replace every "Adeline"/"A&M" with "Rachel"/"Cameron"/"R&C". Delete unused Vercel SVGs from
public/. Done when: grep finds no "Adeline"; no stray svg files.

**[ ] A2 — Reply-by date** · *blocked on info from Rachel*
Files: rsvp/page.tsx ("Kindly reply by May 1st" placeholder). Swap in real date.

**[ ] A3 — Real collage images** · *owner exports from Canva first*
Owner exports photos (plain images — frames are CSS, do NOT bake frames into the images) and
transparent sticker PNGs into public/images/. AI updates collageItems.ts: add `src`/`alt`,
tune each `aspect` to the photo's real shape (keep variety for masonry stagger), adjust
rotations/captions. Swap `<img>` for next/image (`fill` inside the aspect container) if
instructed. Done when: no gray placeholders, no broken stickers, scroll feels balanced.

**[ ] A4 — Sound files** · *owner sources audio*
Owner drops `open.mp3` (short paper rustle) and `song.mp3` (for Task C3) into public/sounds/.
Code path already exists for open.mp3 — just verify it plays. Keep files small (<300KB).

### Phase B — The envelope showpiece

**[ ] B1 — Real envelope-opening choreography** · *the priority showpiece*
Files: Envelope.tsx (+ ExperienceGate exit timing). Envelope already has layered DOM: back
panel, letter, front face, flap (`clip-path: polygon(0 0,100% 0,50% 100%)`, h-[58%]), seal.
Choreography spec (staggered, total ~1.6–2s): (1) flap rotates open — wrap in perspective
(`transformPerspective: 800`), `rotateX: -180`, origin top, duration ~0.7s ease-in; flap
zIndex must drop from 40 to 10 mid-flip (animate zIndex with `times: [0, 0.5, 1]`) so the
letter can pass over it; (2) seal — since it's its own layer, fade/scale it out attached to
the flap's motion (or move it into the flap element so it rotates away naturally — pick one,
be consistent); (3) letter rises (`y` from its resting spot up ~120px, slight delay after
flap starts); (4) then existing overlay exit slides everything away and `onOpened()` fires.
Keep `phase === "opening"` driving it; `onOpened()` must fire AFTER the sequence (use a
final `onAnimationComplete` or a timeout matched to total duration). Adjust the `revealed`
timer (currently 1200ms) to sit just after the new total. Done when: flap visibly hinges,
letter emerges, no z-fighting glitches, sound syncs, board stagger still lands.

### Phase C — Board upgrades

**[ ] C1 — Tighter, overlapping collage** · *after A3*
Files: collageItems.ts (+ CollageCard/LooseSticker). CSS columns can't overlap, so add an
optional `overlap?: string` field (a negative margin class like `"-mt-8"`) to PhotoItem and
StickerItem, applied before `mb-4`. Curate the data so adjacent items tuck into each other
(overlap + rotation = scrapbook feel). Keep hover straighten/pop working — zIndex already
handled on hover. Done when: cards visibly overlap without breaking masonry flow.

**[ ] C2 — Our Story component** · *independent; follows §4.2 reveal pattern*
New: app/components/OurStory.tsx; render inside CollageBoard above or below the grid.
Alternating rows (desktop): polaroid-style photo + prose paragraph, hairline ornament
between rows (reuse the ❦ ornament pattern from rsvp page). Same tokens, `font-display`
italic accents, eyebrow section label ("How we met"). Owner supplies photos + copy later —
build with placeholders. Must use useReveal for entrance.

**[ ] C3 — Record player song component** · *needs A4 song.mp3*
New: app/components/RecordPlayer.tsx. CSS/vinyl: disc = rounded-full with repeating radial
gradient grooves + center label (accent green), tonearm div that rotates onto the disc when
playing. Click toggles audio (new Audio("/sounds/song.mp3"), pause NOT reload on toggle).
Disc spins (`animate={{ rotate: 360 }}` infinite linear) only while playing. Must be a click
gesture (autoplay policy). Style with tokens; small eyebrow label ("our song"). Add to board
via collageItems (new kind `"record"`?) or as a standalone section — implementer's call,
but keep content data-driven where reasonable.

**[ ] C4 — Countdown component** · *independent — hydration-safe*
New: app/components/Countdown.tsx. Target date as a named constant at top. Render "— —" or
skeleton until mounted (`useEffect` setMounted), THEN start `setInterval` 1s tick and compute
days/hours/min/sec. Display: four Cormorant numerals with eyebrow labels, hairline separators.
Done when: no hydration warning in console, ticks live, matches aesthetic.

**[ ] C5 — Details + FAQ section** · *decision needed from owner: one section or two?*
New: app/components/DetailsFaq.tsx (or Details.tsx + Faq.tsx). Details: venue, date/time,
dress code ("[black-tie optional]" placeholder) as a stationery card. FAQ: accordion —
prefer native `<details>`/`<summary>` styled with tokens (simple + accessible), framer
height-animation acceptable alternative. Hairline dividers between items, plus/minus
indicator. Both use useReveal.

### Phase D — RSVP refinements

**[ ] D1 — Plus-one constraints + decline fields verification**
Files: rsvp/page.tsx, rsvp/actions.ts. (1) Constrain to plus-one: guestCount input
`max={2}`, `MAX_GUESTS = 2` in action. (2) VERIFY (may already work): extras render as
"Guest 2" first (code uses `i + 2`) — confirm. (3) VERIFY (current code shows dietary +
message whenever `attending !== null`, which includes declines) — confirm decliners see
both fields; fix if not. (4) Full manual test: accept w/ +1, decline, empty name, 0/NaN
guest count — check Neon rows match schema §4.5. Done when: all cases insert correct rows.

### Phase E — UI makeover step 2 (token migration + polish)

**[ ] E1 — Migrate all components to theme tokens** · *do after B1 so new animation uses tokens*
Files: ExperienceGate.tsx, Envelope.tsx, CollageBoard.tsx, CollageCard.tsx, RsvpCard.tsx.
Mapping: overlay `bg-[#f3f0ea]` → `bg-surface`; all envelope paper hexes (`#dcd8cf`,
`#eceae4`, `#e7e4dd`, `#dedad1`, `#e9e6df`, `#e0dcd3`, `#f7f5f0`) → surface/surface-raised/
surface-deep family; `stone-*` text → `ink`/`ink-soft`; frame outline `#fdfcfa` inside
shadow arbitrary values → `var(--color-surface-raised)`; `bg-stone-200` placeholders →
`bg-line` or `bg-surface-deep`; RsvpCard rose classes → accent/wine family; board `h1`
`font-serif` → `font-display`; collage tape `#e9e2cf` → line-based. Done when: grep for
`#[0-9a-f]{3,6}` in components returns nothing (data file `padColor` values exempt).

**[ ] E2 — Final polish pass (iterate with owner until approval)**
Consistent vertical rhythm between sections, ornament reuse, mobile audit (envelope scales,
columns-2 legibility, RSVP form spacing), hover states touch-friendly, reduced-motion
respect (`useReducedMotion` for heavy animations). Repeat with owner feedback.

## 8. Deferred / ideas parking lot
- couple.ts source-of-truth file (owner declined for now)
- sessionStorage skip-envelope (deliberately removed)
- Real envelope artwork replacing CSS layers (only if CSS look can't reach fidelity)
- Guest name inputs iterating up to guestCount (currently plus-one only via D1)
````

Two notes on how I structured this:

- **Tasks are ordered by dependency, not by the original TODO order** — B1 (envelope animation) is isolated in its own phase because it's the riskiest piece and touches timing that E1 and the `revealed` timer depend on. Content tasks (A-phase) are deliberately front-loaded so you're never blocked waiting on Canva exports while code tasks proceed.
- **The gotchas section (§5) is the most valuable part for future chats** — these are all things a fresh AI will happily get wrong (hydration mismatch on the countdown, `whileInView` behind the overlay, clip-path shadows). The conventions section (§2) does the same job for style consistency.

One suggestion: as you complete tasks, check them off in the file itself and commit it — it doubles as your changelog, and any AI that sees an unchecked task knows it's fair game to touch.