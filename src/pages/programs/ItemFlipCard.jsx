import { useState } from "react";
import ItemCardFront from "./ItemCardFront";
import ItemCardBack from "./ItemCardBack";
import { FlipCard, FlipCardInner, FlipCardFront, FlipCardBack } from "./FlipCard";

export default function ItemFlipCard({ item, fields, onRegister, config ,  prog,  highlight}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <FlipCard onClick={() => setFlipped(!flipped)}>
      <FlipCardInner style={{ transform: flipped ? "rotateY(180deg)" : "none" }}>
        <FlipCardFront>
          <ItemCardFront item={item} onFlip={() => setFlipped(true)} config={config} prog={prog}
            highlight={highlight} />
        </FlipCardFront>
        <FlipCardBack>
          <ItemCardBack item={item} fields={fields} onRegister={onRegister} prog={prog}
            highlight={highlight} onFlipBack={() => setFlipped(false)} />
        </FlipCardBack>
      </FlipCardInner>
    </FlipCard>
  );
}
  
