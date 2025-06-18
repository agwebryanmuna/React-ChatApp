import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { userId } = jwt.verify(token, process.env.CHAT_APP_SECRET);
    const user = await User.findById(userId).select("-password");
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};
