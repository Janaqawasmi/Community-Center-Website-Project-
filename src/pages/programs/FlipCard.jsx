import { styled } from '@mui/system';

export const FlipCard = styled('div')({
  width: 300,
  height: 400,
  perspective: 1000,
  margin: "0.5rem",
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
