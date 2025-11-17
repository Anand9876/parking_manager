import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg.jpg';

function Payment() {
  const navigate = useNavigate();
  const [plate, setPlate] = useState("");
  const [billDetails, setBillDetails] = useState(null);
  const [method, setMethod] = useState("Cash");
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:3001/parking${plate}`);
      
      if (!res.ok) {
        setMessage("Vehicle not found or already paid.");
        setBillDetails(null);
        return;
      }

      const data = await res.json();
      setBillDetails(data);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server.");
    }
  };

  const handlePayment = async () => {
    if (!billDetails) return;

    try {
      const res = await fetch('http://localhost:3001/payment', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          record_id: billDetails.record_id,
          amount: billDetails.amount,
          method: method
        })
      });

      if (res.ok) {
        alert("Payment Successful! Gate Opening...");
        navigate('/parking');
      } else {
        const errText = await res.text();
        setMessage("Payment Failed: " + errText);
      }
    } catch (err) {
      console.error(err);
      setMessage("Transaction Error");
    }
  };

  return (
    <div style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        height: '100vh',
        width:'100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
      <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '12px',
          width: '400px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>Parking Checkout</h2>

        <div style={{ marginBottom: '20px' }}>
          <label>License Plate Number:</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            <input 
              type="text" 
              placeholder="ABC-1234" 
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              style={{ flex: 1, padding: '8px', fontSize: '16px' }}
            />
            <button onClick={handleSearch} style={{ padding: '8px 16px', cursor: 'pointer' }}>
              Search
            </button>
          </div>
        </div>

        {message && <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>}

        {billDetails && (
          <div style={{ borderTop: '2px dashed #ccc', paddingTop: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Entry Time:</span>
              <strong>{new Date(billDetails.entry_time).toLocaleTimeString()}</strong>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2em' }}>
              <span>Total Amount:</span>
              <strong style={{ color: 'green' }}>₹ {billDetails.amount}</strong>
            </div>

            <label>Payment Method:</label>
            <select 
              value={method} 
              onChange={(e) => setMethod(e.target.value)}
              style={{ width: '100%', padding: '10px', marginTop: '5px', marginBottom: '20px' }}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
            </select>

            <button 
              onClick={handlePayment}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              PAY & EXIT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;