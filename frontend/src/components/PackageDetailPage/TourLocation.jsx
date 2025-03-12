import React from 'react';
import { Box, Typography } from '@mui/material';

const TourLocation = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tour Location
      </Typography>
      <Box
        sx={{
          height: '300px',
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body1">Map Placeholder</Typography>
      </Box>
    </Box>
  );
};

export default TourLocation;