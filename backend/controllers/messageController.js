import cloudinary from "../config/cloudinary.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { io, userSocketMap } from "../server.js";

// get all users except the logged in user
export const getUsers = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    // get all users except current logged in user
    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    // count number of messages not seen
    const unseenMessages = {};

    for (const user of users) {
      const count = await Message.countDocuments({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      unseenMessages[user._id] = count;
    }
    /*
    const promises = users.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);*/

    res.status(200).json({
      success: true,
      users,
      unseenMessages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const { _id: currentUserId } = req.user;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: currentUserId },
      ],
    });
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: currentUserId },
      { seen: true }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// mark message as seen
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const { _id: senderId } = req.user;

    let imageUrl;
    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    const newMessage = await Message.create({
      text,
      image: imageUrl,
      senderId,
      receiverId,
    });

    // Emit the new message to the receiver's socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ success: true, newMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
