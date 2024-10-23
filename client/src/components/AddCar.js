//AddCar.js
import React from 'react';
import { useFormik } from 'formik';

function AddCar({cars, setCars}){
  const formik = useFormik({
    initialValues: {
      manufacturer: '',
      car_name: ''
    },
    onSubmit: (values) => {
      fetch('http://127.0.0.1:5000/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
        .then(res => res.json())
        .then(newcar => { setCars([...cars, newcar])});
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
};

export default AddCar;
