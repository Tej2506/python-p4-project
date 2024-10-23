//UserProfile.js
import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom'
import AddCar from './AddCar';
import CompareCars from './CompareCars';

function UserProfile(){
    const [cars, setCars] = useState([])
    const [selectedCars, setSelectedCars] = useState([])
    const [showComparsion, setShowComparison] = useState(false)
    const history = useHistory()


    function handleSelectCar(carId){
        if(selectedCars.includes(carId)){
            setSelectedCars(selectedCars.filter(id => id !== carId))
        }
        else{
            setSelectedCars([...selectedCars, carId])
        }

    }

    useEffect(()=>{
        fetch('http://127.0.0.1:5000/my_comparisons',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
             }
        })

        .then(response => {
            if (response.status === 200) {
              return response.json()
            }
            throw new Error('Failed to fetch cars')
          })
          .then(data => {
            setCars(data) 
          })
          .catch(error => console.error('Error fetching cars:', error))
      }, [])

    function handleLogout(){

        fetch('http://localhost:5000/logout', {
            method: 'POST',
            credentials: 'include',
          })
            .then(res => {
              if (res.ok) {
                history.push('/Home');
            }})
            .catch(error => {
              console.error('Error logging out:', error);
            });
    }

    function handleCompareCars(){
        setShowComparison(true)
    }



    return(
        <div>
            <h2>Compare Cars</h2>
            <h3>Select Cars to compare</h3>
            <button onClick={handleLogout}>Logout</button>
            <div>
                {cars.length > 0 ? (
                    <ul>
                        {cars.map(car=>(
                            <li key ={car.id}>
                                <input
                                    type = "checkbox"
                                    onChange={()=>handleSelectCar(car.id)}
                                    checked={selectedCars.includes(car.id)}
                                />
                                {car.manufacturer} {car.name}
                            </li>
                        ))}
                    </ul>
                ):(
                    <p>No Cars added</p>
                )} 
            </div>
            <button onClick={handleCompareCars} disabled={selectedCars.length===0}>Compare Cars</button>
            {showComparsion && <CompareCars selectedCars={cars.filter(car=>selectedCars.includes(car.id))} />}
            <div>
                <AddCar cars = {cars} setCars={setCars}/>
            </div>   
           
        </div>
            
    )
       
}


export default UserProfile