const express = require('express');
const router = express.Router();
const carController = require('../controllers/car-controller');

// POST route for adding a new car (with image upload)
router.post('/', carController.upload.single('image'), carController.addCar);



// GET route for fetching all cars
router.get('/', carController.getAllCars);

// Edit car (PUT request)
router.put('/:id', carController.upload.single('image'), carController.updateCar);
// Delete car (DELETE request)
router.delete('/:id', carController.deleteCar);

//GET Route to fetch distinct locations
router.get('/locations', carController.getAllLocations);

// Route to get categories by location
router.get('/categories', carController.getCategoriesByLocation);

//GET Route to filter the Car
router.get('/filter', carController.filterCars);

// Route to fetch a car by ID   
router.get('/carId/:carId', carController.getCarById);

// Add a route to check availability and book the car
router.post('/checkAvailabilityAndBook', carController.checkAvailabilityAndBook);

module.exports = router;
