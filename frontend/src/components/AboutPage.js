import React, { useState, useEffect } from 'react';
import '../css/AboutPage.css';

/**
 * AboutPage component represents the "About Us" page for SA Rental Car.
 * It fetches and displays high-rated customer feedback, along with company information.
 * The feedback is rotated automatically every 5 seconds to highlight different reviews.
 *
 * @component
 * @returns {JSX.Element} - The rendered AboutPage component.
 */
const AboutPage = () => {

  /**
   * State to store customer feedback fetched from the backend.
   * @type {Array} feedback - An array of feedback objects from the server.
   * @type {function} setFeedback - Updates the feedback state.
   */
  const [feedback, setFeedback] = useState([]);

  /**
   * State to track which feedback is currently displayed.
   * @type {number} currentFeedbackIndex - The index of the currently displayed feedback.
   * @type {function} setCurrentFeedbackIndex - Updates the feedback index.
   */
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

  /**
   * Fetches customer feedback with a rating of 4 or higher from the backend.
   * Runs once when the component mounts.
   *
   * @async
   * @function fetchFeedback
   * @returns {void}
   */
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/customer/feedback/highRatings');
        const data = await response.json();
        setFeedback(data.feedback);
      } catch (error) {
        console.error('Error fetching high-rating feedback:', error);
      }
    };

    fetchFeedback();
  }, []);

  /**
   * Automatically rotates through feedback every 5 seconds.
   * Updates the currentFeedbackIndex state to display the next feedback.
   * Also adds and removes the 'active' class for smooth transitions.
   *
   * @returns {void}
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeedbackIndex((prevIndex) => (prevIndex + 1) % feedback.length);

      const testimonialElement = document.querySelector('.testimonial');
      if (testimonialElement) {
        testimonialElement.classList.remove('active');
        setTimeout(() => {
          testimonialElement.classList.add('active');
        }, 10); // Small delay to trigger animation
      }
    }, 5000);

    return () => clearInterval(interval);  // Clean up interval when component unmounts
  }, [feedback]);

  return (
    <>
      <div className="about-page">
        <h1>About Us</h1>
        <p>We are SA Rental Car, providing top-notch car rental services since 2024.</p>
        <p>
          SA Rental Car is a leading car rental service dedicated to providing our customers with the best possible experience.
          With a commitment to quality and customer satisfaction, we strive to make your journey as smooth as possible.
        </p>
        <a href="#learn-more">Learn More</a>

        <h2>Why Choose Us</h2>
        <ul>
          <li>Wide selection of vehicles</li>
          <li>Flexible rental options</li>
          <li>Competitive pricing</li>
          <li>24/7 customer support</li>
          <li>Convenient booking process</li>
        </ul>

        {/* Display rotating feedback */}
        {feedback.length > 0 && (
          <div className="testimonial active">
            <h3>{feedback[currentFeedbackIndex].name}</h3>
            <p>Rating: {feedback[currentFeedbackIndex].rating}/5</p>
            <p>Suggestion: {feedback[currentFeedbackIndex].feedbackText}</p>
          </div>
        )}

        {/* Message when no feedback with rating of 4 or higher is available */}
        {feedback.length === 0 && (
          <p>No feedback available with a rating of 4 or higher.</p>
        )}
      </div>
      <footer>
        <p>&copy; 2024 SA Rental Car. All rights reserved.</p>
      </footer>
    </>
  );
};

export default AboutPage;
