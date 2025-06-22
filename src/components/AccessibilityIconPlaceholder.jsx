import { Box } from '@mui/material';

export default function AccessibilityIconPlaceholder() {
  return (
    <Box
      id="accessibility-placeholder"
      sx={{
        width: '40px',
        height: '40px',
        display: 'inline-block',
        position: 'relative',
        zIndex: 5,
      }}
    />
  );
}
