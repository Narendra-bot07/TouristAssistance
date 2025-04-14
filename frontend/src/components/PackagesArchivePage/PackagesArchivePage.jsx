import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import { motion } from 'framer-motion';
import { FaMapSigns, FaPlane, FaStar } from 'react-icons/fa';
import './PackagesArchivePage.css';

const PackagesArchivePage = () => {
  const [sortBy, setSortBy] = useState('default');

  const packages = [
    {
      id: 1,
      name: 'Bali Adventure',
      price: 1200,
      duration: '7 Days',
      description: 'Explore Bali’s lush jungles, pristine beaches, and vibrant culture.',
      highlights: ['Ubud Monkey Forest', 'Tanah Lot Temple', 'Nusa Penida'],
      itinerary: [
        'Day 1: Arrival in Denpasar, relax at hotel.',
        'Day 2: Visit Ubud, explore art markets.',
        'Day 3: Tour Tanah Lot and Taman Ayun temples.',
        'Day 4: Beach day at Kuta and Seminyak.',
        'Day 5: Day trip to Nusa Penida.',
        'Day 6: Trek rice terraces in Tegalalang.',
        'Day 7: Departure.',
      ],
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    },
    {
      id: 2,
      name: 'European Tour',
      price: 2500,
      duration: '14 Days',
      description: 'Discover historic cities, charming villages, and iconic landmarks across Europe.',
      highlights: ['Eiffel Tower', 'Colosseum', 'Amsterdam Canals'],
      itinerary: [
        'Days 1-3: Paris - Eiffel Tower, Louvre.',
        'Days 4-6: Amsterdam - Canals, Rijksmuseum.',
        'Days 7-9: Venice - St. Mark’s, gondola rides.',
        'Days 10-12: Rome - Colosseum, Vatican.',
        'Days 13-14: Barcelona - Sagrada Familia.',
      ],
      image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    },
    {
      id: 3,
      name: 'Japan Cultural Tour',
      price: 1800,
      duration: '10 Days',
      description: 'Immerse yourself in Japan’s rich traditions, temples, and modern marvels.',
      highlights: ['Kyoto Temples', 'Tokyo Skytree', 'Hiroshima Peace Park'],
      itinerary: [
        'Days 1-2: Tokyo - Shibuya, Skytree.',
        'Days 3-5: Kyoto - Fushimi Inari, Kinkaku-ji.',
        'Days 6-7: Osaka - Dotonbori, Castle.',
        'Days 8-9: Hiroshima - Peace Park, Miyajima.',
        'Day 10: Departure.',
      ],
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    },
  ];

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortedPackages = [...packages].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <Box className="packages-archive">
      {/* Hero Section */}
      <section className="hero-section-archive text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <Typography variant="h1" component="h1" className="fw-bold mb-4">
            <FaPlane className="me-2" /> Explore Epic Adventures
          </Typography>
          <Typography variant="h5" className="mb-4">
            Curated travel packages or craft your own with our magic.
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
              Build Your Dream Trip
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Package Cards */}
      <Box sx={{ my: 5, px: { xs: 2, md: 0 } }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography variant="h3" component="h2" className="text-center fw-bold mb-3">
            <FaMapSigns className="me-2" /> Available Packages
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
                sx={{ borderRadius: '10px' }}
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </motion.div>
        <Grid container spacing={3}>
          {sortedPackages.map((pkg, index) => (
            <Grid item xs={12} sm={6} md={4} key={pkg.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card
                  className="package-card shadow-lg border-0 rounded-4 h-100"
                  sx={{ overflow: 'hidden' }}
                >
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="package-image rounded-top"
                    style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                  />
                  <CardContent className="p-4">
                    <Typography variant="h5" component="h3" className="fw-bold">
                      {pkg.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-2">
                      {pkg.description}
                    </Typography>
                    <Typography variant="body1" className="mb-2">
                      <strong>Duration:</strong> {pkg.duration}
                    </Typography>
                    <Typography variant="h6" className="text-primary mb-3">
                      Price: ${pkg.price}
                    </Typography>
                    <ul className="package-highlights mb-3">
                      {pkg.highlights.map((highlight, i) => (
                        <li key={i}>
                          <FaStar className="me-2 text-primary" /> {highlight}
                        </li>
                      ))}
                    </ul>
                    <Link to={`/package/${pkg.id}`}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          color: '#007bff',
                          borderColor: '#007bff',
                          fontWeight: 500,
                          borderRadius: '10px',
                          '&:hover': {
                            backgroundColor: '#007bff',
                            color: '#ffffff',
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default PackagesArchivePage;