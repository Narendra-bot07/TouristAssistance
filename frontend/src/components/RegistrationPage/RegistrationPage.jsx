import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaUser, FaUserTag, FaEnvelope, FaPhone, FaLock, FaBirthdayCake, FaFacebookF, FaTwitter, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import './RegistrationPage.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dob: '',
    acceptedTerms: false,
  });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
    setValidationErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors([]);

    // Client-side validation
    const errors = [];
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match.');
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      errors.push('Password must be at least 8 characters, with one uppercase letter, one number, and one special character.');
    }

    if (!formData.dob) {
      errors.push('Please enter your date of birth.');
    }

    if (!formData.acceptedTerms) {
      errors.push('You must agree to the terms and privacy policy.');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    const data = {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      phonenumber: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      dob: formData.dob,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/register/', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Error during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="row h-100">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white left-panel"
        >
          <h1 className="display-4 fw-bold mb-3">Join the Journey</h1>
          <p className="lead text-center px-5">
            Create an account to start planning your dream adventures.
          </p>
        </motion.div>

        {/* Right Panel */}
        <div className="col-md-6 d-flex align-items-center">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto w-100 px-4 py-5 bg-white rounded-4 shadow-lg register-form"
          >
            <h3 className="mb-4 text-center text-primary fw-bold">
              Create an Account
            </h3>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Alert variant="danger" className="rounded-3">{error}</Alert>
              </motion.div>
            )}

            {validationErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Alert variant="warning" className="rounded-3">
                  <ul className="mb-0">
                    {validationErrors.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                </Alert>
              </motion.div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label className="fw-semibold">
                  <FaUserTag className="me-2" /> Username
                </Form.Label>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Form.Control
                    name="username"
                    type="text"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="rounded-pill"
                  />
                </motion.div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formName">
                <Form.Label className="fw-semibold">
                  <FaUser className="me-2" /> Name
                </Form.Label>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="rounded-pill"
                  />
                </motion.div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label className="fw-semibold">
                  <FaEnvelope className="me-2" /> Email
                </Form.Label>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="rounded-pill"
                  />
                </motion.div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPhone">
                <Form.Label className="fw-semibold">
                  <FaPhone className="me-2" /> Phone Number
                </Form.Label>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Form.Control
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="rounded-pill"
                  />
                </motion.div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDob">
                <Form.Label className="fw-semibold">
                  <FaBirthdayCake className="me-2" /> Date of Birth
                </Form.Label>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Form.Control
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="rounded-pill"
                  />
                </motion.div>
              </Form.Group>

              <Form.Group className="mb-3 position-relative" controlId="formPassword">
                <Form.Label className="fw-semibold">
                  <FaLock className="me-2" /> Password
                </Form.Label>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="position-relative">
                    <Form.Control
                      name="password"
                      type={passwordVisible ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="rounded-pill pe-5"
                    />
                    <span
                      className="position-absolute top-50 end-0 me-3 translate-middle-y"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </motion.div>
              </Form.Group>

              <Form.Group className="mb-3 position-relative" controlId="formConfirmPassword">
                <Form.Label className="fw-semibold">
                  <FaLock className="me-2" /> Confirm Password
                </Form.Label>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <div className="position-relative">
                    <Form.Control
                      name="confirmPassword"
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="rounded-pill pe-5"
                    />
                    <span
                      className="position-absolute top-50 end-0 me-3 translate-middle-y"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    >
                      {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </motion.div>
              </Form.Group>

              <Form.Group className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Form.Check
                    id="termsCheck"
                    label={
                      <>
                        I agree to the{' '}
                        <a href="#" className="text-primary">terms</a> and{' '}
                        <a href="#" className="text-primary">privacy policy</a>
                      </>
                    }
                    name="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
              </Form.Group>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <Button
                  type="submit"
                  className="btn btn-primary w-100 py-2 rounded-pill fw-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Registering...
                    </>
                  ) : (
                    'Register'
                  )}
                </Button>
              </motion.div>

              <p className="text-center mt-4 mb-2 text-muted">
                Already have an account?{' '}
                <NavLink to="/login" className="text-decoration-none text-primary">
                  Login
                </NavLink>
              </p>

              <p className="text-center fw-semibold mb-3 text-muted">Or register with</p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="d-grid gap-2"
              >
                <Button
                  variant="outline-primary"
                  className="rounded-pill d-flex align-items-center justify-content-center"
                >
                  <FaFacebookF className="me-2" /> Facebook
                </Button>
                <Button
                  variant="outline-info"
                  className="rounded-pill d-flex align-items-center justify-content-center"
                >
                  <FaTwitter className="me-2" /> Twitter
                </Button>
                <Button
                  variant="outline-danger"
                  className="rounded-pill d-flex align-items-center justify-content-center"
                >
                  <FaGoogle className="me-2" /> Google
                </Button>
              </motion.div>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}