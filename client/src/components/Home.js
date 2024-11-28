
// Home.js
import React from 'react';
import { Link } from 'react-router-dom';


function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="overlay">
          <div className="hero-content">
            <h1>Welcome to Car Compare</h1>
            <p>Explore, compare, and discover the perfect car for you.</p>
            <div className="hero-buttons">
              <Link to="/login" className="hero-button">Login</Link>
              <Link to="/signup" className="hero-button">Signup</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Use Car Compare?</h2>
        <div className="feature-list">
          <div className="feature-item">
            <img src="https://content.carlelo.com/uploads/blog_img/1680935136.webp" alt="Car Comparison" />
            <h3>Compare Cars</h3>
            <p>Get detailed comparisons of multiple cars based on price, power, and features.</p>
          </div>
          <div className="feature-item">
            <img src="https://www.vinaudit.com/wp-content/uploads/2023/03/2019-Tesla-Model-3-Vehicle-Specs.png" alt="View Details" />
            <h3>View Details</h3>
            <p>See in-depth specifications of each car to make an informed decision.</p>
          </div>
          <div className="feature-item">
            <img src="https://www.fleetalliance.co.uk/wp-content/uploads/2024/04/Car-to-beat-BIK-202425-scaled-1.webp" alt="Save Favorites" />
            <h3>Save Favorites</h3>
            <p>Create your own car comparisons and save them for easy access anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
