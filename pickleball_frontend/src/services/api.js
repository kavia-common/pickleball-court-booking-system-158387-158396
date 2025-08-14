import axios from "axios";

/**
 * API service configured with base URL from environment variables.
 * Uses localStorage token for Authorization header when available.
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pb_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simple response error normalization
function normalizeError(error) {
  if (error.response?.data?.detail) return error.response.data.detail;
  if (error.response?.data?.message) return error.response.data.message;
  if (typeof error.message === "string") return error.message;
  return "Unexpected error";
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the configured API base URL. */
  return API_BASE_URL;
}

// PUBLIC_INTERFACE
export function setAuthToken(token) {
  /** Sets auth token and stores it for subsequent requests. */
  if (token) localStorage.setItem("pb_token", token);
}

// PUBLIC_INTERFACE
export function clearAuthToken() {
  /** Clears auth token from storage. */
  localStorage.removeItem("pb_token");
}

const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    adminLogin: "/auth/admin/login",
  },
  courts: "/courts",
  bookings: "/bookings",
  myBookings: "/bookings/my",
};

// PUBLIC_INTERFACE
export async function login({ email, password, role = "user" }) {
  /** Authenticates a user or admin and returns { token, user }. */
  try {
    const url = role === "admin" ? endpoints.auth.adminLogin : endpoints.auth.login;
    const { data } = await api.post(url, { email, password, role });
    const token =
      data?.access_token || data?.token || data?.jwt || data?.data?.token || null;
    const user =
      data?.user || data?.profile || data?.data?.user || { email, role };
    if (token) setAuthToken(token);
    return { token, user };
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

// PUBLIC_INTERFACE
export async function register({ name, email, password, role = "user" }) {
  /** Registers a new account and returns { token, user }. */
  try {
    const { data } = await api.post(endpoints.auth.register, {
      name,
      email,
      password,
      role,
    });
    const token =
      data?.access_token || data?.token || data?.jwt || data?.data?.token || null;
    const user =
      data?.user || data?.profile || data?.data?.user || { name, email, role };
    if (token) setAuthToken(token);
    return { token, user };
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

// PUBLIC_INTERFACE
export async function listCourts() {
  /** Fetches all courts. */
  try {
    const { data } = await api.get(endpoints.courts);
    return Array.isArray(data) ? data : data?.items || [];
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

// PUBLIC_INTERFACE
export async function createCourt({ name, location = "", surface = "hard" }) {
  /** Creates a court (admin). */
  try {
    const { data } = await api.post(endpoints.courts, { name, location, surface });
    return data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

// PUBLIC_INTERFACE
export async function createBooking({
  court_id,
  date,
  time,
  group_size,
  notes = "",
}) {
  /** Creates a booking; returns booking details. */
  try {
    const { data } = await api.post(endpoints.bookings, {
      court_id,
      date,
      time,
      group_size,
      notes,
    });
    return data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

// PUBLIC_INTERFACE
export async function myBookings() {
  /** Returns bookings for current user. */
  try {
    const { data } = await api.get(endpoints.myBookings);
    return Array.isArray(data) ? data : data?.items || [];
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

// PUBLIC_INTERFACE
export async function listAllBookings() {
  /** Returns all bookings (admin). */
  try {
    const { data } = await api.get(endpoints.bookings);
    return Array.isArray(data) ? data : data?.items || [];
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export default api;
