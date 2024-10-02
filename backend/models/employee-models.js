const mongoose = require('mongoose');

// MongoDB Atlas connection URI
const uri = "mongodb+srv://saadahmadyvc2024:Txp8aZA7cnDubzws@cluster0.ajoe0.mongodb.net/RentalCarManagement?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
      console.log('Connected to the MongoDB Atlas database: RentalCarManagement'); // Log successful connection
  })
  .catch((error) => {
      console.error('Connection to MongoDB Atlas failed:', error); // Log connection errors
  });

// Define the employee schema
const employeeSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, // Username is mandatory
        unique: true // Ensure usernames are unique
    },
    password: {
        type: String,
        required: true // Password is mandatory
    },
    email: {
        type: String,
        required: true, // Email is mandatory
        unique: true // Ensure emails are unique
    },
    employeeid: {
        type: String,
        required: true, // Employee ID is mandatory
        unique: true // Ensure employee IDs are unique
    }
});

// Create the Employee model from the schema
const Employee = mongoose.model("Employee", employeeSchema);

// Export the Employee model for use in other modules
module.exports = Employee;
