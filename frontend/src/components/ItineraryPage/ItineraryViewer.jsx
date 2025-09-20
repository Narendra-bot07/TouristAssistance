import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Row, Col, Alert, Spinner, Badge, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHotel, FaUtensils, FaMapSigns, FaCheckCircle, FaPlane, 
  FaGlobe, FaWallet, FaList, FaArrowRight, FaArrowLeft, 
  FaRegCalendarAlt, FaPlusCircle 
} from 'react-icons/fa';
import { GiPathDistance } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import './ItineraryViewer.css';
import config from "../../config.js";

const baseUrl = config.BASE_URL;

const UNSPLASH_ACCESS_KEY = '8Vu1oE8SBFC4zelEK_g8U37gGpPKhPP_yURVh00Gaqk'; 

const fetchUnsplashImage = async (query) => {
  try {
    const res = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: {
        query,
        orientation: 'landscape',
        per_page: 1
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });
    return res?.data?.results?.[0]?.urls?.regular || null;
  } catch (err) {
    console.error('Unsplash error:', err);
    return null;
  }
};

const ItineraryViewer = () => {
  const [tripData, setTripData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const userEmail = localStorage.getItem('userName');
        if (!userEmail) {
          setError('User email not found.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${baseUrl}get-latest-itinerary/${userEmail}`);
        const data = response.data;

        if (!data.itinerary || data.itinerary.length === 0) {
          setLoading(false);
          return;
        }

        const enhancedItinerary = await Promise.all(
          data.itinerary.map(async (day) => {
            const locationImg = await fetchUnsplashImage(day.location);
            const accommodationImg = await fetchUnsplashImage(day.accommodation?.name);

            const mealsWithImages = await Promise.all(
              (day.meals || []).map(async (meal) => ({
                ...meal,
                img: await fetchUnsplashImage(meal.type)
              }))
            );

            const activitiesWithImages = await Promise.all(
              (day.activities || []).map(async (act) => ({
                ...act,
                img: await fetchUnsplashImage(act.type),
                status: act.status || 'Not Done'
              }))
            );

            return {
              ...day,
              locationImg,
              accommodationImg,
              meals: mealsWithImages,
              activities: activitiesWithImages,
              status: day.status || 'Not Done'
            };
          })
        );

        setTripData({ ...data, itinerary: enhancedItinerary });
      } catch (err) {
        console.error(err);
        setError('Error fetching itinerary. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [baseUrl]);

  const toggleActivityStatus = (dayIndex, activityIndex) => {
    const updated = { ...tripData };
    const activity = updated.itinerary[dayIndex].activities[activityIndex];
    activity.status = activity.status === 'Done' ? 'Not Done' : 'Done';
    setTripData(updated);
  };

  const toggleDayStatus = () => {
    const updated = { ...tripData };
    updated.itinerary[currentDayIndex].status = 
      updated.itinerary[currentDayIndex].status === 'Done' ? 'Not Done' : 'Done';
    setTripData(updated);
  };

  const goToNextDay = () => {
    if (currentDayIndex < tripData.itinerary.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  const goToPrevDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  const calculateSummary = () => {
    if (!tripData?.itinerary) return { totalDays: 0, totalCost: 0, locations: [], totalActivities: 0, totalMeals: 0 };

    const totalDays = tripData.itinerary.length;
    const locations = [...new Set(tripData.itinerary.map(day => day.location).filter(Boolean))];
    const totalActivities = tripData.itinerary.reduce((sum, day) => sum + (day.activities?.length || 0), 0);
    const totalMeals = tripData.itinerary.reduce((sum, day) => sum + (day.meals?.length || 0), 0);
    const totalCost = tripData.itinerary.reduce((sum, day) => {
      const cost = parseFloat(day.costEstimate) || 0;
      return sum + cost;
    }, 0);

    return {
      totalDays,
      totalCost: totalCost.toFixed(2),
      locations,
      totalActivities,
      totalMeals
    };
  };

  if (loading) {
    return (
      <motion.div
        className="text-center mt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Spinner animation="border" role="status" style={{ color: '#007bff' }} />
        <p className="mt-2" style={{ color: '#2c3e50' }}>Crafting your adventure...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Alert variant="danger" className="rounded-3 shadow-sm">
          {error}
        </Alert>
      </motion.div>
    );
  }

  if (!tripData?.itinerary || tripData.itinerary.length === 0) {
    return (
      <Container className="my-5">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Card className="shadow-lg border-0 rounded-4 p-5 no-itinerary-card">
            <div className="no-itinerary-icon mb-4">
              <FaGlobe size={80} className="text-primary opacity-25" />
            </div>
            <h2 className="mb-3 fw-bold">No Recent Itinerary Found</h2>
            <p className="text-muted mb-4 fs-5">
              It looks like you haven't created any travel plans yet. Let's start your adventure!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/create-your-own')}
                className="px-4 py-3 rounded-pill fw-bold"
              >
                <FaPlusCircle className="me-2" />
                Create New Travel Package
              </Button>
            </motion.div>
            <p className="mt-3 text-muted">
              or <a href="/browse_packages" onClick={() => navigate('/browse_packages')} className="text-decoration-none">browse our pre-made packages</a>
            </p>
          </Card>
        </motion.div>
      </Container>
    );
  }

  const summary = calculateSummary();
  const dayData = tripData.itinerary[currentDayIndex];

  return (
    <Container className="my-5 itinerary-container">
      <motion.h2
        className="text-center fw-bold mb-5"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ color: '#2c3e50', fontSize: '2.8rem' }}
      >
        ✈ Your Travel Adventure
      </motion.h2>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <motion.button
          className="btn btn-outline-primary rounded-circle p-3"
          onClick={goToPrevDay}
          disabled={currentDayIndex === 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowLeft size={20} />
        </motion.button>

        <div className="text-center">
          <h3 className="mb-0">Day {currentDayIndex + 1} of {tripData.itinerary.length}</h3>
          <small className="text-muted">{dayData?.date ?? ''}</small>
        </div>

        <motion.button
          className="btn btn-outline-primary rounded-circle p-3"
          onClick={goToNextDay}
          disabled={currentDayIndex === tripData.itinerary.length - 1}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowRight size={20} />
        </motion.button>
      </div>

      <div className="text-center mb-4">
        <motion.button
          className={`btn ${dayData.status === 'Done' ? 'btn-success' : 'btn-outline-secondary'} rounded-circle p-4`}
          onClick={toggleDayStatus}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ width: '100px', height: '100px' }}
        >
          <FaCheckCircle size={30} />
          <div className="mt-2">{dayData.status}</div>
        </motion.button>
      </div>

      <AnimatePresence>
        <motion.div
          key={currentDayIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-4 shadow-lg border-0 rounded-4 itinerary-card">
            <Card.Header className="bg-transparent p-0 rounded-top">
              {dayData.locationImg && (
                <div className="image-container">
                  <img
                    src={dayData.locationImg}
                    alt={dayData.location}
                    className="img-fluid rounded-top"
                    style={{ height: '400px', objectFit: 'cover', width: '100%' }}
                  />
                  <div className="image-overlay">
                    <h3 className="text-white mb-0">Day {currentDayIndex + 1}</h3>
                    <p className="text-white">{dayData?.location ?? ''}</p>
                  </div>
                </div>
              )}
              <div className="p-3 bg-light d-flex justify-content-between align-items-center">
                <Badge bg="primary" className="rounded-pill">
                  <FaRegCalendarAlt className="me-1" /> {dayData?.date ?? ''}
                </Badge>
                <Badge bg="info" className="rounded-pill">
                  <GiPathDistance className="me-1" /> Day {dayData?.day ?? currentDayIndex + 1}
                </Badge>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              <Row className="mb-4">
                <Col md={6}>
                  <h5 className="section-title">
                    <FaHotel className="me-2" /> Accommodation
                  </h5>
                  {dayData.accommodationImg && (
                    <motion.img
                      src={dayData.accommodationImg}
                      alt="Accommodation"
                      className="img-fluid rounded-3 mb-3"
                      style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <Card className="border-0 bg-light shadow-sm p-3 rounded-3">
                    <p className="mb-1 fw-bold">{dayData.accommodation?.name ?? ''}</p>
                    <p className="mb-1 text-muted">
                      {dayData.accommodation?.type ?? ''} | 💰 {dayData.accommodation?.estimatedCost ?? ''}{' '}
                      {dayData.accommodation?.currency ?? ''}
                    </p>
                    <small className="text-muted">{dayData.accommodation?.notes ?? ''}</small>
                  </Card>
                </Col>

                <Col md={6}>
                  <h5 className="section-title">
                    <FaPlane className="me-2" /> Transport
                  </h5>
                  {Array.isArray(dayData.transport) && dayData.transport.length > 0 ? (
                    dayData.transport.map((t, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="border-0 bg-light shadow-sm p-3 mb-2 rounded-3">
                          <p className="mb-1 fw-bold">{t.mode ?? ''}</p>
                          <p className="mb-1 text-muted">{t.details ?? ''}</p>
                          <small className="text-muted">
                            💸 {t.estimatedCost ?? ''} {t.currency ?? ''}
                          </small>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-muted">No transport details available.</p>
                  )}
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <h5 className="section-title">
                    <FaUtensils className="me-2" /> Meals
                  </h5>
                  {Array.isArray(dayData.meals) && dayData.meals.length > 0 ? (
                    dayData.meals.map((meal, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="border-0 bg-light shadow-sm p-3 mb-3 rounded-3">
                          {meal.img && (
                            <img
                              src={meal.img}
                              alt={meal.type}
                              className="img-fluid rounded-3 mb-2"
                              style={{ height: '150px', objectFit: 'cover', width: '100%' }}
                            />
                          )}
                          <p className="mb-1 fw-bold">{meal.type ?? ''}</p>
                          <p className="mb-1 text-muted">{meal.description ?? ''}</p>
                          <small className="text-muted">
                            💵 {meal.cost ?? ''} {meal.currency ?? ''} | {meal.notes ?? ''}
                          </small>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-muted">No meals planned for this day.</p>
                  )}
                </Col>

                <Col md={6}>
                  <h5 className="section-title">
                    <FaMapSigns className="me-2" /> Activities
                  </h5>
                  {Array.isArray(dayData.activities) && dayData.activities.length > 0 ? (
                    dayData.activities.map((act, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="border-0 bg-light shadow-sm p-3 mb-3 rounded-3">
                          {act.img && (
                            <img
                              src={act.img}
                              alt={act.type}
                              className="img-fluid rounded-3 mb-2"
                              style={{ height: '150px', objectFit: 'cover', width: '100%' }}
                            />
                          )}
                          <p className="mb-1 fw-bold">{act.type ?? ''}</p>
                          <p className="mb-1 text-muted">{act.description ?? ''}</p>
                          <small className="text-muted">
                            ⏱ {act.duration ?? ''} | 📝 {act.notes ?? ''}
                          </small>
                          <motion.button
                            className={`btn mt-2 ${
                              act.status === 'Done' ? 'btn-success' : 'btn-outline-primary'
                            }`}
                            onClick={() => toggleActivityStatus(currentDayIndex, i)}
                            whileTap={{ scale: 0.95 }}
                          >
                            {act.status === 'Done' ? (
                              <>
                                <FaCheckCircle className="me-1" /> Completed
                              </>
                            ) : (
                              'Mark as Done'
                            )}
                          </motion.button>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-muted">No activities planned.</p>
                  )}
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <h5 className="section-title">💰 Total Estimate</h5>
                  <p className="fs-4 fw-bold text-primary">
                    {dayData?.costEstimate ?? ''} {dayData.accommodation?.currency ?? ''}
                  </p>
                </Col>
                <Col md={6}>
                  <h5 className="section-title">📝 Notes</h5>
                  <p className="text-muted">{dayData?.notes ?? 'No additional notes.'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Itinerary Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mt-5 shadow-lg border-0 rounded-4 itinerary-card">
          <Card.Header className="bg-primary text-white p-3 rounded-top">
            <h3 className="mb-0 d-flex align-items-center">
              <FaList className="me-2" /> Itinerary Summary
            </h3>
          </Card.Header>
          <Card.Body className="p-4">
            <Row>
              <Col md={4} className="mb-3">
                <div className="summary-item">
                  <FaGlobe className="me-2 text-primary" size={24} />
                  <div>
                    <h5 className="mb-1">Locations Visited</h5>
                    <p className="text-muted">
                      {summary.locations.length > 0 ? summary.locations.join(', ') : 'None'}
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="mb-3">
                <div className="summary-item">
                  <FaWallet className="me-2 text-primary" size={24} />
                  <div>
                    <h5 className="mb-1">Total Estimated Cost</h5>
                    <p className="text-muted">
                      {summary.totalCost} {tripData.itinerary[0]?.accommodation?.currency ?? ''}
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="mb-3">
                <div className="summary-item">
                  <FaMapSigns className="me-2 text-primary" size={24} />
                  <div>
                    <h5 className="mb-1">Total Days</h5>
                    <p className="text-muted">{summary.totalDays} {summary.totalDays === 1 ? 'Day' : 'Days'}</p>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <div className="summary-item">
                  <FaMapSigns className="me-2 text-primary" size={24} />
                  <div>
                    <h5 className="mb-1">Total Activities</h5>
                    <p className="text-muted">{summary.totalActivities} Planned</p>
                  </div>
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="summary-item">
                  <FaUtensils className="me-2 text-primary" size={24} />
                  <div>
                    <h5 className="mb-1">Total Meals</h5>
                    <p className="text-muted">{summary.totalMeals} Planned</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default ItineraryViewer;