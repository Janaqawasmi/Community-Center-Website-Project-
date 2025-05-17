import { styled } from '@mui/system';

export const FlipCard = styled('div')({
  width: 300,
  height: 400,
  perspective: 1000,
  margin: "0.5rem",
  cursor: "pointer",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
  },
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
