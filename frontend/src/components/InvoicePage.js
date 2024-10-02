import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/InvoicePage.css'; // Link to the CSS file

/**
 * InvoicePage component displays an invoice after a user completes a car rental purchase.
 * It allows users to print the invoice, send it via email, and navigate to the feedback page.
 * The component receives invoice details such as the username, card number, amount, and rental days via React Router's location state.
 *
 * @component
 * @returns {JSX.Element} - The rendered InvoicePage component.
 */
const InvoicePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { username, cardNumber, amount, rentalDays } = location.state || {}; // Destructure the values passed through the state

  // Get the current date and format it as DD/MM/YYYY
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  /**
   * handleFeedbackNavigation function navigates the user to the feedback page.
   * It passes the username to the feedback page through React Router's state.
   */
  const handleFeedbackNavigation = () => {
    navigate('/feedback', { state: { username } });
  };

  /**
   * handleSendEmail function sends the invoice details to the backend to trigger an email.
   * The email is sent to the user's email address, which is fetched from the backend using the username.
   * If the email is sent successfully, an alert is shown. If an error occurs, an error message is displayed.
   *
   * @async
   * @function handleSendEmail
   */
  const handleSendEmail = async () => {
    try {
      await axios.post('http://localhost:5000/api/customer/sendInvoiceEmail', {
        username, // Only send the username, backend fetches the email
        amount,
        rentalDays,
        cardNumber,
        paymentDate: currentDate,
      });
      alert('Invoice email sent successfully!'); // Success message
    } catch (error) {
      console.error('Error sending invoice email:', error);
      alert('Failed to send invoice email.'); // Error message
    }
  };

  return (
    <>
      <div className="invoice-container">
        <div className="invoice-header">
          <h1>Invoice</h1>
          <p>Thank you for your purchase!</p>
        </div>

        <div className="invoice-content" id="print-section">
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Card Number:</strong> {cardNumber}</p>
          <p><strong>Amount:</strong> ${amount}</p>
          <p><strong>Rental Days:</strong> {rentalDays} days</p>
          <p><strong>Payment Date:</strong> {currentDate}</p>
          <br />
          <p>WE HOPE TO SEE YOU AGAIN</p>
        </div>

        {/* Horizontal buttons for printing and sending email */}
        <div className="invoice-buttons">
          <button className="print-button" onClick={() => window.print()}>Print</button>
          <button className="email-button" onClick={handleSendEmail}>Send Invoice via Email</button>
        </div>

        <div className="invoice-footer">
          <button className="button" onClick={handleFeedbackNavigation}>Leave Feedback</button>
        </div>
      </div>
      <footer>
        <p>&copy; 2024 SA Rental Car. All rights reserved.</p>
      </footer>
    </>
  );
};

export default InvoicePage;
