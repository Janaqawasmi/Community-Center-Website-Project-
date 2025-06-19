import { Box } from '@mui/material';

function darkenColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = (num >> 16) - amount * 255;
  let g = ((num >> 8) & 0x00FF) - amount * 255;
  let b = (num & 0x0000FF) - amount * 255;

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// 🎨 Default gradient
const defaultGradient = "linear-gradient(180deg, #00b0f0 0%, #003366 100%)";

export default function PrettyCard({ title, color, children, icon }) {
  const badgeBackground = color
    ? `linear-gradient(135deg, ${color}, ${darkenColor(color, 0.2)})`
    : defaultGradient;

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '28px',
        p: { xs: 3, sm: 4 },
        mt: 0,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        direction: 'rtl',
        backgroundColor: '#fff',
        minHeight: '200px',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: { xs: '40px', sm: '40px' },
          minWidth: 'fit-content',
          px: 3,
          background: badgeBackground,
          borderBottomLeftRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: { xs: '1rem', sm: '1.1rem' },
          zIndex: 2,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
        }}
      >
        {icon && <span style={{ marginLeft: 6 }}>{icon}</span>}
        {title}
      </Box>

      <Box sx={{ textAlign: 'right', fontSize: '1rem', color: '#444', mt: 5 }}>
        {children}
      </Box>
    </Box>
  );
}
