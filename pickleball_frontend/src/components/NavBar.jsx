import React from "react";
import { Link, NavLink } from "react-router-dom";
import { GiTennisRacket } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { isAuthenticated, user, role, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <span className="brand-icon">
          <GiTennisRacket aria-hidden="true" />
        </span>
        <span className="brand-text">PicklePlay</span>
      </Link>

      <div className="nav-links">
        <NavLink to="/courts" className={({ isActive }) => (isActive ? "active" : "")}>
          Courts
        </NavLink>
        <NavLink to="/book" className={({ isActive }) => (isActive ? "active" : "")}>
          Book
        </NavLink>
        {isAuthenticated && (
          <NavLink
            to="/my-bookings"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            My Bookings
          </NavLink>
        )}
        {role === "admin" && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
            Admin
          </NavLink>
        )}
      </div>

      <div className="nav-actions">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-accent">
              Sign Up
            </Link>
          </>
        ) : (
          <div className="user-chip">
            <span className="avatar">{(user?.name || user?.email || "U")[0].toUpperCase()}</span>
            <span className="user-info">
              <strong>{user?.name || user?.email}</strong>
              <small className="role-tag">{role}</small>
            </span>
            <button className="btn btn-outline" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
