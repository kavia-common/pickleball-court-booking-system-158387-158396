import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courts from "./pages/Courts";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// PUBLIC_INTERFACE
function App() {
  /** Main app routing and shared layout. */
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/courts" element={<Courts />} />
        <Route path="/book" element={<Booking />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
