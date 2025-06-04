import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaMapSigns, FaPlane } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const fetchItineraries = async () => {
      const data = [
        {
          id: 1,
          title: 'Explore the Mountains',
          description: 'Discover breathtaking peaks and serene trails with our exclusive mountain adventure.',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        },
        {
          id: 2,
          title: 'Relax on the Beaches',
          description: 'Unwind on pristine shores with our premium beach getaway package.',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        },
        {
          id: 3,
          title: 'Experience City Life',
          description: 'Immerse yourself in vibrant urban culture with our city explorer package.',
          image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        },
      ];
      setItineraries(data);
    };

    fetchItineraries();
  }, []);

  return (
    <div className="homepage">
      <section className="hero-section-home text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <h1 className="display-3 fw-bold mb-4">
            <FaPlane className="me-2" /> Plan Your Perfect Trip
          </h1>
          <p className="lead mb-4">
            Discover amazing destinations and craft your personalized itinerary with ease.
          </p>
          <Link to="/create-your-own">
            <Button variant="primary" size="lg" className="hero-cta">
              Create Your Package Now
            </Button>
          </Link>
        </motion.div>
      </section>

      <Container className="my-5">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-5 fw-bold"
        >
          <FaMapSigns className="me-2" /> Explore Our Packages
        </motion.h2>
        <Row>
          {itineraries.map((itinerary, index) => (
            <Col md={4} key={itinerary.id} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="itinerary-card shadow-lg border-0 rounded-4 h-100">
                  <Card.Img
                    variant="top"
                    src={itinerary.image}
                    alt={itinerary.title}
                    className="rounded-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body className="p-4">
                    <Card.Title className="fw-bold">{itinerary.title}</Card.Title>
                    <Card.Text className="text-muted">{itinerary.description}</Card.Text>
                    <Link to="/create-your-own">
                      <Button variant="outline-primary" className="w-100">
                        Customize Now
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;