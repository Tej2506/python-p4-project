// UserProfile.js
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AddCar from './AddCar';
import CompareCars from './CompareCars';
import { Link } from 'react-router-dom';


function UserProfile() {
  const { user_id } = useParams();
  const [cars, setCars] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);
  const [showComparsion, setShowComparison] = useState(false);
  const [noCarsAdded, setNoCarsAdded] = useState(false);
  const history = useHistory();

  function handleSelectCar(carId) {
    setShowComparison(false);
    if (selectedCars.includes(carId)) {
      setSelectedCars(selectedCars.filter(id => id !== carId));
    } else {
      setSelectedCars([...selectedCars, carId]);
    }
  }

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/my_comparisons`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 204) {
          setNoCarsAdded(true);
        }
        throw new Error('Failed to fetch cars');
      })
      .then(data => {
        if (data.length === 0) {
          setNoCarsAdded(true);
        } else {
          setCars(data);
          setNoCarsAdded(false);
        }
      })
      .catch(error => console.error('Error fetching cars:', error));
  }, []);

  function handleLogout() {
    fetch('http://127.0.0.1:5000/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          history.push('/');
        }
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  }

  function handleCompareCars() {
    setShowComparison(true);
  }

  function handleDelete(car_ids) {
    fetch(`http://127.0.0.1:5000/delete_comparisons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 'car_ids': car_ids }),
    })
      .then((response) => {
        if (response.ok) {
          setCars(cars.filter(car => !car_ids.includes(car['id'])));
        } else {
          throw new Error('Failed to delete the car.');
        }
      });
  }

  return (
    <div className="user-profile-page">
      <div className="user-profile-container">
        <h2>Compare Cars</h2>
        <h3>Select Cars to compare</h3>
        <Link to ={`/userprofile/${user_id}/dashboard`} className="hero-button">Dashboard</Link>
        <button className='user-profile-button logout-button' onClick={handleLogout}>
          Logout
        </button>
        <div>
          {noCarsAdded ? (
            <p>No Cars added</p>
          ) : (
            <ul className="car-list">
              {cars.map(car => (
                <li key={car.id}>
                  <input
                    type="checkbox"
                    onChange={() => handleSelectCar(car.id)}
                    checked={selectedCars.includes(car.id)}
                  />
                  {car.manufacturer} {car.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="user-profile-buttons">
          <button
            className="user-profile-button compare-button"
            onClick={handleCompareCars}
            disabled={selectedCars.length === 0}
          >
            Compare Cars
          </button>
          <button
            className="user-profile-button delete-button"
            onClick={() => handleDelete(selectedCars)}
            disabled={selectedCars.length === 0}
          >
            Delete Selected Cars Permanently
          </button>
        </div>
        {showComparsion && (
          <CompareCars selectedCars={cars.filter(car => selectedCars.includes(car.id))} cars={cars} />
        )}
        <AddCar cars={cars} setCars={setCars} setNoCarsAdded={setNoCarsAdded} />
      </div>
    </div>
  );
}

export default UserProfile;
