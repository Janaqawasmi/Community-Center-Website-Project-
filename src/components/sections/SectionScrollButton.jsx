// src/components/sections/SectionScrollButton.jsx

import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SectionScrollButton = ({ label, sectionId, sectionColor, targetId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (label.trim() === "تصفّح جميع الدورات") {
      navigate(`/programs?section=${sectionId}`);
    } else {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };


  return (
    <Button
  onClick={handleClick}
  disableRipple
  sx={{
    position: 'relative',
    padding: '10px 26px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    fontFamily: 'Cairo, sans-serif',
    cursor: 'pointer',
    color: sectionColor,
    backgroundColor: 'transparent',
    borderRadius: '30px',
    overflow: 'hidden',
    transition: 'all 0.4s ease-in-out',
    boxShadow: `15px 15px 15px ${sectionColor}`,
    textTransform: 'none',
    minWidth: 'auto',

    // ✅ REMOVE outline only when clicked (keep for keyboard tabbing)
    '&:focus:not(:focus-visible)': {
      outline: 'none',
    },

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: '30px',
      height: '30px',
      border: `0px solid transparent`,
      borderTopColor: sectionColor,
      borderRightColor: sectionColor,
      borderTopRightRadius: '22px',
      transition: 'all 0.3s ease-in-out',
      boxSizing: 'border-box',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '30px',
      height: '30px',
      border: `0px solid transparent`,
      borderBottomColor: sectionColor,
      borderLeftColor: sectionColor,
      borderBottomLeftRadius: '22px',
      transition: 'all 0.3s ease-in-out',
      boxSizing: 'border-box',
    },
    '&:hover::before': {
      width: '100%',
      height: '100%',
      border: `2px solid ${sectionColor}`,
      borderRadius: '30px',
      borderLeft: 'none',
      borderBottom: 'none',
    },
    '&:hover::after': {
      width: '100%',
      height: '100%',
      border: `2px solid ${sectionColor}`,
      borderRadius: '30px',
      borderRight: 'none',
      borderTop: 'none',
      textShadow: '0 0 5px rgba(0,0,0,0.1)',
    },
    '&:hover': {
      boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
    },
  }}
>
  {label}
</Button>

  );
};

export default SectionScrollButton;
