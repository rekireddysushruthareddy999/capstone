import { useAuth } from "../store/authStore";
import {
  Navigate,
  useLocation,
} from "react-router";

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const isAuthenticated = useAuth(
    (state) => state.isAuthenticated
  );

  const location = useLocation();

  // NOT LOGGED IN
  if (!isAuthenticated || !currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // ROLE NOT ALLOWED
  if (
    allowedRoles &&
    !allowedRoles.includes(
      currentUser.role
    )
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  // ACCESS GRANTED
  return children;
}

export default ProtectedRoute;