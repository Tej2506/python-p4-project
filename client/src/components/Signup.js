//Signup.js
import React from 'react';
import { useFormik } from 'formik';

const Signup = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: (values) => {
      fetch('http://localhost:5555/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
        });
    }
  });

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="username"
          onChange={formik.handleChange}
          value={formik.values.username}
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          placeholder="Password"
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
