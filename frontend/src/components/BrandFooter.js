import React from 'react';
import { Typography, Box } from '@mui/material';

const BrandFooter = () => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        backgroundColor: 'background.default',
        color: 'text.primary',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        py: 2,
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <Typography variant="body2">© 2024 Lã Kiều Ngọc Thăng. All rights reserved.</Typography>
    </Box>
  );
};

export default BrandFooter;
