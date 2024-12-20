// // Login.js
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
          'Accepts': 'application/json'
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

  function clearMeassage(){
    setMessage('')
  }

  return (
    <div className="login-page" onMouseMove={clearMeassage}>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            name="username"
            onChange={formik.handleChange}
            value={formik.values.username}
            placeholder="Username"
            className="input-field"
          />
          <input
            type="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            placeholder="Password"
            className="input-field"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        {loginFailed && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
