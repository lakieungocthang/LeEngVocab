import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

function BackToHomeButton() {
  return (
    <Button
      component={Link}
      to="/"
      variant="contained"
      color="primary"
      sx={{
        fontSize: '1.2em',
        padding: '0.75em 2em',
        margin: '30px 0',
        borderRadius: '5px',
        textDecoration: 'none',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        fontFamily: 'Roboto, sans-serif',
        '&:hover': {
          backgroundColor: 'primary.dark',
          transform: 'translateY(-2px)',
        },
      }}
    >
      Back to Home
    </Button>
  );
}

export default BackToHomeButton;
