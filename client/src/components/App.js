//App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Logout from './Logout'; 
import Home from './Home';
import UserProfile from './UserProfile'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Home} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path = "/userprofile/:user_id" component={UserProfile}/>
        </Switch>
      </div>
    </Router>
  
   
  );
}

export default App;
