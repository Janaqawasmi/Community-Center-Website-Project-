import { useState } from 'react';
import { Typography } from '@mui/material';

const ExpandableList = ({ items, limit = 3, sx = {}, expandable = true }) => {
  const [expanded, setExpanded] = useState(false);

  // If not expandable, always show full list
  const visibleItems = expandable && !expanded ? items.slice(0, limit) : items;

  return (
    <>
      <ul style={{ ...sx, paddingRight: 20, lineHeight: 2 }}>
        {visibleItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      {/* Show 'المزيد' toggle only if expandable and too many items */}
      {expandable && items.length > limit && (
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
