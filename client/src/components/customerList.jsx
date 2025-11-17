import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const navigate=useNavigate();
  function nav(){
    navigate('/vehicle');
  }

  const getCustomers = async () => {
    try {
      const response = await fetch("http://localhost:3001/customerslist");
      const jsonData = await response.json();
      setCustomers(jsonData);
      console.log(customers);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
    <div>
        <button onClick={nav}>vehicle Details</button>
    </div>
      <h2>Customer Database</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "whitesmoke",color:'black' }}>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customer_id}>
              <td>{customer.customer_id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Show a message if list is empty */}
      {customers.length === 0 && <p>No customers found.</p>}
    </div>
  );
};

export default CustomerList;