import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Travel Planner
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/packages">Packages</Button>
          <Button color="inherit" component={Link} to="/create-your-own">Create Your Own</Button>
          <Button color="inherit" component={Link} to="/about-us">About Us</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/register">Register</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;