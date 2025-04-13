import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');

    if (email) {
      axios.get(`http://localhost:8000/api/get_user/?email=${email}`)
        .then(response => {
          if (response.data.status === 'success') {
            setIsLoggedIn(true);
            setUsername(response.data.name);
          }
        })
        .catch(error => {
          console.error('Failed to fetch user info:', error);
          setIsLoggedIn(false);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <style>
        {`
          .hover-dropdown:hover .dropdown-menu {
            display: block;
            margin-top: 0;
          }

          .hover-dropdown .dropdown-menu {
            transition: all 0.2s ease-in-out;
          }
        `}
      </style>

      <header>
        <nav className="navbar navbar-expand-lg shadow-lg" style={navbarStyle}>
          <div className="container-fluid">
            <Link className="navbar-brand" to="/" style={brandStyle}>Travel Planner</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center">
                <NavItem to="/" label="Home" />
                <NavItem to="/packages" label="Packages" />
                <NavItem to="/create-your-own" label="Create Your Own" />
                <NavItem to="/about-us" label="About Us" />

                {!isLoggedIn ? (
                  <>
                    <NavButton to="/login" label="Login" type="outline" />
                    <NavButton to="/register" label="Register" type="solid" />
                  </>
                ) : (
                  <li className="nav-item dropdown mx-2 hover-dropdown">
                    <button className="btn btn-light dropdown-toggle rounded-pill px-4 py-2" style={buttonStyle}>
                      {username} 🧳
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow">
                      <li><Link className="dropdown-item" to="/profile">View Profile</Link></li>
                      <li><Link className="dropdown-item" to="/my-trips">My Recent Trips</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

const NavItem = ({ to, label }) => (
  <li className="nav-item">
    <Link className="nav-link" to={to} style={linkStyle}>{label}</Link>
  </li>
);

const NavButton = ({ to, label, type }) => (
  <li className="nav-item mx-2">
    <Link
      to={to}
      className={`btn ${type === 'outline' ? 'btn-outline-light' : 'btn-light'} rounded-pill px-4 py-2`}
      style={buttonStyle}
    >
      {label}
    </Link>
  </li>
);

// Styles
const navbarStyle = {
  background: 'linear-gradient(90deg, #0f2027, #203a43, #2c5364)',
};

const brandStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const linkStyle = {
  color: '#ffffff',
  fontSize: '17px',
  padding: '8px 15px',
  margin: '0 5px',
  borderRadius: '5px',
  transition: '0.3s',
};

const buttonStyle = {
  transition: '0.3s',
  fontWeight: '500',
};

export default Header;
