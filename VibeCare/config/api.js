// reactnative/config/api.js

// Environment-based configuration
const development = {
  API_BASE_URL: `http://192.168.18.65:3000`,
  JWT_SECRET: 'your_jwt_secret',
  MONGO_URL: 'mongodb+srv://VibeCare:VibeCare67@cluster0.1rleb9o.mongodb.net/new_db?retryWrites=true&w=majority',
  EMAIL_USER: 'vibecare67@gmail.com',
  EMAIL_PASS: 'dmuo xfwq mxhl nzpq'
};

const production = {
  API_BASE_URL: 'https://your-production-domain.com',
  JWT_SECRET: process.env.JWT_SECRET || 'your_production_jwt_secret',
  MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://production-connection-string',
  EMAIL_USER: process.env.EMAIL_USER || 'production-email@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'production-email-password'
};

// Determine environment (for React Native frontend)
const isDevelopment = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

// Select appropriate config
const config = isDevelopment ? development : production;

// Export all constants
module.exports = {
  API_BASE_URL: config.API_BASE_URL,
  JWT_SECRET: config.JWT_SECRET,
  MONGO_URL: config.MONGO_URL,
  EMAIL_USER: config.EMAIL_USER,
  EMAIL_PASS: config.EMAIL_PASS,
  IS_DEVELOPMENT: isDevelopment
};

// Also export individual constants for easier importing
module.exports.API_BASE_URL = config.API_BASE_URL;
module.exports.JWT_SECRET = config.JWT_SECRET;
module.exports.MONGO_URL = config.MONGO_URL;
module.exports.EMAIL_USER = config.EMAIL_USER;
module.exports.EMAIL_PASS = config.EMAIL_PASS;