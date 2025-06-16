import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

// get all users except the logged in user
export const getUsers = async (req, res) => {
  try {
    const { _id: userId } = req.body.user;

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
    const { _id: currentUserId } = req.body.user;

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

// mark message as seen 3-28-13
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
