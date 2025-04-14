import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Card, Button, Container, Row, Col, Alert, Spinner, Badge } from 'react-bootstrap';

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

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const userEmail = localStorage.getItem('userName');
        if (!userEmail) {
          setError('User email not found.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/get-latest-itinerary/${userEmail}`);
        const data = response.data;

        // 🌅 Enhance itinerary with Unsplash images
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
                img: await fetchUnsplashImage(act.type)
              }))
            );

            return {
              ...day,
              locationImg,
              accommodationImg,
              meals: mealsWithImages,
              activities: activitiesWithImages
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
  }, []);

  const toggleActivityStatus = (dayIndex, activityIndex) => {
    const updated = { ...tripData };
    const activity = updated.itinerary[dayIndex].activities[activityIndex];
    activity.status = activity.status === 'Done' ? 'Not Done' : 'Done';
    setTripData(updated);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;

  const itinerary = Array.isArray(tripData?.itinerary) ? tripData.itinerary : [];

  return (
    <Container className="my-5">
      <h2 className="text-center fw-bold mb-4" style={{ fontSize: '2.5rem', color: '#2c3e50' }}>
        ✈ Your Dream Itinerary
      </h2>

      {itinerary.map((dayData, dayIndex) => (
        <Card key={dayIndex} className="mb-4 shadow-lg border-0 rounded-4">
          <Card.Header className="bg-white p-0 rounded-top">
            {dayData.locationImg && (
              <img
                src={dayData.locationImg}
                alt={dayData.location}
                className="img-fluid rounded-top"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            )}
            <div className="p-3 bg-light d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">🌅 Day {dayIndex + 1} - {dayData?.date ?? ''}</h5>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <Badge bg="light" text="dark">📍 {dayData?.location ?? ''}</Badge>
                <Badge bg="warning" text="dark">🔢 Day {dayData?.day ?? dayIndex + 1}</Badge>
              </div>
            </div>
          </Card.Header>

          <Card.Body className="p-4">
            <Row className="mb-4">
              <Col md={6}>
                <h6 className="text-primary mb-2">🏨 Accommodation</h6>
                {dayData.accommodationImg && (
                  <img
                    src={dayData.accommodationImg}
                    alt="Accommodation"
                    className="img-fluid rounded-3 mb-2"
                    style={{ height: '500px', objectFit: 'cover', width: '100%' }}
                  />
                )}
                <Card className="border-0 bg-light shadow-sm p-3 rounded-3">
                  <p className="mb-1"><strong>{dayData.accommodation?.name ?? ''}</strong> ({dayData.accommodation?.type ?? ''})</p>
                  <p className="mb-1">💰 {dayData.accommodation?.estimatedCost ?? ''} {dayData.accommodation?.currency ?? ''}</p>
                  <small className="text-muted">{dayData.accommodation?.notes ?? ''}</small>
                </Card>
              </Col>

              <Col md={6}>
                <h6 className="text-success mb-2">🚗 Transport</h6>
                {Array.isArray(dayData.transport) && dayData.transport.length > 0 ? dayData.transport.map((t, i) => (
                  <Card key={i} className="border-0 bg-light shadow-sm p-2 mb-2 rounded-3">
                    <p className="mb-1"><strong>{t.mode ?? ''}</strong>: {t.details ?? ''}</p>
                    <small className="text-muted">💸 {t.estimatedCost ?? ''} {t.currency ?? ''}</small>
                  </Card>
                )) : <p>No transport info.</p>}
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <h6 className="text-danger mb-2">🍽 Meals</h6>
                {Array.isArray(dayData.meals) && dayData.meals.length > 0 ? dayData.meals.map((meal, i) => (
                  <Card key={i} className="border-0 bg-light shadow-sm p-2 mb-2 rounded-3">
                    {meal.img && (
                      <img
                        src={meal.img}
                        alt={meal.type}
                        className="img-fluid rounded-3 mb-2"
                        style={{ height: '140px', objectFit: 'cover', width: '100%' }}
                      />
                    )}
                    <p className="mb-1"><strong>{meal.type ?? ''}</strong>: {meal.description ?? ''}</p>
                    <small className="text-muted">💵 {meal.cost ?? ''} {meal.currency ?? ''}</small>
                    <br />
                    <small className="text-muted">{meal.notes ?? ''}</small>
                  </Card>
                )) : <p>No meals planned.</p>}
              </Col>

              <Col md={6}>
                <h6 className="text-warning mb-2">🎯 Activities</h6>
                {Array.isArray(dayData.activities) && dayData.activities.length > 0 ? dayData.activities.map((act, i) => (
                  <Card key={i} className="border-0 bg-light shadow-sm p-2 mb-3 rounded-3">
                    {act.img && (
                      <img
                        src={act.img}
                        alt={act.type}
                        className="img-fluid rounded-3 mb-2"
                        style={{ height: '140px', objectFit: 'cover', width: '100%' }}
                      />
                    )}
                    <p className="mb-1"><strong>{act.type ?? ''}</strong>: {act.description ?? ''}</p>
                    <small className="text-muted">⏱ {act.duration ?? ''} | 📝 {act.notes ?? ''}</small>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant={act.status === 'Done' ? 'success' : 'outline-secondary'}
                        onClick={() => toggleActivityStatus(dayIndex, i)}
                      >
                        {act.status === 'Done' ? '✅ Done' : 'Mark as Done'}
                      </Button>
                    </div>
                  </Card>
                )) : <p>No activities yet.</p>}
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <h6 className="text-info">💰 Estimated Total</h6>
                <p className="fs-5 fw-bold">{dayData?.costEstimate ?? ''} {dayData.accommodation?.currency ?? ''}</p>
              </Col>
              <Col md={6}>
                <h6 className="text-secondary">📝 Extra Notes</h6>
                <p>{dayData?.notes ?? ''}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default ItineraryViewer;
