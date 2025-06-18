import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.CHAT_APP_SECRET);

// Signup a new user
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, bio } = req.body;

    if (!fullName || !email || !password || !bio)
      return res
        .status(400)
        .json({ success: false, message: "Missing Details" });

    const user = await User.findOne({ email });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Account already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = createToken(newUser._id);

    res.status(201).json({
      success: true,
      userData: newUser,
      message: "Account created successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });

    const isPassword = await bcrypt.compare(password, userData.password);

    if (!isPassword)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = createToken(userData._id);

    res
      .status(200)
      .json({ success: true, userData, token, message: "Login successful" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// check if user is authenticated
export const checkAuth = (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

// Update user profile details
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const { _id: userId } = req.user;
    let updateUser;

    if (!profilePic) {
      updateUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updateUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    res.status(200).json({ success: true, user: updateUser });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};
