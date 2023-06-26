const asyncHandler = require("express-async-handler");
const res = require("express/lib/response");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
    const { name, mobile, password, pic } = req.body;

    if (!name || !mobile || !password) {
        res.status(400);
        throw new Error("Please enter all fields");
    }

    const userExits = await User.findOne({ mobile });

    if (userExits) {
        res.status(400);
        throw new Error("You have already an account. Please try to login!");
    }

    const user = await User.create({
        name,
        mobile,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            status: 201,
            message: "You have been successfully create new account",
            data: {
                _id: user._id,
                name: user.name,
                email: user.mobile,
                pic: user.pic,
                token: generateToken(user._id),
            }

        });
    } else {
        res.status(400);
        throw new Error("Failed to create new user");
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });

    if (user && (await user.matchPassword(password))) {
        res.status(201).json({
            status: 201,
            message: "Login successfully.",
            data: {
                _id: user._id,
                name: user.name,
                mobile: user.mobile,
                pic: user.pic,
                access_token: generateToken(user._id),
            }
        });
    } else {
        res.status(400);
        throw new Error("Mobile or Password do not match!");
    }
})

module.exports = { registerUser, authUser }