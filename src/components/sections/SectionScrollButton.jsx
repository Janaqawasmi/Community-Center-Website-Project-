// src/components/sections/SectionScrollButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RoundedButton from '../layout/Buttons/RoundedButton'; // ✅ Adjust path if needed

const SectionScrollButton = ({ label, sectionId, sectionColor = '#003366', targetId }) => {
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
    <RoundedButton
      label={label}
      onClick={handleClick}
      color={sectionColor}
    />
  );
};

export default SectionScrollButton;
