// reactnative/config/api.js

// Development (local backend)
const development = {
  API_BASE_URL: "http://192.168.18.65:3000", // Local IP for mobile devices
};

// Production (deployed backend, e.g., Render)
const production = {
  API_BASE_URL: "https://backend-vibecare.onrender.com", // Replace with your Render backend URL
};

// Detect environment (React Native provides __DEV__)
const isDevelopment =
  typeof __DEV__ !== "undefined" ? __DEV__ : process.env.NODE_ENV !== "production";

// Select correct config
const config = isDevelopment ? development : production;

// Export
export const API_BASE_URL = config.API_BASE_URL;
export const IS_DEVELOPMENT = isDevelopment;
