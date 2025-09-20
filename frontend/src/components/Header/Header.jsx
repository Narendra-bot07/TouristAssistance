import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; 
import "./Header.css";

const baseUrl = import.meta.env.BASE_URL;

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [hasActiveTrip, setHasActiveTrip] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('userName');
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      
      axios.get(`${baseUrl}check-active-trips/${storedUsername}/`)
        .then(response => {
          if (response.data?.hasActiveTrip) {
            setHasActiveTrip(true);
          }
        })
        .catch(error => {
          console.error('Trip status check failed:', error);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark shadow-lg" style={{
        background: 'linear-gradient(90deg, #0f2027, #203a43, #2c5364)'
      }}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Travel Planner
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNavDropdown" 
            aria-controls="navbarNavDropdown" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavDropdown">
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
                <>
                  {hasActiveTrip && (
                    <li className="nav-item me-2">
                      <Link to="/itinerary" className="btn btn-primary rounded-pill px-3">
                        ✈ Active Trip
                      </Link>
                    </li>
                  )}
                  
                  <li className="nav-item dropdown">
                    <button 
                      className="btn btn-light dropdown-toggle rounded-pill px-3" 
                      id="navbarDropdownMenuLink"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        transition: '0.3s',
                        fontWeight: '500'
                      }}
                    >
                      {username} 🧳
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                      <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                      <li><Link className="dropdown-item" to="/my-trips">My Trips</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

// Reusable NavItem component
const NavItem = ({ to, label }) => (
  <li className="nav-item">
    <Link className="nav-link" to={to} style={{
      color: '#ffffff',
      fontSize: '17px',
      padding: '8px 15px',
      margin: '0 5px',
      borderRadius: '5px',
      transition: '0.3s'
    }}>
      {label}
    </Link>
  </li>
);

const NavButton = ({ to, label, type }) => (
  <li className="nav-item mx-2">
    <Link
      to={to}
      className={`btn ${type === 'outline' ? 'btn-outline-light' : 'btn-light'} rounded-pill px-3`}
      style={{
        transition: '0.3s',
        fontWeight: '500'
      }}
    >
      {label}
    </Link>
  </li>
);

export default Header;