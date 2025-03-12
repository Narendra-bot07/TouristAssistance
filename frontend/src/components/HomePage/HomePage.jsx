import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Plan Your Perfect Trip
        </Typography>
        <Typography variant="h5" gutterBottom>
          Discover amazing destinations and create your personalized itinerary.
        </Typography>
        <Button variant="contained" size="large" component={Link} to="/create-your-own" sx={{ mt: 3 }}>
          Create Your Own Package
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Featured Package 1
            </Typography>
            <Typography variant="body1">
              Explore the mountains with our exclusive package.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Featured Package 2
            </Typography>
            <Typography variant="body1">
              Relax on the beaches with our premium package.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Featured Package 3
            </Typography>
            <Typography variant="body1">
              Experience the city life with our urban package.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;