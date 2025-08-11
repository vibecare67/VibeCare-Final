const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');

// Application configuration
const app = express();
app.use(express.json()); // JSON body parsing
app.use(cors());

// Constants
const JWT_SECRET = 'your_jwt_secret'; 
const MONGO_URL = "mongodb+srv://MalkanArooj:admin@cluster0.wsssc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const EMAIL_USER = "itxmalkii2003@gmail.com";
const EMAIL_PASS = "prac pdgh cllg qahv"; // email credentials



const optionSchema = new mongoose.Schema({
    label: String,
    personality: String
  });
  
  const imageSchema = new mongoose.Schema({
    imageUrl: String,
    options: [optionSchema]
  });
  
  module.exports = mongoose.model('Image', imageSchema);