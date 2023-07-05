// const express = require("express");
// const { createProfile, getProfileList, getProfileDetails, updateProfile, deleteProfile } = require("../controllers/peopleController");
// const ProfileRoute = express.Router();

// ProfileRoute.route('/create-profile').post(createProfile)
// ProfileRoute.route('/update-profile').put(updateProfile);
// ProfileRoute.route('/profile-list').get(getProfileList);
// ProfileRoute.route('/profile-details/:id').get(getProfileDetails);
// ProfileRoute.route('/delete-profile/:id').delete(deleteProfile);

// module.exports = ProfileRoute;

const express = require("express");
const { createProfile, getProfileList, getProfileDetails, updateProfile, deleteProfile } = require("../controllers/peopleController");
const { authenticateToken } = require("../config/generateToken");
// const { authenticateToken } = require("../middleware/authenticateToken");
const ProfileRoute = express.Router();

// Apply authenticateToken middleware to protect routes
ProfileRoute.route('/create-profile').post(authenticateToken, createProfile);
ProfileRoute.route('/update-profile').put(authenticateToken, updateProfile);
ProfileRoute.route('/profile-list').get(authenticateToken, getProfileList);
ProfileRoute.route('/profile-details/:id').get(authenticateToken, getProfileDetails);
ProfileRoute.route('/delete-profile/:id').delete(authenticateToken, deleteProfile);

module.exports = ProfileRoute;
