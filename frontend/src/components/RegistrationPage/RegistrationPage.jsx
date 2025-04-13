import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert("Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.");
      return;
    }

    const data = {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      phonenumber: formData.phone,
      password: formData.password,
      confirmPassword:formData.confirmPassword
    };

    try {
      const response = await axios.post('http://localhost:8000/api/register/', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Registration success:', response.data);
      alert('Registration successful!');
      window.location.href = '/login';
    } catch (error) {
      console.error('There was an error during registration:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Error during registration. Please try again.');
      } else {
        setError('Error during registration. Please try again.');
      }
    }
  };

  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="row h-100">
        <div
          className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white"
          style={{
            background: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb') no-repeat center center`,
            backgroundSize: 'cover',
          }}
        >
          <h1 className="display-3 fw-bold mb-3 animate__animated animate__fadeInDown">Hello World.</h1>
          <p className="lead text-center px-5 animate__animated animate__fadeInUp">
            Discover the beauty of seamless registration and design.
          </p>
        </div>

        <div className="col-md-6 d-flex align-items-center">
          <div className="mx-auto w-100 px-4 py-5 bg-white rounded-4 shadow-lg" style={{ maxWidth: '450px' }}>
            <h3 className="mb-4 text-center text-primary fw-bold">Create an Account</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                  name="username"
                  type="text"
                  className="form-control rounded-pill"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input
                  name="name"
                  type="text"
                  className="form-control rounded-pill"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control rounded-pill"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  className="form-control rounded-pill"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3 position-relative">
                <label className="form-label fw-semibold">Password</label>
                <input
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  className="form-control rounded-pill"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <i
                  className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"} position-absolute top-50 end-0 me-3`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                />
              </div>

              <div className="mb-3 position-relative">
                <label className="form-label fw-semibold">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type={confirmPasswordVisible ? "text" : "password"}
                  className="form-control rounded-pill"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <i
                  className={`bi ${confirmPasswordVisible ? "bi-eye-slash" : "bi-eye"} position-absolute top-50 end-0 me-3`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                />
              </div>

              <div className="form-check mb-4">
                <input
                  name="acceptedTerms"
                  className="form-check-input"
                  type="checkbox"
                  checked={formData.acceptedTerms}
                  onChange={handleChange}
                  id="termsCheck"
                  required
                />
                <label className="form-check-label" htmlFor="termsCheck">
                  I agree to the <a href="#">terms</a> and <a href="#">privacy policy</a>
                </label>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill fw-semibold">
                Register
              </button>

              <p className="text-center mt-4 mb-2">
                Already have an account? <a href="#" className="text-decoration-none"><NavLink to='/login'>Login</NavLink></a>
              </p>

              <p className="text-center fw-semibold mb-3">Or register with</p>

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
