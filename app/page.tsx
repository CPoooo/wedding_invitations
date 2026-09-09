import { CollageBoard } from "./components/CollageBoard";
import { EnvelopeOverlay } from "./components/EnvelopeOverlay";

export default function Home() {
  return (
    <main>
      <EnvelopeOverlay />
      <CollageBoard />
    </main>
  );
}