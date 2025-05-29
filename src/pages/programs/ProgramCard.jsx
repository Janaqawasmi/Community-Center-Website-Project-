import { useState } from "react";
import ProgramCardFront from "./ProgCardFront";
import ProgramCardBack from "./progCardBack";
import { FlipCard, FlipCardInner, FlipCardFront, FlipCardBack } from "./FlipCard";

export default function ProgramCard({ prog, onRegister, highlight }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <FlipCard onClick={() => setFlipped(!flipped)}>
      <FlipCardInner style={{ transform: flipped ? "rotateY(180deg)" : "none" }}>
        <FlipCardFront>
          <ProgramCardFront
            prog={prog}
            highlight={highlight}
            onFlip={() => setFlipped(true)}
          />
        </FlipCardFront>
        <FlipCardBack>
          <ProgramCardBack
            prog={prog}
            highlight={highlight}
            onRegister={onRegister}
            onFlipBack={() => setFlipped(false)}
          />
        </FlipCardBack>
      </FlipCardInner>
    </FlipCard>
  );
}
