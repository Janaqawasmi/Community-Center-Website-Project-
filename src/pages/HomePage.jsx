import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import Slider from "react-slick";
import { useFeaturedPrograms } from "./programs/hooks/useFeaturedPrograms"; // ✅ renamed hook
import CalendarSection from "./CalendarSection";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import QuickLinksSection from '../components/homePage/QuickLinksSection';




export default function HomePage() {
  const featuredPrograms = useFeaturedPrograms(); // ✅ fetch array, not single program
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // show one program at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    rtl: true, // ensure RTL sliding
  };

  return (
    <Box sx={{  direction: "rtl" }}>
      {featuredPrograms.length > 0 && (
        <Slider {...sliderSettings}>
          {featuredPrograms.map((program) => (
            <Box
              key={program.id}
              sx={{
                position: "relative",
                // height: { xs: 250, md: 350 },
                display: "flex",
                overflow: "hidden",
                height: { xs: 320, sm: 400, md: 460 },
                width: "100%",

              }}
            >
              {/* Background Image */}
              <Box
                component="img"
                src={program.imageUrl}
                alt={program.name}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "right",
                  paddingLeft: { xs: "35%", md: "35%" },
                  zIndex: 0,
                }}
              />

              {/* Overlay */}
             <Box
  sx={{
    width: { xs: "100%", md: "45%" },
   height:"100%",
    background: "linear-gradient(180deg, #00b0f0 0%, #003366 100%)",
    clipPath: "polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",  // <<< changed here
    pl: { xs: 2, md: 4 },  // padding-left

    zIndex: 1,
  }}
>

                <Typography
  variant="h3"
  fontWeight="bold"
  sx={{
    color: "#fff",
    mb: 2,
    textAlign: "right",                 // align the title right
    width: "100%",                      // make sure it spans full width for alignment
    maxWidth: { xs: "100%", md: "80%" }, // optional: control width on larger screens
  }}
>
  {program.name}
</Typography>

<Typography
  variant="body1"
  sx={{
    color: "#fff",
    mb: 3,
    textAlign: "right",                  // align the description right
    width: "100%",                       // ensure full-width block
    maxWidth: { xs: "100%", md: "80%" }, // limit width on larger screens
    lineHeight: 1.8,                     // optional: improve readability
  }}
>
  {program.description}
</Typography>

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "rgb(197, 94, 24)",
                    borderRadius: "28px",
                    fontWeight: "bold",
                    px: 4,
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#fff", color: "black" },
                  }}
   onClick={() =>
  navigate(
    program.isNews
      ? `/news/${program.id}`
      : program.isEvent
        ? `/events?highlight=${program.id}`
        : `/programs/${encodeURIComponent(program.category?.[0] || '')}?highlight=${program.id}`
  )
}

            >
        عرض التفاصيل
                </Button>
              </Box>
            </Box>
          ))}
        </Slider>
      )}

{/* Quick Links */}
<Box sx={{ mt: { xs: 8, md: 8 } }}>
<QuickLinksSection sections={[]} />
</Box>   

<Box sx={{ mt: { xs: 4, md: 4 }, px: { xs: 2, md: 30 } }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4} sx={{ color: '#003366' }}>
             التقويم والفعاليات
           </Typography>
           <CalendarSection />
         </Box>
    </Box>
  );
}

function OverlayContent({ program, navigate, isEvent = false, isNews = false }) {
  return (
    <>
      <Typography variant="h3" fontWeight="bold" sx={{ color: "#fff", mb: 2 , textAlign: "right" }}>
        {program.name}
      </Typography>
      <Typography variant="body1" sx={{ color: "#fff", mb: 3,  textAlign: "right" }}>
        {program.description}
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "rgb(197, 94, 24)",
          borderRadius: "28px",
          fontWeight: "bold",
          px: 4,
          py: 1,
          textTransform: "none",
        }}
        onClick={() =>
         navigate(
  isNews
    ? `/news/${program.id}`
    : isEvent
      ? `/events?highlight=${program.id}`
      : `/programs/${encodeURIComponent(program.category?.[0] || '')}?highlight=${program.id}`
)

        }
      >
        عرض التفاصيل
      </Button>
    </>
  );
}
