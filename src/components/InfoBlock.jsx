// components/InfoBlock.jsx
import { Box, Typography } from '@mui/material';

const InfoBlock = ({ title, text, borderColor }) => {
  return (
    <Box
      sx={{
        border: `4px solid ${borderColor}`,
        borderRadius: '50px',
        p: 3,
        my: 2,
        bgcolor: '#fff',
        boxShadow: '0px 4px 14px rgba(0,0,0,0.05)',
        direction: 'rtl',
        textAlign: 'right',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: borderColor }}>
        {title}
      </Typography>
      <Typography sx={{ mt: 1, color: '#444', lineHeight: 2 }}>{text}</Typography>
    </Box>
  );
};

export default InfoBlock;
