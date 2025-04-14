import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';

const Profile = ({ username }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem('userName');
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/profile/${username}/`);
        console.log(response.data.profile)
        setProfile(response.data.profile);
      } catch (err) {
        setError("Failed to fetch data from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body text-center">
          <h2>{profile.name}</h2>
          <p className="text-muted">{profile.email}</p>

          <div className="row mt-4">
            <div className="col-6">
              <p><strong>Username:</strong> {profile.username}</p>
            </div>
            <div className="col-6">
              <p><strong>Phone Number:</strong> {profile.number}</p>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-6">
              <p><strong>Age:</strong> {profile.age}</p>
            </div>
            <div className="col-6">
              <p><strong>Date of Birth:</strong> {profile.dob}</p>
            </div>
          </div>

          <button className="btn btn-primary mt-3">
            <NavLink to='/edit-profile' className="text-white">Edit Profile</NavLink>
          </button>
          
          <button className="btn btn-warning mt-3 ms-3">
            <NavLink to='/change-password' className="text-white">Change Password</NavLink>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
