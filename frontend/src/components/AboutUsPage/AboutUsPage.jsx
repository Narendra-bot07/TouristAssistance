import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const AboutUsPage = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" paragraph>
          We are a leading travel agency dedicated to providing personalized and
          unforgettable travel experiences. Our team of experts ensures that every
          trip is tailored to your preferences.
        </Typography>
        <Typography variant="body1" paragraph>
          Contact us to plan your next adventure!
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUsPage;