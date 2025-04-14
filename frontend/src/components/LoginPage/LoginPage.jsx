import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: '', 
    password: '',
  });
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Login success:', response.data);

      localStorage.setItem('userEmail', response.data.email);
      localStorage.setItem('userName', response.data.username);

      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.message || 'Invalid credentials. Please try again.'
      );
    }
  };

  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="row h-100">
        {/* Left Panel */}
        <div
          className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white"
          style={{
            background: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb') no-repeat center center`,
            backgroundSize: 'cover',
          }}
        >
          <h1 className="display-3 fw-bold mb-3">Welcome Back!</h1>
          <p className="lead text-center px-5">
            Please login to your account and enjoy seamless access to our services.
          </p>
        </div>

        {/* Right Panel */}
        <div className="col-md-6 d-flex align-items-center">
          <div className="mx-auto w-100 px-4 py-5 bg-white rounded-4 shadow-lg" style={{ maxWidth: '450px' }}>
            <h3 className="mb-4 text-center text-primary fw-bold">Login to Your Account</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email or Username</label>
                <input
                  name="identifier"
                  type="text"
                  className="form-control rounded-pill"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3 position-relative">
                <label className="form-label fw-semibold">Password</label>
                <div className="position-relative">
                  <input
                    name="password"
                    type={passwordVisible ? 'text' : 'password'}
                    className="form-control rounded-pill pe-5"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <i
                    className={`bi ${passwordVisible ? 'bi-eye-slash' : 'bi-eye'} position-absolute top-50 end-0 me-3 translate-middle-y`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between mb-4">
                <div className="form-check">
                  <input
                    name="rememberMe"
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember Me
                  </label>
                </div>
                <NavLink to="/forgot-password" className="text-decoration-none">Forgot Password?</NavLink>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill fw-semibold">
                Login
              </button>

              <p className="text-center mt-4 mb-2">
                Don’t have an account? <NavLink to="/register" className="text-decoration-none">Register</NavLink>
              </p>

              <p className="text-center fw-semibold mb-3">Or login with</p>

              <div className="d-grid gap-2">
                <button type="button" className="btn btn-outline-primary rounded-pill">
                  <i className="bi bi-facebook me-2"></i>Facebook
                </button>
                <button type="button" className="btn btn-outline-info text-dark rounded-pill">
                  <i className="bi bi-twitter me-2"></i>Twitter
                </button>
                <button type="button" className="btn btn-outline-danger rounded-pill">
                  <i className="bi bi-google me-2"></i>Google
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
