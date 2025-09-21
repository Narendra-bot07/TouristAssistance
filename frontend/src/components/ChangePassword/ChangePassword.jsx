import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Alert } from 'react-bootstrap';
import { API_URL } from '../../config.js';

const ChangePassword = ({ username }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChangePassword = async () => {
    setMessage("");
    setError("");

    if (!currentPassword || !newPassword) {
      setError("Both fields are required");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password shouldn't be the same as the old password");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setError("New password must be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character.");
      return;
    }
const username = localStorage.getItem('userName');
    try {
      const response = await axios.post(
        `${API_URL}/change-password/${username}/`, 
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        }
      );

      if (response.status === 200) {
        setMessage("Password updated successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Change Password</h2>

      <Form>
        <Form.Group controlId="currentPassword">
          <Form.Label>Current Password</Form.Label>
          <Form.Control
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </Form.Group>

        <Form.Group controlId="newPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <Form.Text className="text-muted">
            New password must be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character.
          </Form.Text>
        </Form.Group>

        <Button variant="primary" onClick={handleChangePassword} className="w-100">
          Change Password
        </Button>
      </Form>

      {message && <Alert variant="success" className="mt-3">{message}</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </div>
  );
};

export default ChangePassword;
