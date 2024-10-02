/**
 * @module CustomerController
 * @description Handles customer registration operations.
 */

const Customer = require('../models/customers-models');

/**
 * Controller function to register a new customer.
 * 
 * @param {Object} req - The request object containing customer details.
 * @param {Object} res - The response object for sending back results.
 * @returns {Object} - A JSON response indicating success or failure.
 */
const postCustomer = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate that all required fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ data: 'All fields are required', code: 400 });
  }

  try {
    // Create a new customer instance
    const newCustomer = new Customer({
      username,
      email,
      password
    });

    // Save the new customer to the database
    await newCustomer.save();
    return res.status(201).json({ data: 'Customer registered successfully!', code: 201 });
  } catch (error) {
    // Handle any errors during the registration process
    return res.status(500).json({ data: 'Error registering customer', error: error.message, code: 500 });
  }
};

// Export the postCustomer function for use in routes
module.exports = {
  postCustomer,
};
