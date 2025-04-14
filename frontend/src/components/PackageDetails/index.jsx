import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { FaMapSigns, FaStar, FaPlane } from 'react-icons/fa';
import './index.css';

const PackageDetails = () => {
  const { id } = useParams();

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
      banner: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
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
      banner: 'https://images.unsplash.com/photo-1491557345352-59231a67f439?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
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
      banner: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    },
  ];

  const pkg = packages.find((p) => p.id === parseInt(id));

  if (!pkg) {
    return (
      <Box sx={{ my: 5, textAlign: 'center' }}>
        <Typography variant="h3" color="#2c3e50">
          Package Not Found
        </Typography>
        <Link to="/packages">
          <Button
            variant="contained"
            sx={{
              mt: 2,
              background: 'linear-gradient(90deg, #007bff, #00b7eb)',
              color: '#ffffff',
            }}
          >
            Back to Packages
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box className="package-details">
      {/* Banner */}
      <section className="banner-section">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="banner-content"
        >
          <img
            src={pkg.banner}
            alt={`${pkg.name} banner`}
            className="banner-image"
            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
          />
          <Box className="banner-overlay text-center text-white">
            <Typography variant="h1" component="h1" className="fw-bold">
              <FaPlane className="me-2" /> {pkg.name}
            </Typography>
            <Typography variant="h5">
              {pkg.duration} | ${pkg.price}
            </Typography>
          </Box>
        </motion.div>
      </section>

      {/* Content */}
      <Box sx={{ my: 5, px: { xs: 2, md: 5 } }}>
        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" component="h2" className="fw-bold mb-3">
            Overview
          </Typography>
          <Typography variant="body1" color="text.secondary" className="mb-4">
            {pkg.description}
          </Typography>
        </motion.div>

        <Divider sx={{ my: 4, borderColor: '#e9ecef' }} />

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography variant="h3" component="h2" className="fw-bold mb-3">
            <FaStar className="me-2" /> Highlights
          </Typography>
          <ul className="highlights-list mb-4">
            {pkg.highlights.map((highlight, i) => (
              <li key={i}>
                <FaStar className="me-2 text-primary" /> {highlight}
              </li>
            ))}
          </ul>
        </motion.div>

        <Divider sx={{ my: 4, borderColor: '#e9ecef' }} />

        {/* Itinerary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography variant="h3" component="h2" className="fw-bold mb-3">
            <FaMapSigns className="me-2" /> Itinerary
          </Typography>
          <Box className="itinerary-list">
            {pkg.itinerary.map((day, i) => (
              <Box key={i} className="itinerary-item mb-3">
                <Typography variant="h6" className="fw-bold">
                  {day.split(' - ')[0]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {day.split(' - ')[1] || day}
                </Typography>
              </Box>
            ))}
          </Box>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          sx={{ textAlign: 'center', mt: 5 }}
        >
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
              Book or Customize Now
            </Button>
          </Link>
        </motion.div>
      </Box>
    </Box>
  );
};

export default PackageDetails;