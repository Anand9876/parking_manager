import React from "react";
import { useEffect } from "react";
import { useState } from "react";

function ParkingSlots(){
    const [slots,setSlots]=useState([]);
    useEffect(()=>{
    const fetchslots=async()=>{
        try{
            const response=await fetch('http://localhost:3001/slots');
            const data=await response.json();
            setSlots(data);
            console.log(data)

        }
        catch(err){
            console.log(err);
        }
    };
    fetchslots();
    },[]);


return(
    <>
    <div>
    <h2>Parking Lot Status</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {slots.map((slot) => (
            <div>
          <div 
            key={slot.slot_id} 
            style={{ 
              border: '1px solid black', 
              padding: '10px', 
              margin: '5px',
              backgroundColor: slot.status === 'Occupied' ? 'red' : 'green' 
            }}
          >
            {slot.slot_number}
          </div>
          <p>{slot.location},</p>
          </div>
        ))}
      </div>
    </div>
    </>
)
}
export default ParkingSlots;