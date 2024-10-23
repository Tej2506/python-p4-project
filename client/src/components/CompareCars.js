//CompareCars.js

import React from 'react';

function CompareCars({selectedCars}){

    if(selectedCars.length ===0){
        return <p>No cars added</p>;
    }

    return (
        <div>
      <h3>Car Comparison</h3>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Car Name</th>
            <th>Manufacturer</th>
            <th>Price</th>
            <th>Power</th>
            <th>Engine</th>
            <th>Torque</th>
          </tr>
        </thead>
        <tbody>
          {selectedCars.map(car => (
            <tr key={car.id}>
              <td>{car.name}</td>
              <td>{car.manufacturer}</td>
              <td>{car.price || 'N/A'}</td>
              <td>{car.power || 'N/A'}</td>
              <td>{car.engine || 'N/A'}</td>
              <td>{car.torque || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompareCars;


    