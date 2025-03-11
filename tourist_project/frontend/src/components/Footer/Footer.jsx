import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3 }}>
      <Container>
        <Typography variant="body1" align="center">
          &copy; 2023 Travel Planner. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;