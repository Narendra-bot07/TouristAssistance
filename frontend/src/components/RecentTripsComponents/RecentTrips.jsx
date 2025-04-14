import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RecentTrips = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const username = localStorage.getItem('userName')

  useEffect(() => {
    const fetchRecentPackages = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/recent-packages/${username}/`);
        if (response.data.status === 'success') {
          setPackages(response.data.recentPackages);
        } else {
          setError(response.data.message || 'Failed to fetch packages');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPackages();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center my-4">Recent Travel Packages</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="row">
          {packages.map((pkg, index) => {
            const trip = pkg.input || {};
            return (
              <div key={index} className="col-md-6 mb-4">
                <div className="card shadow-sm rounded p-3">
                  <h5 className="card-title">
                    From <span className="text-primary">{trip.startplace}</span> to{' '}
                    <span className="text-success">{trip.destinationplace}</span>
                  </h5>
                  <p className="card-text">
                    <strong>Start Date:</strong> {trip.startDate} <br />
                    <strong>End Date:</strong> {trip.endDate}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTrips;
