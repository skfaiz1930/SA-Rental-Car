const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');  // Import path for handling file paths
const userRoutes = require('./router/user-router');
const carRoutes = require('./router/car-router');  // Import the car routes

const app = express(); // Create an instance of the Express application

const cors = require('cors');
app.use(cors()); // Enable Cross-Origin Resource Sharing

app.use(bodyParser.json()); // Parse incoming JSON requests

// Serve static files from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// User routes
app.use('/api/customer', userRoutes); // Define routes for customer-related operations

// Car routes
app.use('/api/cars', carRoutes);  // Include routes for car-related operations

const PORT = process.env.PORT || 5000; // Set the port for the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log server start message
});
