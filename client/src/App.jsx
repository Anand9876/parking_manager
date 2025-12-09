import { useState } from 'react'
import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Customerdetails from './components/customerdetails';
import VehicleDetails from './components/vehicledetails';
import ParkingSlots from './components/parking_slots';
import CustomerList from './components/customerList';
import Payment from './components/payment';
function App() {
return(
  <Router>
    <Routes>
      <Route path='/' element={<Customerdetails/>}></Route>
      <Route path='/vehicle' element={<VehicleDetails/>}></Route>
      <Route path='/parking' element={<ParkingSlots/>}></Route>
      <Route path='/list' element={<CustomerList/>}></Route>
      <Route path='/payment' element={<Payment/>}></Route>
    </Routes>
  </Router>
)
}

export default App
