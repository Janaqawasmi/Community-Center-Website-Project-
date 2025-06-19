import { styled } from '@mui/system';

export const FlipCard = styled('div')({
  width: "100%",            // allow responsive sizing from Grid
  maxWidth: 320,            // fixed size for uniformity (adjust if needed)
  height: 450,              // fixed height for equal layout
  perspective: 1000,
  margin: "auto",           // center within Grid cell
  cursor: "pointer",
});


export const FlipCardInner = styled('div')({
  position: "relative",
  width: "100%",
  height: "100%",
  textAlign: "center",
  transition: "transform 0.6s",
  transformStyle: "preserve-3d",
});

export const FlipCardFront = styled('div')({
  position: "absolute",
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
});

export const FlipCardBack = styled('div')({
  position: "absolute",
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  transform: "rotateY(180deg)",
});
