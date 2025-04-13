import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    // Simulating an API call
    const fetchItineraries = async () => {
      // Replace this with an actual API call if needed
      const data = [
        {
          id: 1,
          title: 'Explore the mountains',
          description: 'Explore the mountains with our exclusive package.',
        },
        {
          id: 2,
          title: 'Relax on the beaches',
          description: 'Relax on the beaches with our premium package.',
        },
        {
          id: 3,
          title: 'Experience the city life',
          description: 'Experience the city life with our urban package.',
        },
      ];
      setItineraries(data);
    };

    fetchItineraries();
  }, []);

  return (
    <div className="container">
      <div className="my-5 text-center">
        <h1 className="display-4 mb-4">Plan Your Perfect Trip</h1>
        <p className="lead mb-4">
          Discover amazing destinations and create your personalized itinerary.
        </p>
        <Link to="/create-your-own" className="btn btn-primary btn-lg mt-3">
          Create new Package Here
        </Link>
      </div>

    
    </div>
  );
};

export default HomePage;
