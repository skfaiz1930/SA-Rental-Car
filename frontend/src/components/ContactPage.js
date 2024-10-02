import React from 'react';
import '../css/ContactPage.css';

/**
 * ContactPage component renders the contact information for SA Rental Car.
 * It includes the company's address, phone number, and email address.
 * The component also features a footer with copyright information.
 *
 * @component
 * @returns {JSX.Element} - The rendered ContactPage component.
 */
const ContactPage = () => {
  return (
    <div className="contact-page">
      <main>
        <section className="contact-section">
          <h2>Contact Us</h2>
          <p>For any inquiries, please contact us at:</p>
          <p>SA Rental Car</p>
          <p>Haifa Check-Post</p>
          <p>City, State ZIP</p>
          <p>
            Phone: <a href="tel:+0556613920">055-661-3920</a>
          </p>
          <p>
            Email: <a href="mailto:saad.amaria@gmail.com">saad.amaria@gmail.com</a>
          </p>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 SA Rental Car. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ContactPage;
