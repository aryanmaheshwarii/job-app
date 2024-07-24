const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../middleware/error");
const User = require("../models/userSchema");
const sendToken = require("../utils/jwtToken");
const errorHandler = ErrorHandler.ErrorHandler;

// 3 methods --> user registration, user login, user logout..

// ise m ek middleware m dalunga jo async error ko handle karega ...
const register = catchAsyncError(async (req, res, next) => {
    const { name, email, phone, role, password } = req.body;
    if (!name || !email || !phone || !role || !password) {
        return next(new errorHandler("please provide all details"))
    }
    const isEmail = await User.findOne({ email });
    if (isEmail) {
        return next(new errorHandler("email alreday exits!!"))
    }
    const user = await User.create({
        name,
        email,
        phone,
        role,
        password
    })
    sendToken(user, 200, res, "user registered successfully !!")
})


// login
const login = catchAsyncError(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(new errorHandler("please provide all details", 400))
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new errorHandler("invalid email or password", 400))
    }
    const isPassword = await user.comparePass(password);
    if (!isPassword) {
        return next(new errorHandler("invalid email or password", 400))
    }
    if (user.role !== role) {
        return next(new errorHandler("user with this role not found!", 400))
    }
    sendToken(user, 200, res, "user loggedIn successFully !!")
})


// logout
const logout = catchAsyncError(async (req, res, next) => {
    res.status(201).cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "User logged Out Successfully!"
    });
})

// get user
const getUser = catchAsyncError((req, res, next) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
  });

module.exports = { register, login, logout, getUser };