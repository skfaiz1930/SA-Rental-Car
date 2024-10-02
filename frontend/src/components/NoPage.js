import React from 'react';

/**
 * NoPage component is a simple functional component that renders a 404 error message.
 * It is displayed when the user navigates to a non-existent route.
 *
 * @component
 * @returns {JSX.Element} - A 404 error page indicating that the requested page was not found.
 */
const NoPage = () => {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
    </div>
  );
}

export default NoPage;
