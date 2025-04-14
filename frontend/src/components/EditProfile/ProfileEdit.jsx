import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaUser, FaSave, FaArrowLeft, FaEnvelope, FaPhone, FaBirthdayCake, FaUserTag } from 'react-icons/fa';
import './ProfileEdit.css';

const ProfileEdit = () => {
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    email: '',
    dob: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userEmail = localStorage.getItem('userName');
        if (!userEmail) {
          setError('Please log in to view your profile.');
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/profile/${userEmail}`);
        const data = response.data;
        if (data && data.profile) {
          setProfile({
            name: data.profile.name || '',
            username: data.profile.username || '',
            email: data.profile.email || '',
            dob: data.profile.dob || '',
            phoneNumber: data.profile.number || '',
          });
        } else {
          setError('No profile data found.');
        }
      } catch (err) {
        setError('Failed to load profile. Please try again.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const username = profile.username;
      const response = await axios.post(`http://localhost:8000/api/update_user/${username}/`, {
        name: profile.name,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        dob: profile.dob,
      });

      if (response.data.status === 'success') {
        setSuccess('Profile updated successfully!');
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } catch (err) {
      setError('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-edit-page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="profile-header text-center"
      >
        <h1 className="fw-bold mb-3">
          <FaUser className="me-2" /> Edit Your Profile
        </h1>
        <p className="text-muted mb-4">
          Update your details to personalize your travel experience.
        </p>
      </motion.div>

      {/* Form */}
      <div className="container">
        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" role="status" />
            <p className="text-muted mt-2">Saving changes...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="profile-form-card shadow-lg rounded-4"
          >
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Alert variant="danger">{error}</Alert>
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Alert variant="success">{success}</Alert>
              </motion.div>
            )}

            <div className="avatar-container text-center mb-4">
              <img
                src="https://cdna.artstation.com/p/assets/images/images/050/664/730/large/default-egg-bag2.jpg?1655383353"
                alt="Profile Avatar"
                className="avatar-image rounded-circle"
              />
              <Button variant="link" className="edit-avatar-btn">
                Change Avatar
              </Button>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>
                  <FaUserTag className="me-2" /> Name
                </Form.Label>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="rounded-3"
                  />
                </motion.div>
              </Form.Group>

              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label>
                  <FaUser className="me-2" /> Username
                </Form.Label>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    className="rounded-3"
                  />
                </motion.div>
              </Form.Group>

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>
                  <FaEnvelope className="me-2" /> Email
                </Form.Label>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="rounded-3"
                  />
                </motion.div>
              </Form.Group>

              <Form.Group controlId="formDob" className="mb-3">
                <Form.Label>
                  <FaBirthdayCake className="me-2" /> Date of Birth
                </Form.Label>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Form.Control
                    type="date"
                    name="dob"
                    value={profile.dob}
                    onChange={handleChange}
                    className="rounded-3"
                  />
                </motion.div>
              </Form.Group>

              <Form.Group controlId="formPhoneNumber" className="mb-4">
                <Form.Label>
                  <FaPhone className="me-2" /> Phone Number
                </Form.Label>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Form.Control
                    type="text"
                    placeholder="Enter your phone number"
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleChange}
                    className="rounded-3"
                  />
                </motion.div>
              </Form.Group>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="d-flex justify-content-between"
              >
                <Link to="/profile">
                  <Button
                    variant="outline-secondary"
                    className="back-btn rounded-3"
                  >
                    <FaArrowLeft className="me-2" color="white"/> Back
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  type="submit"
                  className="save-btn rounded-3"
                  disabled={loading}
                >
                  <FaSave className="me-2" color="white"/> Save Changes
                </Button>
              </motion.div>
            </Form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfileEdit;