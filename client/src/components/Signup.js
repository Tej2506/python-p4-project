//Signup.js
import React from 'react';
import { useFormik } from 'formik';
import {useState} from "react"
import { Link } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('')
  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: (values) => {
      fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
        .then(res => res.json())
        .then(data => setUsername(data.username))

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
      <div>
      {username && (
        <div>
          <p>Your account is now active, go ahead and login.</p>
          <Link to="/login">Go to Login</Link>
        </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
