import React from 'react';
import { Box, Typography, TextField, Button, Container } from '@mui/material';

const RegistrationPage = () => {
  return (
    <Container sx={{display: "flex", flexDirection: "column"}}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" gutterBottom>
          Register
        </Typography>
        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <Button variant="contained" size="large">
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegistrationPage;