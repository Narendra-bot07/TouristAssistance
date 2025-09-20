import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const baseUrl = import.meta.env.BASE_URL;

const RecentTrips = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const username = localStorage.getItem('userName');

  useEffect(() => {
    const fetchRecentPackages = async () => {
      try {
        const response = await axios.get(`${baseUrl}recent-packages/${username}/`);
        if (response.data.status === 'success') {
          setPackages(response.data.recentPackages || []);
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
  }, [username]);

  const handleCardClick = (packageId) => {
    navigate(`/itinerary/${packageId}`);
  };

  const handleCreatePackage = () => {
    navigate('/create-your-own');
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center my-4">Recent Travel Packages</h1>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : packages.length === 0 ? (
        <div className="text-center">
          <div className="card shadow-sm rounded p-5">
            <h3 className="text-muted mb-4">You haven't visited any tours or trips yet!</h3>
            <h5 className="mb-4">Start creating your own travel package now.</h5>
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleCreatePackage}
            >
              Create Your First Package
            </Button>
          </div>
        </div>
      ) : (
        <div className="row">
          {packages.map((pkg, index) => {
            const trip = pkg.input || {};
            const packageId = pkg.package_id;
            return (
              <div
                key={index}
                className="col-md-6 mb-4"
                onClick={() => handleCardClick(packageId)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card shadow-sm rounded p-3 h-100">
                  <h5 className="card-title">
                    From <span className="text-primary">{trip.startplace}</span> to{' '}
                    <span className="text-success">{trip.destinationplace}</span>
                  </h5>
                  <p className="card-text">
                    <strong>Start Date:</strong> {trip.startDate} <br />
                    <strong>End Date:</strong> {trip.endDate}
                  </p>
                  <div className="mt-auto">
                    <Button variant="outline-primary" size="sm">
                      View Details
                    </Button>
                  </div>
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
