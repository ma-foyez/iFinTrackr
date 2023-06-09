const express = require("express");
const { registerUser, authUser, logout, updateUserInformation } = require("../controllers/userController");
const { authenticateToken } = require("../config/generateToken");
const AuthRouter = express.Router();

AuthRouter.route('/').post(registerUser)
AuthRouter.post('/login', authUser);
AuthRouter.route('/').put(authenticateToken, updateUserInformation);
AuthRouter.post("/logout", authenticateToken, logout);
module.exports = AuthRouter;