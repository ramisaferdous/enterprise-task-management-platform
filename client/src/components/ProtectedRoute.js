import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ roles, ...rest }) => {
  const { user } = useAuth();
  const ok = !!user && (!roles || roles.includes(user.role));
  return ok ? <Route {...rest} /> : <Redirect to="/login" />;
};

export default ProtectedRoute;
