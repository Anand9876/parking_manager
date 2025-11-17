import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg.jpg';


function Customerdetails() {
const [form,setForm]=useState({
    name:" ",
    phone:" ",
    email:" ",
})
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
        fetch('http://localhost:3001/cust_login',{
          method:'POST',
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify(form)
        });
        console.log("Name:",form.name);
        console.log("Phone:",form.phone);
       console.log("Email:",form.email);
       navigate('/vehicle')
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
    <div>
        <button onClick={nav}>Parking Slots</button>
    </div>
    <div style={{textAlign:'start'}}>
      <h2>Customer Details</h2>
      <label>Customer Name:</label>
      <br></br>
      <input style={{width:300,height:30}} name='name' type="text" placeholder='Enter the customer name' onChange={handleInput}
    />
      <br></br>
      <label>Phone number:</label>
      <br></br>
      <input style={{width:300,marginTop:20,height:30}} name='phone' type='number' placeholder='Enter the phone number' onChange={handleInput}/>
      <br></br>
      <label>Email address:</label>
      <br></br>
      <input style={{width:300,marginTop:20,height:30}} name='email' type='email' placeholder='Enter the email address' onChange={handleInput}/>
      <br></br>
      <button style={{marginTop:20,marginLeft:100}} onClick={Submithandle}>Submit</button>
    </div>
    </div>
    </>
  )
}

export default Customerdetails;
