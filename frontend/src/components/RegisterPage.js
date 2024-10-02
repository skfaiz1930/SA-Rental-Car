import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/RegisterPage.css';

/**
 * RegisterPage component handles the registration process for both customers and admins.
 * It provides options to switch between customer and admin registration, collects user information,
 * and submits the data to the appropriate API endpoint based on the registration type.
 *
 * @component
 * @returns {JSX.Element} - The rendered RegisterPage component.
 */
const RegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State to track registration type (customer or admin) and form inputs
  const [registerType, setRegisterType] = useState('customer');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * useEffect hook to detect the current path and set the registration type accordingly.
   * Logs the current path for debugging purposes.
   */
  useEffect(() => {
    console.log('Current path:', location.pathname); // Debugging: Log the current path
    if (location.pathname === '/signin/customerRegister') {
      setRegisterType('customer');
    } else if (location.pathname === '/signin/adminRegister') {
      setRegisterType('admin');
    }
  }, [location.pathname]);

  /**
   * handleRegisterTypeChange function updates the registration type and navigates to the appropriate route.
   *
   * @param {string} type - The selected registration type ('customer' or 'admin').
   */
  const handleRegisterTypeChange = (type) => {
    console.log('Button clicked:', type); // Debugging: Log which button was clicked
    setRegisterType(type);
    if (type === 'customer') {
      navigate('/signin/customerRegister'); // Navigate to customer registration
    } else if (type === 'admin') {
      navigate('/signin/adminRegister'); // Navigate to admin registration
    }
  };

  /**
   * handleRegister function submits the registration form to the appropriate API endpoint.
   * Sends the username, email, and password for customers, and also sends the employee ID for admins.
   *
   * @async
   * @param {Object} e - The form submission event.
   */
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Set the appropriate API endpoint based on registration type
    const endpoint = registerType === 'customer' 
      ? '/api/customer/customerRegister' 
      : '/api/customer/adminRegister';

    // Prepare the request body based on registration type
    const body = registerType === 'customer' 
      ? { username, email, password }
      : { username, email, password, employeeid: employeeId }; // Corrected key name

    console.log('Sending request to:', endpoint);
    console.log('Request body:', body);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuccess('Registration successful!');
      console.log('Registration successful:', data);
    } catch (error) {
      setError(`Error during registration: ${error.message}`);
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="register-page">
      <h1>Register</h1>
      <div className="register-options">
        <button
          onClick={() => handleRegisterTypeChange('customer')}
          className={registerType === 'customer' ? 'active' : ''}
        >
          Customer Registration
        </button>
        <button
          onClick={() => handleRegisterTypeChange('admin')}
          className={registerType === 'admin' ? 'active' : ''}
        >
          Admin Registration
        </button>
      </div>

      <form className="register-form" onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {registerType === 'admin' && (
          <div>
            <label>Employee ID:</label>
            <input 
              type="text" 
              name="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>
        )}
        <button type="submit">Register</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default RegisterPage;
