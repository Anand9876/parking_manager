import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg.jpg';


function Vehicledetails() {
const [form,setForm]=useState({
    license_plate:" ",
    type:" ",
    customer_id:" ",
    slot_id:" "
})
          function nav1(){
navigate('/list');
      }
    const navigate=useNavigate();
     function handleInput(e){
    let value=e.target.value;
    let fieldName=e.target.name;
    setForm(prev=>({
      ...prev,
      [fieldName]:value
    }))
  }
      function Submithandle(){
        fetch('http://localhost:3001/vehicle',{
          method:'POST',
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify(form)
        });
        console.log("License plate:",form.license_plate);
        console.log("Type:",form.type);
       console.log("Customer Id:",form.customer_id);
       console.log("slot_id",form.slot_id);
       navigate('/payment')
      }
        function nav(){
navigate('/parking');
      }

  return (
    <>
        <div style={{backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',     
            backgroundPosition: 'center', 
            height: '100vh',              
            width: '100vw',display:'flex',flexDirection:'column',alignItems:'center'}}>
    <div style={{marginTop:20}}>
        <button onClick={nav}>Parking Slots</button>
        <button onClick={nav1} style={{marginLeft:20}}>Customer List</button>
    </div>
    <div style={{textAlign:'start'}}>
      <h2>Vehicle Details</h2>
      <label>Licenese Plate:</label>
      <br></br>
      <input style={{width:300,height:30}} name='license_plate' type="text" placeholder='Enter the license plaet number' onChange={handleInput}
    />
      <br></br>
      <label>Vehicle Type:</label>
      <br></br>
      <input style={{width:300,marginTop:20,height:30}} name='type' type='text' placeholder='Enter the vehicle Type' onChange={handleInput}/>
      <br></br>
      <label>customer_Id:</label>
      <br></br>
      <input style={{width:300,marginTop:20,height:30}} name='customer_id' type='number' placeholder='Enter the customer ID' onChange={handleInput}/>
      <br></br>
    <input style={{width:300,marginTop:20,height:30}} name='slot_id' type='number' placeholder='Enter the slot ID' onChange={handleInput}/>
      <br></br>
      <button style={{marginTop:20,marginLeft:100}} onClick={Submithandle}>Submit</button>
    </div>
    </div>
    </>
  )
}

export default Vehicledetails;
