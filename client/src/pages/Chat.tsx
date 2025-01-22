import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { BASEURL, createSocketConnection } from "../helper/constant";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import axios from "axios";

const Chat = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { id } = useParams(); // Extract chat room ID from the route
  const [messages, setMessages] = useState<
    { firstName: string; text: string }[]
  >([]); // State to store chat messages
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((state: RootState) => state.user);
  //@ts-expect-error
  const userId = user?._id;

  // Socket reference to ensure a single instance
  const socketRef = useRef<any>(null);

  const fetchChatMessages = async () => {
    const chat = await axios.get(`${BASEURL}/chat/${id}`, {
      withCredentials: true,
    });

    const chatMessages = chat?.data?.messages.map((msg: any) => {
      return {
        firstName: msg?.senderId?.firstName,
        text: msg?.text,
      };
    });

    setMessages((prev) => [...prev, ...chatMessages]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchChatMessages();
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Emit the message to the server
    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      id,
      text: newMessage,
    });

    // Clear the input field
    setNewMessage("");
  };

  useEffect(() => {
    if (!userId) return;

    // Create or reuse socket connection
    const socket = socketRef.current || createSocketConnection();
    socketRef.current = socket;

    // Join the chat room
    socket.emit("joinChat", { userId, id });

    // Listen for incoming messages
    socket.on(
      "messageReceived",
      ({ firstName, text }: { firstName: string; text: string }) => {
        setMessages((prevMessages) => [...prevMessages, { firstName, text }]);
      }
    );

    return () => {
      // Disconnect socket on cleanup
      socket.disconnect();
    };
  }, [userId, id]);

  return (
    <div className="flex flex-col h-screen bg-base-100">
      {/* Chat Header */}
      <div className="bg-base-100 p-4 text-white text-center shadow">
        <h1 className="text-2xl font-bold">Chat Room</h1>
      </div>

      {/* Chat Messages */}
      {/* Chat Messages */}
      <div className="overflow-y-auto p-4 bg-base-200 h-[73%]">
        {messages.length === 0 ? (
          <p className="text-center text-white">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.firstName === user.firstName
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  msg.firstName === user.firstName
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
                style={{
                  maxWidth: "70%",
                  wordBreak: "break-word", // Wrap words
                  overflowWrap: "break-word", // Handle long words or URLs
                }}
              >
                <p className="text-sm ">{msg.firstName}</p>
                <strong className="text-sm">{msg.text}</strong>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Chat Input */}
      <div className="bg-bas-100 flex items-center p-4 shadow">
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-3 rounded-r-md hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
