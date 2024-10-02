import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

/**
 * Layout component renders the navigation bar and wraps the main content with React Router's Outlet.
 * The AppBar includes navigation links to Home, Contact, About, and Services, as well as a login/logout button based on the user's authentication status.
 *
 * @component
 * @param {boolean} isLoggedIn - Indicates if the user is logged in.
 * @param {function} setIsLoggedIn - Function to update the user's login status.
 * @returns {JSX.Element} - The rendered Layout component with navigation and an outlet for child components.
 */
const Layout = ({ isLoggedIn, setIsLoggedIn }) => {
  /**
   * handleLogout function prompts the user for confirmation and logs them out by updating the `isLoggedIn` state.
   */
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      setIsLoggedIn(false); // Set login status to false upon confirmation
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#2c3e50' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SA Rental Car
          </Typography>
          <Box>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
              <Button color="inherit">Home</Button>
            </Link>
            <Link to="/contact" style={{ textDecoration: 'none', color: 'white' }}>
              <Button color="inherit">Contact</Button>
            </Link>
            <Link to="/about" style={{ textDecoration: 'none', color: 'white' }}>
              <Button color="inherit">About</Button>
            </Link>
            <Link to="/services" style={{ textDecoration: 'none', color: 'white' }}>
              <Button color="inherit">Services</Button>
            </Link>

            {isLoggedIn ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Link to="/signin" style={{ textDecoration: 'none', color: 'white' }}>
                <Button color="inherit">Sign In</Button>
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Renders child routes */}
      <Outlet />
    </>
  );
};

export default Layout;
