// client/src/components/ProtectedRoute.js
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ component: Cmp, roles, ...rest }) {
  const { user } = useAuth();
  const authed = !!user;
  const roleOk = !roles || (user && roles.includes(user.role));

  return (
    <Route
      {...rest}
      render={(props) =>
        authed && roleOk ? <Cmp {...props} /> : <Redirect to="/login" />
      }
    />
  );
}
