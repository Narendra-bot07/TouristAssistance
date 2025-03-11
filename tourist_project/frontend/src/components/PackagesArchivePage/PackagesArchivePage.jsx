import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';

const PackagesArchivePage = () => {
  const packages = [
    { id: 1, name: 'Bali Adventure', price: '$1200' },
    { id: 2, name: 'European Tour', price: '$2500' },
    { id: 3, name: 'Japan Cultural Tour', price: '$1800' },
  ];

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h3" gutterBottom>
        Available Packages
      </Typography>
      <Grid container spacing={3}>
        {packages.map((pkg) => (
          <Grid item xs={12} sm={6} md={4} key={pkg.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {pkg.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Price: {pkg.price}
                </Typography>
                <Button variant="contained" fullWidth>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PackagesArchivePage;