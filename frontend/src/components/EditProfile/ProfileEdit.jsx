import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const ProfileEdit = () => {
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    email: '',
    dob: '',
    phoneNumber: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the current profile data when the component mounts
    const fetchProfile = async () => {
      try {
        const userEmail = localStorage.getItem('userName'); // Ensure 'userName' is stored in localStorage
        if (!userEmail) {
          setError('User email not found.');
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/profile/${userEmail}`);
        const data = response.data;
        console.log(data['profile'].email);
        if (data) {
          setProfile({
            name: data['profile'].name || '',
            username: data['profile'].username || '',
            email: data['profile'].email || '',
            dob: data['profile'].dob || '',
            phoneNumber: data['profile'].number || ''
          });
        } else {
          setError('No profile data found.');
        }
      } catch (err) {
        setError('Error fetching profile data.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const username = profile.username;  // Use the username from the profile
      const response = await axios.post(`http://localhost:8000/api/update_user/${username}/`, {
        name: profile.name,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        dob: profile.dob
      });

      if (response.data.status === 'success') {
        setSuccess('Profile updated successfully!');
      } else {
        setError('Failed to update profile. Please try again later.');
      }
    } catch (err) {
      setError('Error updating profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" role="status" /></div>;
  }

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '50px' }}>
      <h2>Edit Profile</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your username"
            name="username"
            value={profile.username}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formDob">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            name="dob"
            value={profile.dob}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formPhoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your phone number"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default ProfileEdit;
