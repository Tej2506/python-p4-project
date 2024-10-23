import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import AddCar from './AddCar';
import CompareCars from './CompareCars';

function UserProfile() {
  const { user_id } = useParams();
  const [cars, setCars] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);
  const [showComparsion, setShowComparison] = useState(false);
  const [noCarsAdded, setNoCarsAdded] = useState(false);
  const history = useHistory();

  function handleSelectCar(carId) {
    setShowComparison(false)
    if (selectedCars.includes(carId)) {
      setSelectedCars(selectedCars.filter(id => id !== carId));
    } else {
      setSelectedCars([...selectedCars, carId]);
    }
  }

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/my_comparisons/${user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
        else if (response.status === 204) {
          setNoCarsAdded(true);
          return [];
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
  }, [user_id]);

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
  function handleDelete(car_ids){
      fetch(`http://127.0.0.1:5000/delete_comparisons/${user_id}`,{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 'car_ids': car_ids}),
      })
      .then((response) => {
        if (response.ok) {
          setCars(cars.filter(car=> !car_ids.includes(car['id'])))
        } 
        else {
          throw new Error('Failed to delete the car.');
        }
    })
}


  return (
    <div>
      <h2>Compare Cars</h2>
      <h3>Select Cars to compare</h3>
      <button onClick={handleLogout}>Logout</button>
      <div>
        {noCarsAdded ? (
          <p>No Cars added</p>
        ) : (
          <ul>
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
      <button onClick={handleCompareCars} disabled={selectedCars.length === 0}>
        Compare Cars
      </button>
      <button onClick={()=>handleDelete(selectedCars)} disabled={selectedCars.length === 0}>Delete Selected Cars Permanently</button>
      {showComparsion && (
        <CompareCars
          selectedCars={cars.filter(car => selectedCars.includes(car.id))}
          cars={cars}
        />
      )}
      <div>
        <AddCar cars={cars} setCars={setCars} user_id={user_id} setNoCarsAdded={setNoCarsAdded}/>
      </div>
    </div>
  );
}

export default UserProfile;
