import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../css/BookMe.css';
import DatePicker from 'react-datepicker';  // Import React DatePicker
import 'react-datepicker/dist/react-datepicker.css';  // Import the DatePicker styles
import moment from 'moment';  // Import moment for easier date manipulation

/**
 * BookMe component handles the car booking process.
 * It manages form data, validates rental dates, checks availability, and calculates the rental amount.
 * Users can input payment details and select rental dates for booking a car.
 *
 * @param {string} username - The username of the current user (passed as a prop).
 * @returns {JSX.Element} - The rendered BookMe component.
 */
const BookMe = ({ username }) => {
  const { carId } = useParams();
  const location = useLocation();
  const { carName } = location.state || {};  // Get carName from state

  /**
   * State to store form data for payment and rental details.
   * @type {Object} formData - Contains the user's payment and rental information.
   */
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    fromDate: null,  // Updated to `null` for DatePicker
    toDate: null,    // Updated to `null` for DatePicker
    paymentDate: '',
    rentalDays: 1,        // Default to 1
    amount: 0,            // Default to 0
    currency: 'ILS',      // Default to ILS (Israeli Shekel)
  });

  /**
   * State to store car details such as price and old price.
   * @type {Object} carDetails - Contains price and oldPrice information of the selected car.
   */
  const [carDetails, setCarDetails] = useState({ price: 0, oldPrice: null });

  /**
   * State to store the rental history of the car.
   * @type {Array} rentalHistory - List of past rentals for the car, including rental dates.
   */
  const [rentalHistory, setRentalHistory] = useState([]);

  /**
   * State to store a message regarding car availability.
   * @type {string} availabilityMessage - Displays availability status of the selected dates.
   */
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  const navigate = useNavigate();

  /**
   * Fetch car details and rental history from the server when carId changes.
   * @async
   * @function fetchCarDetails
   */
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cars/carId/${carId}`);
        setCarDetails(response.data);

        // Fetch rental history of the car
        if (response.data.rentalHistory) {
          setRentalHistory(response.data.rentalHistory);
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
      }
    };

    if (carId) {
      fetchCarDetails();
    }
  }, [carId]);

  /**
   * Checks if a selected date is within the car's rental history.
   * @function isDateInRentalHistory
   * @param {Date} date - The date to check.
   * @returns {boolean} - Returns true if the date is within any rental period.
   */
  const isDateInRentalHistory = (date) => {
    const selectedDate = moment(date);

    // Check if the selected date is within any booked date range
    return rentalHistory.some((rental) => {
      const rentalFromDate = moment(rental.fromDate);
      const rentalToDate = moment(rental.toDate);
      return selectedDate.isBetween(rentalFromDate, rentalToDate, null, '[]');
    });
  };

  /**
   * Filters unavailable dates in the DatePicker component.
   * @function filterUnavailableDates
   * @param {Date} date - The date to check.
   * @returns {boolean} - Returns true if the date is available for booking.
   */
  const filterUnavailableDates = (date) => {
    return !isDateInRentalHistory(date);
  };

  /**
   * Handles changes to the "From Date" field and updates form data accordingly.
   * @function handleFromDateChange
   * @param {Date} date - The selected "From Date".
   */
  const handleFromDateChange = (date) => {
    if (isDateInRentalHistory(date)) {
      setAvailabilityMessage('The car is not available for the selected dates.');
      setFormData((prevState) => ({
        ...prevState,
        fromDate: null,
      }));
    } else {
      setAvailabilityMessage('');
      const minToDate = moment(date).add(1, 'days');  // Add 1 day to the selected "From Date"
      setFormData((prevState) => ({
        ...prevState,
        fromDate: date,
        toDate: prevState.toDate && moment(prevState.toDate).isBefore(minToDate) ? null : prevState.toDate,
        rentalDays: calculateRentalDays(date, formData.toDate),  // Calculate rental days
      }));
    }
  };

  /**
   * Handles changes to the "To Date" field and updates form data accordingly.
   * @function handleToDateChange
   * @param {Date} date - The selected "To Date".
   */
  const handleToDateChange = (date) => {
    if (isDateInRentalHistory(date)) {
      setAvailabilityMessage('The car is not available for the selected dates.');
      setFormData((prevState) => ({
        ...prevState,
        toDate: null,
      }));
    } else {
      setAvailabilityMessage('');
      setFormData((prevState) => ({
        ...prevState,
        toDate: date,
        rentalDays: calculateRentalDays(formData.fromDate, date),  // Calculate rental days
      }));
    }
  };

  /**
   * Calculates the number of rental days between the selected "From Date" and "To Date".
   * @function calculateRentalDays
   * @param {Date} fromDate - The start date of the rental.
   * @param {Date} toDate - The end date of the rental.
   * @returns {number} - The number of rental days.
   */
  const calculateRentalDays = (fromDate, toDate) => {
    if (fromDate && toDate) {
      const from = moment(fromDate);
      const to = moment(toDate);
      const diffDays = to.diff(from, 'days');
      return diffDays > 0 ? diffDays : 1;  // Default to 1 if dates are not set correctly
    }
    return 1;  // Default to 1 if dates are not set
  };

  /**
   * Automatically formats the card number with spaces every 4 digits.
   * @function formatCardNumber
   * @param {string} value - The card number input value.
   * @returns {string} - The formatted card number.
   */
  const formatCardNumber = (value) => {
    const cleanedValue = value.replace(/\D/g, ''); // Remove non-numeric characters
    const formattedValue = cleanedValue.replace(/(.{4})/g, '$1 ').trim(); // Add space after every 4 digits
    return formattedValue;
  };

  /**
   * Handles changes to the card number field and formats the input.
   * @function handleCardNumberChange
   * @param {Object} e - The input change event.
   */
  const handleCardNumberChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatCardNumber(value);
    setFormData((prevState) => ({
      ...prevState,
      cardNumber: formattedValue,
    }));
  };

  /**
   * Calculates the total amount based on the rental days and car price.
   * Takes into account the currency conversion if applicable.
   * @function calculateAmount
   * @returns {number} - The calculated total rental amount.
   */
  const calculateAmount = () => {
    const rentalDays = formData.rentalDays;
    const carPrice = carDetails.oldPrice || carDetails.price;  // Use oldPrice if available, otherwise price
    let amount = rentalDays * carPrice;

    // Convert amount based on the selected currency
    switch (formData.currency) {
      case 'USD':
        amount = amount / 3.8;  // Conversion rate for USD to ILS
        break;
      case 'EUR':
        amount = amount / 4.1;  // Conversion rate for EUR to ILS
        break;
      case 'ILS':
      default:
        // Keep the amount in ILS (no conversion needed)
        break;
    }

    return amount;
  };

  /**
   * Updates the amount whenever rental days, currency, or car details change.
   * @function updateAmount
   */
  useEffect(() => {
    const newAmount = calculateAmount();
    setFormData((prevState) => ({
      ...prevState,
      amount: isNaN(newAmount) ? 0 : newAmount,  // Safeguard against NaN
    }));
  }, [formData.rentalDays, formData.currency, carDetails]);

  /**
   * Restricts the input value for expiry month, year, and CVV fields.
   * Ensures that the value does not exceed the allowed maximum length or value.
   * @function restrictInput
   * @param {Object} e - The input change event.
   * @param {number} maxLength - The maximum allowed length for the input.
   * @param {number} max - The maximum allowed value for the input.
   */
  const restrictInput = (e, maxLength, max) => {
    const value = e.target.value;

    // Block input if value exceeds the maximum allowed length or maximum value
    if (value.length > maxLength || parseInt(value, 10) > max) {
      e.target.value = value.slice(0, -1);  // Remove the last character if invalid
    }
  };

  /**
   * Handles the form submission, checks car availability, and redirects to the invoice page upon success.
   * @async
   * @function handleSubmit
   * @param {Object} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const maskedCardNumber = '**** **** **** ' + formData.cardNumber.slice(-4);

    // Check availability and book the car
    try {
      const response = await axios.post('http://localhost:5000/api/cars/checkAvailabilityAndBook', {
        carId,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
      });

      if (response.status === 200) {
        // Navigate to InvoicePage with the data if available
        navigate('/invoice', {
          state: {
            username: username,
            carName: carName,
            cardNumber: maskedCardNumber,
            cardName: formData.cardName,  // Include name on card
            rentalDays: formData.rentalDays,
            amount: formData.amount,
            paymentDate: formData.paymentDate,
            fromDate: formData.fromDate,  // Include fromDate
            toDate: formData.toDate,      // Include toDate
          },
        });
      }
    } catch (error) {
      console.error('Booking failed:', error);
      setAvailabilityMessage('Car is not available for the selected dates.');
    }
  };

  /**
   * Handles changes to form input fields and updates the state.
   * @function handleInputChange
   * @param {Object} e - The input change event.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="payment-container">
      <div className="payment-background">
        <form className="payment-form" onSubmit={handleSubmit}>
          <h2 className="payment-title">Secure Payment for {carName}</h2>

          <label>Name on Card</label>
          <input
            type="text"
            name="cardName"
            value={formData.cardName}
            onChange={handleInputChange}
            placeholder="Saad Ahmed"
            required
          />

          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 1234 5678"
            maxLength="19"  // Maximum length with spaces is 19 characters
            required
          />

          <div className="expiry-cvv">
            <div className="expiry">
              <label>Expire Month</label>
              <input
                type="number"
                name="expiryMonth"
                value={formData.expiryMonth}
                onInput={(e) => restrictInput(e, 2, 12)}  // Restrict to 1-12
                onChange={handleInputChange}
                placeholder="MM"
                min="1"
                max="12"  // Restrict month to 1-12
                required
              />
              <label>Expire Year</label>
              <input
                type="number"
                name="expiryYear"
                value={formData.expiryYear}
                onInput={(e) => restrictInput(e, 2, 99)}  // Restrict to 24-99
                onChange={handleInputChange}
                placeholder="YY"
                min="24"
                max="99"  // Restrict year to 24-99
                required
              />
            </div>

            <div className="cvv">
              <label>CVV</label>
              <input
                type="number"
                name="cvv"
                value={formData.cvv}
                onInput={(e) => restrictInput(e, 3, 999)}  // Restrict to 1-999
                onChange={handleInputChange}
                placeholder="123"
                max="999"  // Restrict CVV to a max of 999
                required
              />
            </div>
          </div>

          <label>From Date</label>
          <DatePicker
            selected={formData.fromDate}
            onChange={handleFromDateChange}
            minDate={new Date()}  // Disable past dates
            filterDate={filterUnavailableDates}  // Disable unavailable dates
            placeholderText="Select a from date"
            dateFormat="dd/MM/yyyy"
            required
          />

          <label>To Date</label>
          <DatePicker
            selected={formData.toDate}
            onChange={handleToDateChange}
            minDate={formData.fromDate ? moment(formData.fromDate).add(1, 'days').toDate() : null}  // Disable dates before the fromDate
            filterDate={filterUnavailableDates}  // Disable unavailable dates
            placeholderText="Select a to date"
            dateFormat="dd/MM/yyyy"
            required
          />

          <label>Rental Days</label>
          <input
            type="number"
            name="rentalDays"
            value={formData.rentalDays || 1}  // Default to 1 if undefined
            readOnly
          />

          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount || 0}  // Default to 0 if undefined
            readOnly
          />

          <label>Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
          >
            <option value="ILS">ILS</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>

          {availabilityMessage && <p className="error-message">{availabilityMessage}</p>}

          <button type="submit" className="payment-button" disabled={!!availabilityMessage}>
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookMe;
