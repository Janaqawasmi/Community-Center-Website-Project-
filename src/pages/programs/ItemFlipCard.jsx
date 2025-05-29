import { useState } from "react";
import ItemCardFront from "./ItemCardFront";
import ItemCardBack from "./ItemCardBack";
import { FlipCard, FlipCardInner, FlipCardFront, FlipCardBack } from "./FlipCard";

export default function ItemFlipCard({ item, fields, onRegister, config }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <FlipCard onClick={() => setFlipped(!flipped)}>
      <FlipCardInner style={{ transform: flipped ? "rotateY(180deg)" : "none" }}>
        <FlipCardFront>
          <ItemCardFront item={item} onFlip={() => setFlipped(true)} config={config} />
        </FlipCardFront>
        <FlipCardBack>
          <ItemCardBack item={item} fields={fields} onRegister={onRegister} onFlipBack={() => setFlipped(false)} />
        </FlipCardBack>
      </FlipCardInner>
    </FlipCard>
  );
}
