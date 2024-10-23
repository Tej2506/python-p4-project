import React from 'react';
import { useFormik } from 'formik';

function AddCar({ cars, setCars, user_id, setNoCarsAdded }) {
  const formik = useFormik({
    initialValues: {
      manufacturer: '',
      car_name: '',
    },
    onSubmit: (values) => {
      const data = { ...values, user_id };
      fetch(`http://127.0.0.1:5000/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(newcar => {
          if (newcar) {
            setCars([...cars, newcar])
            setNoCarsAdded(false) 
          } 
          else {
            console.error('Failed to add car');
          }
        })
        .catch(error => console.error('Error adding car:', error));
    }
  });

  return (
    <div>
      <h2>Add new cars</h2>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="manufacturer"
          onChange={formik.handleChange}
          value={formik.values.manufacturer}
          placeholder="Manufacturer"
        />
        <input
          type="text"
          name="car_name"
          onChange={formik.handleChange}
          value={formik.values.car_name}
          placeholder="Car Name"
        />
        <button type="submit">Add Car</button>
      </form>
    </div>
  );
}

export default AddCar;
