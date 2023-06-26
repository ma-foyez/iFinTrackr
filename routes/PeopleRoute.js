const express = require("express");
const { createProfile, getProfileList, getProfileDetails, updateProfile, deleteProfile } = require("../controllers/peopleController");
const ProfileRoute = express.Router();

ProfileRoute.route('/create-profile').post(createProfile)
ProfileRoute.route('/update-profile').put(updateProfile);
ProfileRoute.route('/profile-list').get(getProfileList);
ProfileRoute.route('/profile-details/:id').get(getProfileDetails);
ProfileRoute.route('/delete-profile/:id').delete(deleteProfile);

module.exports = ProfileRoute;