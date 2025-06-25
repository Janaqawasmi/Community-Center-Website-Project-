import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';

const CalendarIcon = () => {
  const navigate = useNavigate();

  return (
    <Tooltip title="التقويم" arrow>
      <div
        onClick={() => navigate("/calendar")}
        style={{
          backgroundColor: '#f97316',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 
            1.1.9 2 2 2h14c1.1 0 2-.9 
            2-2V6c0-1.1-.9-2-2-2zm0 
            16H5V9h14v11zm0-13H5V6h14v1z" />
        </svg>
      </div>
    </Tooltip>
  );
};

export default CalendarIcon;
