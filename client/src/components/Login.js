// Login.js
import React from 'react';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {
  const history = useHistory();
  const [loginFailed, setLoginFailed] = useState(false);
  const [message, setMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: (values) => {
      fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      })
        .then((res) => {
          if (res.ok) {
            if (res.status === 200) {
              return res.json().then((data) => {
                history.push(`/UserProfile/${data.user_id}`);
              });
            } else if (res.status === 201 || res.status === 202) {
              return res.json().then((data) => {
                setMessage(data['message']);
                setLoginFailed(true);
              });
            }
          } else {
            return res.json().then((data) => {
              setMessage(data['message']);
              setLoginFailed(true);
            });
          }
        })
        .catch((error) => {
          console.error('Error during login:', error);
        });
    },
  });

  return (
    <div>
      <h2>Login</h2>
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
        <button type="submit">Login</button>
      </form>
      {loginFailed && <p>{message}</p>}
    </div>
  );
};

export default Login;
