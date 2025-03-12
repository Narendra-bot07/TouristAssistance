import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const TourInformation = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tour Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Duration
              </Typography>
              <Typography variant="body1">7 Days / 6 Nights</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Destination
              </Typography>
              <Typography variant="body1">Bali, Indonesia</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Included
              </Typography>
              <Typography variant="body1">Accommodation, Meals, Transport</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Price
              </Typography>
              <Typography variant="body1">$1200 per person</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TourInformation;