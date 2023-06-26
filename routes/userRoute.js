const express = require("express");
const { registerUser, authUser } = require("../controllers/userController")
const AuthRouter = express.Router();

AuthRouter.route('/').post(registerUser)
AuthRouter.post('/login', authUser);

module.exports = AuthRouter;