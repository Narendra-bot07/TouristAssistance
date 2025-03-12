import React from 'react';
import { Box, Typography, Grid, Card, CardMedia } from '@mui/material';

const TourGallery = () => {
  const images = [
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tour Gallery
      </Typography>
      <Grid container spacing={3}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={image}
                alt={`Tour Image ${index + 1}`}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TourGallery;