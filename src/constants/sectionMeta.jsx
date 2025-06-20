// src/constants/sectionMeta.js
import {
  FaFemale,
  FaUsers,
  FaChild,
  FaBaby,
  FaHandsHelping,
  FaHeartbeat,
  FaRunning,
  FaBook,
  FaChalkboardTeacher,
  FaStar,
  FaTools,
  FaHandHoldingHeart
} from 'react-icons/fa';

export const iconMap = {
  section_women: <FaFemale />,
  section_youth: <FaUsers />,
  section_kindergarten: <FaChild />,
  section_nursery: <FaBaby />,
  section_elderly: <FaHandsHelping />,
  section_special: <FaHeartbeat />,
  section_sports: <FaRunning />,
  section_culture: <FaBook />,
  section_curricular: <FaChalkboardTeacher />,
  section_community_work: <FaStar />,
  section_engineering: <FaTools />,
  section_attaa: <FaHandHoldingHeart />
};

export const sectionColors = {
  section_women: "#f26d2c",
  section_youth: "#cf2929",
  section_engineering: "#2baadc",
  section_kindergarten: "#2baadc",
  section_community_work: "#68a144",
  section_attaa: "#fbc21f",
  section_nursery: "#cf2929",
  section_culture: "#fbc21f",
  section_special: "#68a144",
  section_curricular: "#f26d2c",
  section_sports: "#cf2929",
  section_elderly: "#fbc21f"
};


export const programCategories = [
  {
    label: "رياضة",
    color: "#cf2929",
  },
  {
    label: "طوارئ",
    color: "#cf2929", 
  },
  
  {
    label: "الثقافة والفن",
    color: "#fbc21f",
  },
  {
    label: "الدورات المنهجية واللامنهجية",
    color: " #f26d2c", 
  },
  {
    label: "نساء",
    color: "#f26d2c",  
  },
];


