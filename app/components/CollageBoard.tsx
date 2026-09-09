import { CollageCard } from "./CollageCard";
import { collageItems } from "./collageItems";
import { RsvpCard } from "./RsvpCard";

export function CollageBoard() {
  return (
    <section className="min-h-screen px-6 py-16">
      <h1 className="mb-10 text-center font-serif text-4xl">Rachel & Cameron</h1>
      <div className="mx-auto max-w-5xl columns-2 gap-4 md:columns-3">
        {collageItems.map((item) =>
          item.kind === "rsvp"
            ? <RsvpCard key={item.id} rotation={item.rotation} />
            : <CollageCard key={item.id} rotation={item.rotation} caption={item.caption} />
        )}
      </div>
    </section>
  );
}