//AddCar.js

import React, { useState } from 'react';
import { useFormik } from 'formik';

function AddCar({ cars, setCars, setNoCarsAdded }) {
  const [message, setMessage] = useState('');
  
  const formik = useFormik({
    initialValues: {
      manufacturer: '',
      car_name: '',
    },
    onSubmit: (values) => {
      fetch(`http://127.0.0.1:5000/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values)
      })
      .then((res) => {
        if (res.ok) {
          if ((res.status === 200) ||(res.status === 201) ) {
            return res.json().then((newcar) => {
              setCars([...cars, newcar]);
              setNoCarsAdded(false);
              setMessage("Car Added!!") 

            });
          } else {
            return res.json().then((data) => {
              setNoCarsAdded(false); 
              setMessage(data['message']);
            });
          }
        } 
        else {
          return res.json().then((data) => {
            setMessage(data['message']);
          });
        }
      });
    }
  });

  function clearMeassage(){
    setMessage('')
  }

  return (
    <div className='container' onMouseMove={clearMeassage}>
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
        <button type="submit" disabled={!formik.values.manufacturer || !formik.values.car_name}>Add Car</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default AddCar;
