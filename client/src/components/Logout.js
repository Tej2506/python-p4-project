//Logout.js
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Logout = () => {
  const history = useHistory();

  useEffect(() => {
    fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include', // Make sure cookies are sent
    })
      .then((res) => {
        if (res.ok) {
          history.push('/login'); // Redirect to login after logout
        }
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }, [history]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
