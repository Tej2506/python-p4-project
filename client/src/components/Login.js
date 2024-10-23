//Login.js
import React from 'react';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import {useState} from 'react';



const Login = () => {
    const history = useHistory()
    const [loginSuccess, setLoginSuccess] = useState('')
    const formik = useFormik({
        initialValues: {
        username: '',
        password: ''
    },
    onSubmit: (values) => {
        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then(res => {
                if (res.ok){
                    history.push(`/UserProfile/${res.user_id}`)
                }
                else{
                    setLoginSuccess('Invalid credentials')
                }
        });
    }
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
      {loginSuccess &&(<p>{loginSuccess}</p>)}
    </div>
  );
};

export default Login;
