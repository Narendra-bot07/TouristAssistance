import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaFacebookF, FaTwitter, FaGoogle } from 'react-icons/fa';
import axios from 'axios';
import './LoginPage.css';
const baseUrl = import.meta.env.BASE_URL;

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${baseUrl}login/`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      localStorage.setItem('userEmail', response.data.email);
      localStorage.setItem('userName', response.data.username);

      navigate('/');
      window.location.reload();
    } catch (error) {
      setError(
        error.response?.data?.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="row h-100">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white left-panel"
        >
          <h1 className="display-4 fw-bold mb-3">Welcome Back!</h1>
          
        </motion.div>

        <div className="col-md-6 d-flex align-items-center">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto w-100 px-4 py-5 bg-white rounded-4 shadow-lg login-form"
          >
            <h3 className="mb-4 text-center text-primary fw-bold">
              Login to Your Account
            </h3>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Alert variant="danger" className="rounded-3">
                  {error}
                </Alert>
              </motion.div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formIdentifier">
                <Form.Label className="fw-semibold">
                  <FaUser className="me-2" /> Email or Username
                </Form.Label>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Form.Control
                    name="identifier"
                    type="text"
                    placeholder="Enter email or username"
                    value={formData.identifier}
                    onChange={handleChange}
                    required
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
                  transition={{ duration: 0.5, delay: 0.2 }}
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

              <div className="d-flex justify-content-between mb-4">
                <Form.Check
                  id="rememberMe"
                  label="Remember Me"
                  className="text-muted"
                />
                <NavLink to="/forgot-password" className="text-decoration-none text-primary">
                  Forgot Password?
                </NavLink>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
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
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </motion.div>

              <p className="text-center mt-4 mb-2 text-muted">
                Don’t have an account?{' '}
                <NavLink to="/register" className="text-decoration-none text-primary">
                  Register
                </NavLink>
              </p>

              <p className="text-center fw-semibold mb-3 text-muted">Or login with</p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
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