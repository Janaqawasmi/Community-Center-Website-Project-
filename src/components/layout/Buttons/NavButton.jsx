import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';

export default function NavButton({ to, state, children, ...props }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    const isSamePage = location.pathname === to;
    const scrollTarget = state?.scrollTo;
  
    if (isSamePage) {
      if (scrollTarget) {
        // Trigger navigation with state to activate scroll in HomePage
        navigate(to, { state: { scrollTo: scrollTarget } });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate(to, { state });
    }
  };
  

  return (
    <Button
      {...props}
      onClick={handleClick}
      sx={{
        outline: 'none',
        boxShadow: 'none',
        ...props.sx,
        '&:focus': {
          outline: 'none',
          boxShadow: 'none',
        },
      }}
    >
      {children}
    </Button>
  );
}