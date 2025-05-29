import React, { useState } from 'react';
import { Typography } from '@mui/material';

const ExpandableText = ({ text, limit = 300 }) => {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= limit) {
    return <Typography sx={{ fontSize: '1.2em', lineHeight: 2 }}>{text}</Typography>;
  }

  return (
    <Typography sx={{ fontSize: '1.2em', lineHeight: 2 }}>
      {expanded ? text : `${text.slice(0, limit)}...`}
      <span
        onClick={() => setExpanded(!expanded)}
        style={{
          color: 'red',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginRight: '5px'
        }}
      >
        {expanded ? ' إخفاء' : ' المزيد'}
      </span>
    </Typography>
  );
};

export default ExpandableText;
