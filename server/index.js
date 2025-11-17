const express=require('express');
const cors=require('cors');
const {Client}= require("pg");
const app=express();

app.use(cors({origin:'*'}));
app.use(express.json());

const connection=new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    database:"parking_manager",
})
connection.connect().then(()=>console.log("connected"));


async function createvehicletable(){
try{
    const query=`CREATE TABLE vehicle (
    vehicle_id SERIAL PRIMARY KEY,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(20),
    customer_id INT REFERENCES customer(customer_id) ON DELETE CASCADE
);`;
    await connection.query(query);
    console.log("vehicle table created.")
}catch(err){
console.error("Error creating table:",err);
}
}
async function createcustomertable(){
try{
    const query=`CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE,
    email VARCHAR(100) UNIQUE
);`;
    await connection.query(query);
    console.log("customer table created.")
}catch(err){
console.error("Error creating table:",err);
}
}
async function createrecordtable(){
try{
    const query=`CREATE TABLE parking_record (
    record_id SERIAL PRIMARY KEY,
    vehicle_id INT REFERENCES vehicle(vehicle_id) ON DELETE CASCADE,
    slot_id INT REFERENCES parking_slot(slot_id) ON DELETE SET NULL,
    entry_time TIMESTAMP NOT NULL,
    exit_time TIMESTAMP,
    total_fee DECIMAL(10,2)
);`;
    await connection.query(query);
    console.log("customer table created.")
}catch(err){
console.error("Error creating table:",err);
}
}
createrecordtable();
createcustomertable();
createvehicletable();
app.post('/cust_login',async(req,res)=>{
    console.log(req.body);
    console.log(req.body.name);
    console.log(req.body.phone);
    console.log(req.body.email);
    const customer=req.body.name;
    const phone=req.body.phone;
    const mail=req.body.email;
    try{
        const newCust=await connection.query('INSERT INTO CUSTOMER(name,phone,email) VALUES ($1,$2,$3) RETURNING *;',[customer,phone,mail]);
        res.json(newCust.rows[0]);
        console.log("inserted the customer")
    }
    catch(err){
console.error(err.message);
    }
})
app.post('/vehicle',async(req,res)=>{
    console.log(req.body);
    console.log(req.body.license_plate);
    console.log(req.body.type);
    console.log(req.body.id);
    const vehicle=req.body.license_plate;
    const type=req.body.type;
    const customer_id=req.body.customer_id;
    const slot_id=req.body.slot_id
    try{
        const newCust=await connection.query('INSERT INTO VEHICLE(license_plate,type,customer_id) VALUES ($1,$2,$3) RETURNING *;',[vehicle,type,customer_id]);
        res.json(newCust.rows[0]);
        console.log("inserted the vehicle");
        const newVehicleId=newCust.rows[0].vehicle_id;
        console.log("Vehicle insertted with ID:",newVehicleId);

        const newRecord=await connection.query('INSERT INTO parking_record (vehicle_id, slot_id, entry_time) VALUES ($1,$2,NOW()) RETURNING *;',[newVehicleId,slot_id]);

        await connection.query("UPDATE parking_slot SET status = 'Occupied' WHERE slot_id = $1;",[slot_id]);
        res.json({
          vehicle:newCust.rows[0],
          record:newRecord.rows[0],
          message:"Vehicle parked and slot marked as Occupied"
        })
    }
    catch(err){
console.error(err.message);
    }
})
/*app.post('/vehicle', async (req, res) => {
  const { license_plate, type, customer_id, slot_id } = req.body;

  try {
    
      custId = parseInt(customer_id);
    

    let vehicleRes = await connection.query(
      "SELECT vehicle_id FROM vehicle WHERE plate_number = $1", 
      [license_plate]
    );
    
      vehicle_id = vehicleRes.rows[0].vehicle_id;

      const newVehicle = await connection.query(
        "INSERT INTO vehicle (plate_number, vehicle_type, customer_id) VALUES ($1, $2, $3) RETURNING vehicle_id",
        [plate, type, custId]
      );
      vehicle_id = newVehicle.rows[0].vehicle_id;

    const recordRes = await connection.query(
      `INSERT INTO parking_record (vehicle_id, slot_id, entry_time) 
       VALUES ($1, $2, NOW()) 
       RETURNING record_id`,
      [vehicle_id, slot_id]
    );

    await connection.query(
      "UPDATE parking_slot SET status = 'occupied' WHERE slot_id = $1", 
      [slot_id]
    );

    res.json({ 
      success: true, 
      message: "Check-in Complete",
      record_id: recordRes.rows[0].record_id,
      vehicle_id: vehicle_id
    });

  } catch (err) {
    console.error(err.message);
    
    if (err.code === '23503') {
      res.status(400).json("Error: Invalid Slot ID or Customer ID.");
    } else {
      res.status(500).json("Server Error processing check-in");
    }
  }
});*/
app.get('/slots',async(req,res)=>{
    try{
        const result =await connection.query('SELECT * FROM parking_slot ORDER BY slot_id ASC');
        const slots=result.rows;
        res.json(slots);
        console.log(slots);
    }
    catch(err){
        console.log(err);
    }
})
app.get('/customerslist', async (req, res) => {
  try {
    const result = await connection.query('SELECT * FROM customer ORDER BY customer_id ASC');
    const customers=result.rows;
    res.json(customers);
    console.log(customers);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
app.get('/parking:plate', async (req, res) => {
    const { plate } = req.params;
    try {
        const query = `
            SELECT r.record_id, r.entry_time, 
            EXTRACT(EPOCH FROM (NOW() - r.entry_time))/3600 as hours_parked
            FROM parking_record r
            JOIN vehicle v ON r.vehicle_id = v.vehicle_id
            WHERE v.plate_number = $1 AND r.exit_time IS NULL
        `;
        const result = await connection.query(query, [plate]);

        if (result.rows.length === 0) return res.status(404).send("Not found");

        const record = result.rows[0];
        
        const rate = 10; 
        const amount = (Math.ceil(record.hours_parked) * rate).toFixed(2);

        res.json({ 
            record_id: record.record_id, 
            entry_time: record.entry_time, 
            amount: amount 
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.post('/payment', async (req, res) => {
    const { record_id, amount, method } = req.body;
    
    try {
        await connection.query(
            "INSERT INTO payment (record_id, amount, method) VALUES ($1, $2, $3)",
            [record_id, amount, method]
        );

        await connection.query(
            "UPDATE parking_record SET exit_time = NOW(), total_fee = $1 WHERE record_id = $2",
            [amount, record_id]
        );

        res.send("Payment Successful");
    } catch (err) {
        console.error(err);
        res.status(500).send("Database Error");
    }
});
app.listen(3001,()=>{
    console.log("Server is running in port 3001")
})