const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return null; // Return null when the token is missing
  }

  try {
    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findById(decode.id).select('-password');

    return user || null; // Return the user object if found, otherwise null
  } catch (error) {
    console.error('Error decoding token:', error);
    return null; // Return null if the token is invalid or an error occurred
  }
};

module.exports = getUserDetailsFromToken;
