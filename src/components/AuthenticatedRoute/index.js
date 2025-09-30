import { useAuth } from "context/authContext";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * AuthenticatedRoute component
 * Redirects authenticated users away from auth pages (sign-in, sign-up)
 * Used to prevent logged-in users from accessing authentication pages
 */
const AuthenticatedRoute = ({ children }) => {
  const { user } = useAuth();

  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is not authenticated, allow access to auth pages
  return children;
};

AuthenticatedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthenticatedRoute;
