import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const RecentTrips = () => {
  const trips = [
    {
      destination: 'Paris, France',
      date: '2025-03-12',
      details: 'A wonderful trip exploring the Eiffel Tower and museums.',
    },
    {
      destination: 'Tokyo, Japan',
      date: '2025-03-25',
      details: 'An exciting trip to experience the culture and technology.',
    },
    {
      destination: 'New York City, USA',
      date: '2025-04-01',
      details: 'Visited Times Square and Central Park.',
    },
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center my-4">Travel Planner</h1>
      <h4>Recent Trips</h4>
      <div className="list-group">
        {trips.map((trip, index) => (
          <div key={index} className="list-group-item">
            <h5>{trip.destination}</h5>
            <p><strong>Date:</strong> {trip.date}</p>
            <p><strong>Details:</strong> {trip.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTrips;
