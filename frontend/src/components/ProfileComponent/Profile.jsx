import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: "Ayrin",
    email: "ayrin@example.com",
    bio: "Your AI assistant, always ready to help with tech and creativity!",
    profilePicture: "https://via.placeholder.com/150",
    age: 25,
    tripsPlanned: 12,
    location: "San Francisco, CA",
    dob: "1998-05-20",
    phone: "+1 123 456 7890",
    occupation: "AI Developer",
    languages: ["English", "Spanish"],
    hobbies: ["Traveling", "Coding", "Photography"],
    favoriteDestinations: ["Paris", "Tokyo", "New York"],
    travelGoals: 5,
    travelStyle: "Adventure",
    membership: "Gold Member - Airline XYZ",
    upcomingTrips: ["Trip to Bali - May 2025"],
    wishlist: ["Machu Picchu", "Great Barrier Reef"]
  });

  const handleEditProfile = () => {
    // Logic to edit profile (e.g., open a modal or redirect to an edit page)
    alert("Edit profile clicked");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body text-center">
          <img 
            src={user.profilePicture} 
            alt="Profile" 
            className="rounded-circle mb-3" 
            width="150"
            height="150"
          />
          <h2>{user.name}</h2>
          <p className="text-muted">{user.email}</p>
          <p>{user.bio}</p>

          <div className="row mt-4">
            <div className="col-6">
              <p><strong>Age:</strong> {user.age}</p>
            </div>
            <div className="col-6">
              <p><strong>Location:</strong> {user.location}</p>
            </div>
            <div className="col-6">
              <p><strong>Date of Birth:</strong> {user.dob}</p>
            </div>
            <div className="col-6">
              <p><strong>Phone:</strong> {user.phone}</p>
            </div>
            <div className="col-6">
              <p><strong>Occupation:</strong> {user.occupation}</p>
            </div>
            <div className="col-6">
              <p><strong>Languages:</strong> {user.languages.join(", ")}</p>
            </div>
            <div className="col-6">
              <p><strong>Hobbies:</strong> {user.hobbies.join(", ")}</p>
            </div>
            <div className="col-6">
              <p><strong>Trips Planned:</strong> {user.tripsPlanned}</p>
            </div>
            <div className="col-6">
              <p><strong>Travel Style:</strong> {user.travelStyle}</p>
            </div>
            
            <div className="col-6">
              <p><strong>Upcoming Trips:</strong> {user.upcomingTrips.join(", ")}</p>
            </div>
            <div className="col-6">
              <p><strong>Wishlist:</strong> {user.wishlist.join(", ")}</p>
            </div>
          </div>

          <button 
            onClick={handleEditProfile} 
            className="btn btn-primary mt-3"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
