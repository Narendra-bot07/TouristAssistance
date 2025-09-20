import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const baseUrl = import.meta.env.BASE_URL;

const UNSPLASH_ACCESS_KEY = '8Vu1oE8SBFC4zelEK_g8U37gGpPKhPP_yURVh00Gaqk'; 

const fetchUnsplashImage = async (query) => {
  try {
    const res = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        orientation: 'landscape',
        per_page: 1
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    return res?.data?.results?.[0]?.urls?.regular || null;
  } catch (err) {
    console.error('Error fetching image from Unsplash', err);
    return null;
  }
};

const TripDetails = () => {
  const { packageId } = useParams();
  const username = localStorage.getItem('userName');
  const [packageData, setPackageData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`${baseUrl}package/${username}/${packageId}/`);
        if (response.data.status === 'success') {
          const packageDetails = response.data.package;

          const enhancedItinerary = await Promise.all(
            packageDetails.itinerary.map(async (day) => {
              const locationImage = await fetchUnsplashImage(day.location);
              const accommodationImage = await fetchUnsplashImage(day.accommodation?.name);
              const mealImages = await Promise.all(
                day.meals.map(async (meal) => ({
                  ...meal,
                  img: await fetchUnsplashImage(meal.type)
                }))
              );
              const activityImages = await Promise.all(
                day.activities.map(async (activity) => ({
                  ...activity,
                  img: await fetchUnsplashImage(activity.type)
                }))
              );

              return {
                ...day,
                locationImage,
                accommodationImage,
                meals: mealImages,
                activities: activityImages
              };
            })
          );

          setPackageData({ ...packageDetails, itinerary: enhancedItinerary });
        } else {
          setError(response.data.message || 'Failed to fetch package');
        }
      } catch (err) {
        setError('Error fetching package');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [username, packageId]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const { input, itinerary } = packageData || {};

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Trip from {input.startplace} to {input.destinationplace}</h2>

      {itinerary?.map((day, index) => (
        <div key={index} className="card mb-3 p-3 shadow-sm">
          <h5>Day {day.day} - {day.date} ({day.location})</h5>

          {day.locationImage && (
            <img src={day.locationImage} alt={day.location} className="img-fluid rounded mb-3" style={{ height: '300px', objectFit: 'cover', width: '100%' }} />
          )}

          <p><strong>Notes:</strong> {day.notes}</p>

          <div>
            <strong>Activities:</strong>
            <ul>
              {day.activities.map((activity, idx) => (
                <li key={idx}>
                  {activity.img && <img src={activity.img} alt={activity.type} className="img-thumbnail me-2" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />}
                  {activity.description} ({activity.type}) - {activity.duration} - {activity.notes}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Transport:</strong>
            <ul>
              {day.transport.map((t, idx) => (
                <li key={idx}>
                  {t.mode} - {t.estimatedCost} {t.currency} ({t.details})
                </li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Accommodation:</strong>
            <p>
              {day.accommodation.name} ({day.accommodation.type}) - {day.accommodation.estimatedCost} {day.accommodation.currency}<br />
              <em>{day.accommodation.notes}</em>
            </p>
            {day.accommodationImage && (
              <img src={day.accommodationImage} alt={day.accommodation.name} className="img-fluid rounded mb-3" style={{ height: '200px', objectFit: 'cover', width: '100%' }} />
            )}
          </div>

          <div>
            <strong>Meals:</strong>
            <ul>
              {day.meals.map((meal, idx) => (
                <li key={idx}>
                  {meal.img && <img src={meal.img} alt={meal.type} className="img-thumbnail me-2" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />}
                  {meal.type}: {meal.description} - {meal.cost} {meal.currency} ({meal.notes})
                </li>
              ))}
            </ul>
          </div>

          <p><strong>Total Cost for the Day:</strong> {day.costEstimate} {day.meals[0]?.currency}</p>
        </div>
      ))}
    </div>
  );
};

export default TripDetails;
