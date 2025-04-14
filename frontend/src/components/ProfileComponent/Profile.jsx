import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [tripStats, setTripStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    active: 0
  });
  const [activeTab, setActiveTab] = useState("about");
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);

  const defaultPic = "https://cdna.artstation.com/p/assets/images/images/050/664/730/large/default-egg-bag2.jpg?1655383353";

  useEffect(() => {
    const username = localStorage.getItem("userName");
    
    const fetchData = async () => {
      try {
        // Fetch profile data
        const profileResponse = await axios.get(`http://localhost:8000/api/profile/${username}/`);
        setProfile(profileResponse.data.profile);

        // Fetch trip stats
        setStatsLoading(true);
        const statsResponse = await axios.get(`http://localhost:8000/api/trip-stats/${username}`);
        if (statsResponse.data.status === 'success') {
          setTripStats(statsResponse.data.stats);
        }
      } catch (err) {
        setError("Could not load profile data. Showing default information.");
      } finally {
        setLoading(false);
        setStatsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSafe = (val, fallback) => val || fallback;

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container my-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Gradient Background Section */}
      <div className="position-absolute top-0 start-0 w-100" style={{
        height: '300px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        zIndex: -1,
        borderRadius: '0 0 20px 20px'
      }}></div>

      {/* Main Profile Card */}
      <div className="card shadow-lg rounded-4 overflow-hidden border-0">
        {/* Profile Header */}
        <div className="profile-header" style={{
          background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2))',
          padding: '2rem',
          position: 'relative'
        }}>
          <div className="row align-items-center">
            <div className="col-md-4 text-center mb-4 mb-md-0">
              <div className="position-relative d-inline-block">
                <img
                  src={defaultPic}
                  alt="Profile"
                  className="rounded-circle shadow"
                  style={{ 
                    width: '160px', 
                    height: '160px', 
                    objectFit: 'cover', 
                    border: '5px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                  }}
                />
                <button className="btn btn-sm btn-light rounded-pill position-absolute bottom-0 end-0 shadow-sm" 
                  style={{ transform: 'translate(-10px, -10px)' }}>
                  <i className="bi bi-camera-fill"></i>
                </button>
              </div>
            </div>

            <div className="col-md-8">
              <h2 className="fw-bold text-white mb-1">{getSafe(profile?.name, "Your Name")}</h2>
              <p className="text-light fs-5 mb-2">
                <i className="bi bi-geo-alt-fill me-2"></i>
                {getSafe(profile?.profession, "Travel Enthusiast")}
              </p>
              
              <div className="d-flex align-items-center mb-3">
                <div className="me-4">
                  <span className="badge bg-white text-primary fw-normal fs-6 px-3 py-2 rounded-pill">
                    <i className="bi bi-star-fill me-1"></i> 8.5/10 Rating
                  </span>
                </div>
                <div>
                  <span className="badge bg-white text-dark fw-normal fs-6 px-3 py-2 rounded-pill">
                    <i className="bi bi-patch-check-fill text-success me-1"></i> Verified
                  </span>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <NavLink to="/edit-profile" className="btn btn-light rounded-pill px-4 shadow-sm">
                  <i className="bi bi-pencil-square me-2"></i> Edit Profile
                </NavLink>
                <NavLink to="/change-password" className="btn btn-outline-light rounded-pill px-4 shadow-sm">
                  <i className="bi bi-shield-lock me-2"></i> Change Password
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Body */}
        <div className="card-body p-0">
          {/* Tabs Navigation */}
          <ul className="nav nav-tabs border-0 px-4" style={{ marginTop: '-1rem' }}>
            <li className="nav-item">
              <button 
                className={`nav-link fw-semibold px-4 py-3 rounded-top ${activeTab === "about" ? "active text-primary bg-white border-primary" : "text-dark bg-light"}`}
                onClick={() => setActiveTab("about")}
                style={{ borderWidth: '3px' }}
              >
                <i className="bi bi-person-lines-fill me-2"></i> About
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link fw-semibold px-4 py-3 rounded-top ${activeTab === "trips" ? "active text-primary bg-white border-primary" : "text-dark bg-light"}`}
                onClick={() => setActiveTab("trips")}
                style={{ borderWidth: '3px' }}
              >
                <i className="bi bi-map-fill me-2"></i> Trips Dashboard
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content p-4 bg-white rounded-bottom">
            {activeTab === "about" && (
              <div className="row">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm rounded-3 mb-4">
                    <div className="card-body">
                      <h5 className="card-title text-primary mb-4">
                        <i className="bi bi-info-circle-fill me-2"></i> Basic Information
                      </h5>
                      <div className="list-group list-group-flush">
                        <div className="list-group-item border-0 px-0 py-2">
                          <div className="d-flex justify-content-between">
                            <span className="fw-medium text-muted">Username:</span>
                            <span className="fw-semibold">{getSafe(profile?.username, "username123")}</span>
                          </div>
                        </div>
                        <div className="list-group-item border-0 px-0 py-2">
                          <div className="d-flex justify-content-between">
                            <span className="fw-medium text-muted">Email:</span>
                            <span className="fw-semibold">{getSafe(profile?.email, "you@example.com")}</span>
                          </div>
                        </div>
                        <div className="list-group-item border-0 px-0 py-2">
                          <div className="d-flex justify-content-between">
                            <span className="fw-medium text-muted">Phone:</span>
                            <span className="fw-semibold">{getSafe(profile?.number, "000-000-0000")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm rounded-3 mb-4">
                    <div className="card-body">
                      <h5 className="card-title text-primary mb-4">
                        <i className="bi bi-calendar2-heart-fill me-2"></i> Personal Details
                      </h5>
                      <div className="list-group list-group-flush">
                        <div className="list-group-item border-0 px-0 py-2">
                          <div className="d-flex justify-content-between">
                            <span className="fw-medium text-muted">Age:</span>
                            <span className="fw-semibold">{getSafe(profile?.age, "--")}</span>
                          </div>
                        </div>
                        <div className="list-group-item border-0 px-0 py-2">
                          <div className="d-flex justify-content-between">
                            <span className="fw-medium text-muted">Date of Birth:</span>
                            <span className="fw-semibold">{getSafe(profile?.dob, "YYYY-MM-DD")}</span>
                          </div>
                        </div>
                        <div className="list-group-item border-0 px-0 py-2">
                          <div className="d-flex justify-content-between">
                            <span className="fw-medium text-muted">Profession:</span>
                            <span className="fw-semibold">{getSafe(profile?.profession, "Travel Blogger")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "trips" && (
              <div className="row g-4">
                {statsLoading ? (
                  <div className="col-12 text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading trip statistics...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="col-md-3">
                      <div className="card border-0 shadow rounded-4 h-100 hover-scale" style={{ transition: 'transform 0.3s' }}>
                        <div className="card-body text-center py-5">
                          <div className="icon-circle bg-primary-light mb-4 mx-auto">
                            <i className="bi bi-airplane-engines text-primary fs-3"></i>
                          </div>
                          <h6 className="text-muted fw-medium mb-3">Total Trips</h6>
                          <h2 className="text-primary fw-bold display-5">{tripStats.total}</h2>
                          <p className="text-muted small mt-2">All your adventures</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card border-0 shadow rounded-4 h-100 hover-scale" style={{ transition: 'transform 0.3s' }}>
                        <div className="card-body text-center py-5">
                          <div className="icon-circle bg-info-light mb-4 mx-auto">
                            <i className="bi bi-lightning-charge text-info fs-3"></i>
                          </div>
                          <h6 className="text-muted fw-medium mb-3">Active Trips</h6>
                          <h2 className="text-info fw-bold display-5">{tripStats.active}</h2>
                          <p className="text-muted small mt-2">Current journeys</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card border-0 shadow rounded-4 h-100 hover-scale" style={{ transition: 'transform 0.3s' }}>
                        <div className="card-body text-center py-5">
                          <div className="icon-circle bg-warning-light mb-4 mx-auto">
                            <i className="bi bi-calendar2-check text-warning fs-3"></i>
                          </div>
                          <h6 className="text-muted fw-medium mb-3">Upcoming Trips</h6>
                          <h2 className="text-warning fw-bold display-5">{tripStats.upcoming}</h2>
                          <p className="text-muted small mt-2">Future journeys</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card border-0 shadow rounded-4 h-100 hover-scale" style={{ transition: 'transform 0.3s' }}>
                        <div className="card-body text-center py-5">
                          <div className="icon-circle bg-success-light mb-4 mx-auto">
                            <i className="bi bi-check-circle text-success fs-3"></i>
                          </div>
                          <h6 className="text-muted fw-medium mb-3">Completed Trips</h6>
                          <h2 className="text-success fw-bold display-5">{tripStats.completed}</h2>
                          <p className="text-muted small mt-2">Memories made</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="toast show align-items-center text-white bg-danger border-0 mt-3 mx-auto" role="alert">
          <div className="d-flex">
            <div className="toast-body">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setError(null)}></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;