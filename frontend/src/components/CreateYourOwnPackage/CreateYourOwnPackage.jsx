import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const CreateYourOwnPackage = () => {
  const [formData, setFormData] = useState({
    startCountry: '',
    destinationCountry: '',
    startDate: '',
    endDate: '',
    guests: '',
    numPeople: '',
    preferences: [],
    goals: [],
    diet: '',
    budget: ''
  });

  // Function to format the date to 'DD-MM-YYYY' format
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked, name } = e.target;
    setFormData(prev => {
      const updatedList = checked
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value);
      return { ...prev, [name]: updatedList };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    if (!userEmail || !userName) {
      alert("Please log in before creating a package.");
      return;
    }

    // Format the start and end dates
    const formattedStartDate = formatDate(formData.startDate);
    const formattedEndDate = formatDate(formData.endDate);

    const payload = {
      username: userName,  // Send the username now
      email: userEmail,
      packageDetails: {
        startplace: formData.startCountry,  // Renamed to match the backend's expected key
        destinationplace: formData.destinationCountry,  // Renamed to match the backend's expected key
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        numPeople: formData.numPeople,
        preferences: formData.preferences,
        goals: formData.goals,
        diet: formData.diet,
        budget: formData.budget
      }
    };

    console.log('[DEBUG] Sending payload:', payload);

    try {
      const response = await axios.post('http://localhost:8000/api/save_trip_package/', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Package created successfully:', response.data);
      alert('Your package has been created successfully!');
    } catch (error) {
      console.error('Error creating package:', error);
      alert('There was an error creating your package. Please try again.');
    }
  };

  const activities = [
    "Culture", "Outdoors", "Relaxing", "Wildlife",
    "Romantic", "Religious", "Hiking", "Musical",
    "Shopping", "Business", "Museums", "Party",
    "Traditions", "Walks", "Fishing", "Cruise",
    "Guide", "Healthcare", "Accommodation"
  ];

  const travelGoals = [
    "Adventure", "Relaxation", "Cultural exploration",
    "Spiritual growth", "Family time", "Nature immersion",
    "Socializing", "Learning", "Fitness", "Luxury",
    "Solo travel", "Group travel", "Workation"
  ];

  return (
    <div className="container mt-5 mb-5">
      <div className="card p-4 shadow">
        <h2 className="text-center mb-4">Build Your Own Package</h2>

        <form onSubmit={handleSubmit}>
          {/* Start Place */}
          <div className="mb-3">
            <label className="form-label">Start Place</label>
            <input
              type="text"
              name="startCountry"  // 'name' here should match the state key in formData
              value={formData.startCountry}
              onChange={handleChange}
              className="form-control"
              placeholder="Ex. India"
            />
          </div>

          {/* Destination Place */}
          <div className="mb-3">
            <label className="form-label">Destination Place</label>
            <input
              type="text"
              name="destinationCountry"  // 'name' here should match the state key in formData
              value={formData.destinationCountry}
              onChange={handleChange}
              className="form-control"
              placeholder="Ex. Switzerland"
            />
          </div>

          {/* Dates */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          {/* Number of People */}
          <div className="mb-3">
            <label className="form-label">Number of People</label>
            <input
              type="number"
              name="numPeople"
              value={formData.numPeople}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter number of people in group"
            />
          </div>

          {/* Preferences */}
          <div className="mb-3">
            <label className="form-label">Activity Preferences</label>
            <div className="row">
              {activities.map((activity, i) => (
                <div key={i} className="col-6 col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={activity}
                      checked={formData.preferences.includes(activity)}
                      onChange={handleCheckboxChange}
                      name="preferences"
                      id={`pref-${i}`}
                    />
                    <label className="form-check-label" htmlFor={`pref-${i}`}>
                      {activity}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="mb-3">
            <label className="form-label">Travel Goals</label>
            <div className="row">
              {travelGoals.map((goal, i) => (
                <div key={i} className="col-6 col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={goal}
                      checked={formData.goals.includes(goal)}
                      onChange={handleCheckboxChange}
                      name="goals"
                      id={`goal-${i}`}
                    />
                    <label className="form-check-label" htmlFor={`goal-${i}`}>
                      {goal}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dietary */}
          <div className="mb-3">
            <label className="form-label">Dietary Restrictions</label>
            <input
              type="text"
              name="diet"
              value={formData.diet}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., Vegan, Gluten-free"
            />
          </div>

          {/* Budget */}
          <div className="mb-4">
            <label className="form-label">Budget</label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your budget in INR"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">Build Package</button>
        </form>
      </div>
    </div>
  );
};

export default CreateYourOwnPackage;
