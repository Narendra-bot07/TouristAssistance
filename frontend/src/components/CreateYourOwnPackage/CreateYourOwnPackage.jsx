import React from 'react';
import { Box, Typography, TextField, Button, Container } from '@mui/material';

const CreateYourOwnPackage = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" gutterBottom>
          Create Your Own Package
        </Typography>
        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Destination"
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Duration"
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Budget"
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <Button variant="contained" size="large">
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateYourOwnPackage;