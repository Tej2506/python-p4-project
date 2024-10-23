// components/Home.js

import React from 'react';
import { Link } from 'react-router-dom';



function Home(){
    return(
        <div>
            <h1>Welcome to Car Compare</h1>
            <p>This app allows you to compare different cars, view car details, and more. Please use the navigation above to explore the app</p>
            <ul>
                <li><Link to ="/login">Login</Link></li>
                <li><Link to ="/signup">Signup</Link></li>
            </ul>
        </div>
    );
}

export default Home;
