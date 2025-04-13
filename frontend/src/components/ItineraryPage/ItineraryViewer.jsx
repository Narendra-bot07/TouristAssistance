import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Carousel, Button, Card } from 'react-bootstrap';

const ItineraryViewer = () => {
  const [tripData, setTripData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const userEmail = localStorage.getItem('userName');
        if (!userEmail) {
          console.error('User email not found in localStorage!');
          setError('User email not found.');
          setLoading(false);
          return;
        }
        const response = await axios.get(`http://localhost:8000/api/get-latest-itinerary/${userEmail}`);
        console.log('Fetched response data:', response.data);
        setTripData(response.data);
      } catch (err) {
        console.error('Error fetching itinerary:', err);
        setError('Error fetching itinerary. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, []);

  const toggleActivityStatus = (dayIndex, activityIndex) => {
    const updatedTripData = { ...tripData };
    const activity = updatedTripData.itinerary[dayIndex].activities[activityIndex];
    activity.status = activity.status === 'Done' ? 'Not Done' : 'Done';
    setTripData(updatedTripData);
  };

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return <div className="alert alert-danger">{error}</div>;

  const itinerary = tripData?.itinerary || [];

  return (
    <div className="container py-4">
      <h2>Trip Itinerary</h2>

      {itinerary.length === 0 ? (
        <div className="alert alert-warning">No itinerary data available.</div>
      ) : (
        <Carousel activeIndex={activeIndex} controls={false} indicators={false}>
          {itinerary.map((dayData, index) => (
            <Carousel.Item key={index}>
              <Card className="mb-3">
                
                {/* Updated Card Header */}
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Day {dayData.day} - {dayData.date}</h4>
                    <div>
                      <Button
                        variant="light"
                        className="me-2 p-1"
                        onClick={() => setActiveIndex(activeIndex - 1)}
                        disabled={activeIndex === 0}
                      >
                        <i className="bi bi-arrow-left-circle" style={{ fontSize: '1.3rem' }}></i>
                      </Button>
                      <Button
                        variant="light"
                        className="p-1"
                        onClick={() => setActiveIndex(activeIndex + 1)}
                        disabled={activeIndex === itinerary.length - 1}
                      >
                        <i className="bi bi-arrow-right-circle" style={{ fontSize: '1.3rem' }}></i>
                      </Button>
                    </div>
                  </div>
                </Card.Header>

                <Card.Body>
                  <h5>Location: {dayData.location}</h5>

                  <h6>Activities:</h6>
                  <ul>
                    {dayData.activities.map((activity, index) => (
                      <li key={index}>
                        <strong>{activity.type}:</strong> {activity.description} <br />
                        <small><i>Duration: {activity.duration}</i></small>
                        <p>{activity.notes}</p>

                        <Button
                          variant={activity.status === 'Done' ? 'success' : 'secondary'}
                          onClick={() => toggleActivityStatus(dayData.day - 1, index)}
                          className="mb-2"
                        >
                          Mark as {activity.status === 'Done' ? 'Not Done' : 'Done'}
                        </Button>
                      </li>
                    ))}
                  </ul>

                  <h6>Transport:</h6>
                  <ul>
                    {dayData.transport.map((transport, index) => (
                      <li key={index}>
                        <strong>{transport.mode}:</strong> {transport.details} <br />
                        <small><i>Estimated Cost: {transport.estimatedCost} {transport.currency}</i></small>
                      </li>
                    ))}
                  </ul>

                  <h6>Accommodation:</h6>
                  <p><strong>{dayData.accommodation.name}</strong> ({dayData.accommodation.type})</p>
                  <p>Estimated Cost: {dayData.accommodation.estimatedCost} {dayData.accommodation.currency}</p>
                  <p>{dayData.accommodation.notes}</p>

                  <h6>Meals:</h6>
                  <ul>
                    {dayData.meals.map((meal, index) => (
                      <li key={index}>
                        <strong>{meal.type}:</strong> {meal.description} <br />
                        <small><i>Cost: {meal.cost} {meal.currency}</i></small>
                        <p>{meal.notes}</p>
                      </li>
                    ))}
                  </ul>

                  <h6>Cost Estimate:</h6>
                  <p><strong>{dayData.costEstimate} {dayData.accommodation.currency}</strong></p>

                  <h6>Notes:</h6>
                  <p>{dayData.notes}</p>
                </Card.Body>
              </Card>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default ItineraryViewer;
