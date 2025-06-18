import { useEffect, useRef } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { useState } from "react";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef(); // Automatically references the div with ref="scrollEnd"

  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (input.trim() === "") return;

    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // handle sending an image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = ""; // Reset the input field after sending
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages.length > 0) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* ***********  Header Start */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profileImage || assets.avatar_icon}
          alt="Profile image"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}{" "}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="size-2 bg-green-500 rounded-full"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="arrow icon"
          className="md:hidden max-w-7"
        />
        <img
          src={assets.help_icon}
          alt="Help icon"
          className="max-md:hidden max-w-5"
        />
      </div>
      {/* ***********  Header end */}

      {/* ***********  chat Start */}

      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              message.senderId !== authUser._id && "flex-row-reverse"
            }`}
          >
            {message.image ? (
              <img
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                src={message.image}
                alt="message image"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  message.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {message.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  message.senderId === authUser._id
                    ? authUser?.profileImage || assets.avatar_icon
                    : selectedUser?.profileImage || assets.avatar_icon
                }
                alt="Profile image"
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">
                {formatMessageTime(message.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* ***********  chat end */}

      {/* ***********  bottom Start */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="Attach icon"
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt="send button"
          className="w-7 cursor-pointer"
        />
      </div>

      {/* ***********  bottom end */}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="Logo icon" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
