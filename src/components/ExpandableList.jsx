import { useState } from 'react';
import { Typography } from '@mui/material';

const ExpandableList = ({ items, limit = 3, sx = {} }) => {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? items : items.slice(0, limit);

  return (
    <>
      <ul style={{ ...sx, paddingRight: 20, lineHeight: 2 }}>
        {visibleItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      {items.length > limit && (
        <Typography
          onClick={() => setExpanded(!expanded)}
          sx={{ color: 'red', fontWeight: 'bold', cursor: 'pointer', pr: 2 }}
        >
          {expanded ? 'إخفاء' : 'المزيد'}
        </Typography>
      )}
    </>
  );
};

export default ExpandableList;
