import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Card, Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaUtensils, FaWallet, FaPlane, FaMapSigns, FaGlobe } from 'react-icons/fa';
import './CreateYourOwnPackage.css';
import config from "../../config.js";

const baseUrl = config.BASE_URL;


const CreateYourOwnPackage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    startCountry: '',
    destinationCountry: '',
    startDate: '',
    endDate: '',
    numPeople: '',
    preferences: [],
    goals: [],
    diet: '',
    budget: ''
  });

  const responseStates = { 
    initial: "INITIAL", 
    loading: "LOADING", 
    success: "SUCCESS", 
    failure: "FAILURE" 
  };
  
  const [responseState, setResponseState] = useState(responseStates.initial);
  const [error, setError] = useState('');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked, name } = e.target;
    setFormData(prev => {
      const updatedList = checked
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value);
      return { ...prev, [name]: updatedList };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    if (!userEmail || !userName) {
      setError('Please log in before creating a package.');
      return;
    }

    const formattedStartDate = formatDate(formData.startDate);
    const formattedEndDate = formatDate(formData.endDate);

    const payload = {
      username: userName,
      email: userEmail,
      packageDetails: {
        startplace: formData.startCountry,
        destinationplace: formData.destinationCountry,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        numPeople: formData.numPeople,
        preferences: formData.preferences,
        goals: formData.goals,
        diet: formData.diet,
        budget: formData.budget
      }
    };

    try {
      setResponseState(responseStates.loading);
      setError('');
      const response = await axios.post(`${baseUrl}save_trip_package/`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Package created successfully:', response.data);
      setResponseState(responseStates.success);
      navigate('/itinerary');
    } catch (error) {
      setResponseState(responseStates.failure);
      setError('Error creating your package. Please try again.');
      console.error('Error creating package:', error);
    }
  };

  const activities = [
    "Culture", "Outdoors", "Relaxing", "Wildlife",
    "Romantic", "Religious", "Hiking", "Musical",
    "Shopping", "Business", "Museums", "Party",
    "Traditions", "Walks", "Fishing", "Cruise",
    "Guide", "Healthcare", "Accommodation"
  ];

  const travelGoals = [
    "Adventure", "Relaxation", "Cultural exploration",
    "Spiritual growth", "Family time", "Nature immersion",
    "Socializing", "Learning", "Fitness", "Luxury",
    "Solo travel", "Group travel", "Workation"
  ];

  return (
    <Container className="my-5">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-4 shadow-lg border-0 rounded-4">
          <h2 className="text-center mb-4 fw-bold">
            <FaPlane className="me-2" /> Build Your Dream Trip
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="danger" className="rounded-3">
                {error}
              </Alert>
            </motion.div>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-2" /> Start Place
                  </Form.Label>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Form.Control
                      type="text"
                      name="startCountry"
                      value={formData.startCountry}
                      onChange={handleChange}
                      placeholder="e.g., India"
                      className="rounded-3"
                      required
                    />
                  </motion.div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-2" /> Destination Place
                  </Form.Label>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Form.Control
                      type="text"
                      name="destinationCountry"
                      value={formData.destinationCountry}
                      onChange={handleChange}
                      placeholder="e.g., Switzerland"
                      className="rounded-3"
                      required
                    />
                  </motion.div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FaCalendarAlt className="me-2" /> Start Date
                  </Form.Label>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="rounded-3"
                      required
                    />
                  </motion.div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FaCalendarAlt className="me-2" /> End Date
                  </Form.Label>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="rounded-3"
                      required
                    />
                  </motion.div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FaUsers className="me-2" /> Number of People
                  </Form.Label>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Form.Control
                      type="number"
                      name="numPeople"
                      value={formData.numPeople}
                      onChange={handleChange}
                      placeholder="Enter number of people"
                      className="rounded-3"
                      min="1"
                      required
                    />
                  </motion.div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FaWallet className="me-2" /> Budget (INR)
                  </Form.Label>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Form.Control
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="e.g., 50000"
                      className="rounded-3"
                      required
                    />
                  </motion.div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12} className="mb-4">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FaUtensils className="me-2" /> Dietary Restrictions
                  </Form.Label>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Form.Control
                      type="text"
                      name="diet"
                      value={formData.diet}
                      onChange={handleChange}
                      placeholder="e.g., Vegan, Gluten-free"
                      className="rounded-3"
                    />
                  </motion.div>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="d-flex align-items-center">
                <FaMapSigns className="me-2" /> Activity Preferences
              </Form.Label>
              <Row>
                {activities.map((activity, i) => (
                  <Col xs={6} md={4} key={i} className="mb-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      className="form-check p-2 rounded bg-light"
                    >
                      <Form.Check
                        type="checkbox"
                        value={activity}
                        checked={formData.preferences.includes(activity)}
                        onChange={handleCheckboxChange}
                        name="preferences"
                        id={`pref-${i}`}
                        label={activity}
                      />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="d-flex align-items-center">
                <FaGlobe className="me-2" /> Travel Goals
              </Form.Label>
              <Row>
                {travelGoals.map((goal, i) => (
                  <Col xs={6} md={4} key={i} className="mb-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      className="form-check p-2 rounded bg-light"
                    >
                      <Form.Check
                        type="checkbox"
                        value={goal}
                        checked={formData.goals.includes(goal)}
                        onChange={handleCheckboxChange}
                        name="goals"
                        id={`goal-${i}`}
                        label={goal}
                      />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </Form.Group>

            <motion.div
              className="build-package-btn-container"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                type="submit"
                className={responseState === responseStates.loading ? "travel-loading-btn" : "build-package-btn"}
                disabled={responseState === responseStates.loading}
              >
                {responseState === responseStates.loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  "Build Your Package"
                )}
              </Button>
            </motion.div>
          </Form>
        </Card>
      </motion.div>
    </Container>
  );
};

export default CreateYourOwnPackage;