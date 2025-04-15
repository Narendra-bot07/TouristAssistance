import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Container, Grid, Card, CardContent, Button, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { FaPlane, FaStar, FaUsers, FaRocket } from 'react-icons/fa';
import './AboutUsPage.css';

const AboutUsPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Jane Doe',
      role: 'Travel Expert',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 2,
      name: 'John Smith',
      role: 'Itinerary Planner',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 3,
      name: 'Emma Wilson',
      role: 'Customer Support',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
  ];

  const values = [
    { icon: <FaStar />, title: 'Excellence', description: 'We strive for top-quality experiences in every trip.' },
    { icon: <FaUsers />, title: 'Personalization', description: 'Every journey is tailored to your unique preferences.' },
    { icon: <FaRocket />, title: 'Innovation', description: 'Powered by Grok 3 for cutting-edge travel planning.' },
  ];

  return (
    <Box className="about-us-page">
      {/* Hero Section */}
      <section className="hero-section text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <Typography variant="h1" component="h1" className="fw-bold mb-4">
            <FaPlane className="me-2" /> About Our Journey
          </Typography>
          <Typography variant="h5" className="mb-4">
            Crafting unforgettable travel experiences with passion and expertise.
          </Typography>
          <Link to="/create-your-own">
            <Button
              variant="contained"
              size="large"
              className="hero-cta"
              sx={{
                background: 'linear-gradient(90deg, #007bff, #00b7eb)',
                color: '#ffffff',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: '25px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #0056b3, #0096c7)',
                },
              }}
            >
              Plan Your Adventure
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* About Story */}
      <Container sx={{ my: 5 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" component="h2" className="fw-bold mb-3 text-center">
            Our Story
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '800px', mx: 'auto' }}>
            Founded with a love for exploration, we’re a travel agency dedicated to turning your dreams into reality. 
            With innovative technology, our team designs personalized itineraries that capture the essence of 
            every destination, ensuring every moment is unforgettable.
          </Typography>
        </motion.div>
      </Container>

      <Divider sx={{ my: 5, borderColor: '#e9ecef' }} />

      {/* Mission */}
      <Container sx={{ my: 5 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography variant="h3" component="h2" className="fw-bold mb-3 text-center">
            Our Mission
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '1000px', mx: 'auto', flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: 1, pr: { md: 3 }, mb: { xs: 3, md: 0 } }}>
              <Typography variant="body1" color="text.secondary" paragraph>
                To inspire and empower travelers to explore the world with confidence, creating seamless and memorable 
                journeys powered by cutting-edge AI and heartfelt expertise.
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Mission"
                className="mission-image rounded-4"
                style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
              />
            </Box>
          </Box>
        </motion.div>
      </Container>

      <Divider sx={{ my: 5, borderColor: '#e9ecef' }} />

      {/* Values */}
      <Container sx={{ my: 5 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography variant="h3" component="h2" className="fw-bold mb-3 text-center">
            Our Values
          </Typography>
          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className="value-card shadow-lg border-0 rounded-4 h-100">
                    <CardContent className="text-center">
                      <Box sx={{ fontSize: '2rem', color: '#007bff', mb: 2 }}>{value.icon}</Box>
                      <Typography variant="h6" component="h3" className="fw-bold">
                        {value.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      <Divider sx={{ my: 5, borderColor: '#e9ecef' }} />

      {/* Team */}
      <Container sx={{ my: 5 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Typography variant="h3" component="h2" className="fw-bold mb-3 text-center">
            Meet Our Team
          </Typography>
          <Grid container spacing={3}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={member.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className="team-card shadow-lg border-0 rounded-4 h-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="team-image rounded-top"
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                    <CardContent className="text-center">
                      <Typography variant="h6" component="h3" className="fw-bold">
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.role}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Contact CTA */}
      <Box sx={{ background: '#e9ecef', py: 5, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Typography variant="h4" component="h2" className="fw-bold mb-3">
            Ready to Explore?
          </Typography>
          <Typography variant="body1" color="text.secondary" className="mb-4">
            Contact us to start planning your next adventure.
          </Typography>
          <Link to="/create-your-own">
            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(90deg, #007bff, #00b7eb)',
                color: '#ffffff',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: '25px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #0056b3, #0096c7)',
                },
              }}
            >
              Get Started Now
            </Button>
          </Link>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AboutUsPage;