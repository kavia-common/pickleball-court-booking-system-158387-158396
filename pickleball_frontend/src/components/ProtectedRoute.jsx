import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute guards nested routes.
 * Usage:
 * <Route element={<ProtectedRoute />}> ... </Route>
 * <Route element={<ProtectedRoute requireAdmin />}> ... </Route>
 */

// PUBLIC_INTERFACE
export default function ProtectedRoute({ requireAdmin = false, redirectTo = "/login" }) {
  /** Wraps child routes and redirects if unauthorized or non-admin. */
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
  if (requireAdmin && role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}
