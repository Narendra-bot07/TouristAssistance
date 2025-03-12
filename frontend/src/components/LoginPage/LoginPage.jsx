import React from 'react';
import { Box, Typography, TextField, Button, Container } from '@mui/material';

const LoginPage = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" gutterBottom>
          Login
        </Typography>
        <Box component="form" sx={{ mt: 3 }}>
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
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;