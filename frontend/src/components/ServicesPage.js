import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import axios from 'axios';
import '../css/ServicesPage.css';

/**
 * ServicesPage component allows users to browse available car categories and cars,
 * and provides functionality for adding, editing, and deleting cars for admins.
 * Regular users can browse and book cars, while admins have additional controls for managing cars.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isAdmin - Determines if the current user is an admin.
 * @param {boolean} props.isLoggedIn - Indicates whether the user is logged in.
 * @returns {JSX.Element} - The rendered ServicesPage component.
 */
const ServicesPage = ({ isAdmin, isLoggedIn }) => { 
    const [cars, setCars] = useState([]); // Stores the list of cars fetched from the server
    const [category, setCategory] = useState('All'); // Stores the selected category filter
    const [editCarId, setEditCarId] = useState(null); // Tracks the car being edited
    const [showForm, setShowForm] = useState(false);  // Controls the display of the car form
    const [newCarData, setNewCarData] = useState({ // Stores the form data for adding/editing a car
        name: '',
        year: '',
        category: 'Sport Cars',
        oldPrice: '',
        price: '',
        location: '',
        fuelConsumption: '',
        lastMaintenance: '',
        safety: '',
        quality: '',
        comfort: '',
        isSportCar: false,
        acceleration: '',
        seats: '',
        kmPerDay: '',
        warranty: '',
        insurance: '',
        image: null
    });

    const [successMessage, setSuccessMessage] = useState(''); // Stores success messages
    const [errorMessage, setErrorMessage] = useState(''); // Stores error messages

    const navigate = useNavigate(); 
    const location = useLocation(); 

    // Fetches the list of cars whenever the category filter changes
    useEffect(() => {
        fetchCars();
    }, [category]);

    /**
     * Fetches the list of cars from the API based on the selected category filter.
     */
    const fetchCars = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/cars?category=${category !== 'All' ? category : ''}`);
            setCars(response.data);
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    /**
     * Handles the change in category selection.
     *
     * @param {Object} e - Event object from the select input.
     */
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    /**
     * Handles the input change for the form fields.
     *
     * @param {Object} e - Event object from the input field.
     */
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewCarData({ ...newCarData, [name]: type === 'checkbox' ? checked : value });
    };

    /**
     * Handles file input change for uploading an image.
     *
     * @param {Object} e - Event object from the file input.
     */
    const handleFileChange = (e) => {
        setNewCarData({ ...newCarData, image: e.target.files[0] });
    };

    /**
     * Handles the addition of a new car.
     * Submits the form data to the API and resets the form upon success.
     *
     * @param {Object} e - Event object from the form submission.
     */
    const handleAddCar = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        const formData = new FormData();
        // Append form data fields
        formData.append('name', newCarData.name);
        formData.append('year', newCarData.year);
        formData.append('category', newCarData.category);
        formData.append('oldPrice', newCarData.oldPrice);
        formData.append('price', newCarData.price);
        formData.append('location', newCarData.location);
        formData.append('fuelConsumption', newCarData.fuelConsumption);
        formData.append('safety', newCarData.safety);
        formData.append('lastMaintenance', newCarData.lastMaintenance);
        formData.append('quality', newCarData.quality);
        formData.append('comfort', newCarData.comfort);
        formData.append('isSportCar', newCarData.isSportCar);
        if (newCarData.isSportCar) {
            formData.append('acceleration', newCarData.acceleration);
        }
        formData.append('seats', newCarData.seats);
        formData.append('kmPerDay', newCarData.kmPerDay);
        formData.append('warranty', newCarData.warranty);
        formData.append('insurance', newCarData.insurance);
        formData.append('image', newCarData.image); // File input

        try {
            const response = await axios.post('http://localhost:5000/api/cars', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setSuccessMessage("Car added successfully!");
                setErrorMessage(""); // Clear error message if success
            } else {
                setErrorMessage("Failed to add car. Try again.");
            }
        } catch (err) {
            console.error("Error adding car:", err);
        }

        // Reset the form after submission
        resetForm();
        setShowForm(true); 
    };

    /**
     * Resets the car form fields to their initial state.
     */
    const resetForm = () => {
        setEditCarId(null);
        setNewCarData({
            name: '',
            year: '',
            category: 'Sport Cars',
            oldPrice: '',
            price: '',
            location: '',
            image: null,
            fuelConsumption: '',
            safety: '',
            lastMaintenance: '',
            quality: '',
            comfort: '',
            isSportCar: false,
            acceleration: '',
            seats: '',
            kmPerDay: '',
            warranty: '',
            insurance: ''
        });
    };

    /**
     * Handles the selection of a car for editing.
     *
     * @param {Object} car - The car object to be edited.
     */
    const handleEditCar = (car) => {
        setEditCarId(car._id); 
        setNewCarData({
            name: car.name,
            year: car.year,
            category: car.category,
            oldPrice: car.oldPrice || '',
            price: car.price,
            location: car.location,
            image: null,
            fuelConsumption: car.fuelConsumption || '',
            safety: car.safety || '',
            lastMaintenance: car.lastMaintenance || '',
            quality: car.quality || '',
            comfort: car.comfort || '',
            isSportCar: car.isSportCar || false,
            acceleration: car.acceleration || '',
            seats: car.seats || '',
            kmPerDay: car.kmPerDay || '',
            warranty: car.warranty || '',
            insurance: car.insurance || ''
        });
        setShowForm(false); 
    };

    /**
     * Handles saving the changes made to a car.
     * Sends the updated car data to the API.
     *
     * @param {Object} e - Event object from the form submission.
     * @param {string} carId - The ID of the car being edited.
     */
    const handleSaveChanges = async (e, carId) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in newCarData) {
            formData.append(key, newCarData[key]);
        }
        if (newCarData.image) {
            formData.append('image', newCarData.image);
        }
        try {
            const response = await axios.put(`http://localhost:5000/api/cars/${carId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccessMessage('Car updated successfully!');
            setErrorMessage('');
            fetchCars(); // Fetch the updated car list
            setShowForm(false); 
            setEditCarId(null); 
        } catch (error) {
            console.error('Error in save changes:', error);
            setErrorMessage('Error updating car. Please try again.');
            setSuccessMessage('');
        }
    };

    /**
     * Cancels the editing process and resets the form.
     */
    const handleCancelEdit = () => {
        setEditCarId(null); 
    };

    /**
     * Handles deleting a car.
     * Confirms the action and sends a delete request to the API.
     *
     * @param {string} carId - The ID of the car to be deleted.
     * @param {string} carName - The name of the car to be deleted.
     */
    const handleDeleteCar = async (carId, carName) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the car: ${carName}?`);
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/api/cars/${carId}`);
                setSuccessMessage(`Car ${carName} deleted successfully!`);
                fetchCars();
            } catch (error) {
                setErrorMessage(`Error deleting car ${carName}. Please try again.`);
            }
        }
    };

    /**
     * Navigates to the booking page for the selected car if the user is logged in.
     * If not, redirects to the login page with the original request data.
     *
     * @param {string} carId - The ID of the car to be booked.
     */
    const handleBookNow = (carId) => {
        if (isLoggedIn) {
            navigate(`/book/${carId}`);
        } else {
            navigate('/signin', { state: { from: location.pathname, carId } });
        }
    };

    /**
     * Navigates to the detailed view page of the selected car.
     *
     * @param {string} carId - The ID of the car to view details.
     */
    const handleMoreDetails = (carId) => {
        navigate(`/car-details/${carId}`);
    };

    return (
        <>
        <div className="services-page">
            <h1>Our Car Categories</h1>
            <div className="category-filter">
                <label htmlFor="category">Filter by Category: </label>
                <select id="category" value={category} onChange={handleCategoryChange}>
                    <option value="All">All</option>
                    <option value="Sport Cars">Sport Cars</option>
                    <option value="SUV">SUV</option>
                    <option value="Electric">Electric</option>
                    <option value="Classic">Classic</option>
                </select>
            </div>

            {isAdmin && (
                <button onClick={() => setShowForm(true)} className="add-new-car-button">Add New Car</button>
            )}

            {showForm && (
                <form className="add-car-form" onSubmit={handleAddCar}>
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    
                    {/* Form inputs for car details */}
                    <div>
                        <label>Car Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={newCarData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Car Year:</label> 
                        <input
                            type="number"
                            name="year"
                            value={newCarData.year}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Car Category:</label>
                        <select
                            name="category"
                            value={newCarData.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="Sport Cars">Sport Cars</option>
                            <option value="SUV">SUV</option>
                            <option value="Electric">Electric</option>
                            <option value="Classic">Classic</option>
                        </select>
                    </div>
                    <div>
                        <label>Old Price (optional if on sale):</label>
                        <input
                            type="number"
                            name="oldPrice"
                            value={newCarData.oldPrice}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={newCarData.price}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Location:</label>
                        <input
                            type="text"
                            name="location"
                            value={newCarData.location}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Fuel Consumption:</label>
                        <input
                            type="text"
                            name="fuelConsumption"
                            value={newCarData.fuelConsumption}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Safety:</label>
                        <input
                            type="text"
                            name="safety"
                            value={newCarData.safety}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Last Maintenance:</label>
                        <input
                            type="date"
                            name="lastMaintenance"
                            value={newCarData.lastMaintenance}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Quality:</label>
                        <input
                            type="text"
                            name="quality"
                            value={newCarData.quality}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Comfort:</label>
                        <input
                            type="text"
                            name="comfort"
                            value={newCarData.comfort}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Seats:</label>
                        <input
                            type="number"
                            name="seats"
                            value={newCarData.seats}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>KM Per Day:</label>
                        <input
                            type="number"
                            name="kmPerDay"
                            value={newCarData.kmPerDay}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Warranty:</label>
                        <input
                            type="text"
                            name="warranty"
                            value={newCarData.warranty}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Insurance:</label>
                        <input
                            type="text"
                            name="insurance"
                            value={newCarData.insurance}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Sport Car:</label>
                        <input
                            type="checkbox"
                            name="isSportCar"
                            checked={newCarData.isSportCar}
                            onChange={handleInputChange}
                        />
                    </div>
                    {newCarData.isSportCar && (
                        <div>
                            <label>Acceleration (0-100 km/h):</label>
                            <input
                                type="text"
                                name="acceleration"
                                value={newCarData.acceleration}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    <div>
                        <label>Image:</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                        />
                    </div>
                    <button type="submit" className="submit-car-button">Add Car</button>
                </form>
            )}

            <div className="car-category">
                <h2>Cars</h2>
                <div className="car-list">
                    {cars.map(car => (
                        <div className="car-item" key={car._id}>
                            {car.onSale && <span className="sale-badge">Sale</span>}
                            <img src={`http://localhost:5000${car.imageUrl}`} alt={car.name} />
                            {editCarId === car._id ? (
                                <form onSubmit={(e) => handleSaveChanges(e, car._id)} className="edit-car-form">
                                    <div>
                                        <label>Car Name:</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newCarData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                    <label>Car Year:</label> 
                                    <input
                                        type="number"
                                        name="year"
                                        value={newCarData.year}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    </div>
                                    <div>
                                        <label>Car Category:</label>
                                        <select
                                            name="category"
                                            value={newCarData.category}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="Sport Cars">Sport Cars</option>
                                            <option value="SUV">SUV</option>
                                            <option value="Electric">Electric</option>
                                            <option value="Classic">Classic</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Old Price:</label>
                                        <input
                                            type="number"
                                            name="oldPrice"
                                            value={newCarData.oldPrice}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Price:</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={newCarData.price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Location:</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={newCarData.location}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Fuel Consumption:</label>
                                        <input
                                            type="text"
                                            name="fuelConsumption"
                                            value={newCarData.fuelConsumption}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Safety:</label>
                                        <input
                                            type="text"
                                            name="safety"
                                            value={newCarData.safety}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Last Maintenance:</label>
                                        <input
                                            type="date"
                                            name="lastMaintenance"
                                            value={newCarData.lastMaintenance}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Quality:</label>
                                        <input
                                            type="text"
                                            name="quality"
                                            value={newCarData.quality}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Comfort:</label>
                                        <input
                                            type="text"
                                            name="comfort"
                                            value={newCarData.comfort}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Seats:</label>
                                        <input
                                            type="number"
                                            name="seats"
                                            value={newCarData.seats}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>KM Per Day:</label>
                                        <input
                                            type="number"
                                            name="kmPerDay"
                                            value={newCarData.kmPerDay}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Warranty:</label>
                                        <input
                                            type="text"
                                            name="warranty"
                                            value={newCarData.warranty}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Insurance:</label>
                                        <input
                                            type="text"
                                            name="insurance"
                                            value={newCarData.insurance}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Sport Car:</label>
                                        <input
                                            type="checkbox"
                                            name="isSportCar"
                                            checked={newCarData.isSportCar}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {newCarData.isSportCar && (
                                        <div>
                                            <label>Acceleration (0-100 km/h):</label>
                                            <input
                                                type="text"
                                                name="acceleration"
                                                value={newCarData.acceleration}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label>Image:</label>
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div className="edit-form-buttons">
                                        <button type="submit" className="save-changes-button">Save Changes</button>
                                        <button type="button" className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <h2>{car.name}</h2>
                                    <p>Car Year: {car.year}</p>
                                    {car.oldPrice && <p className="old-price">Old Price: {car.oldPrice} ILS</p>}
                                    <p>Price: {car.price} ILS/day</p>
                                    <p>Location: {car.location}</p> 
                                    <button onClick={() => handleBookNow(car._id)} className="book-now-button">Book Now</button>
                                    <button onClick={() => handleMoreDetails(car._id)} className="more-details-button">
                                       More Details
                                    </button>
                                    {isAdmin && (
                                        <div className="action-buttons">
                                            <button onClick={() => handleEditCar(car)} className="edit-car-button">Edit Car</button>
                                            <button onClick={() => handleDeleteCar(car._id, car.name)} className="delete-car-button">Delete Car</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <footer>
        <p>&copy; 2024 SA Rental Car. All rights reserved.</p>
      </footer>
        </>
    );
}

export default ServicesPage;
