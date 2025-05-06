import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    const trimmedInput = userInput.trim();
    if (!trimmedInput) return;

    const newMessages = [...messages, { sender: "user", text: trimmedInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const response = await axios.post(
        "http://localhost:5005/webhooks/rest/webhook",
        {
          sender: "user123",
          message: trimmedInput,
        }
      );

      const botReplies = response.data.map((msg) => ({
        sender: "bot",
        text: msg.text || "[No response]",
      }));
      const botCombinedText = botReplies
        .map((msg) => msg.text)
        .filter(Boolean)
        .join("\n\n");

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botCombinedText || "[No response]" },
      ]);
    } catch (error) {
      console.error("Error communicating with Rasa:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Oi, Mate! I'm having trouble processing your request.",
        },
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition cursor-pointer"
      >
        {isOpen ? "Close Chat" : "Chat with Mate"}
      </button>

      {/* Chatbox */}
      {isOpen && (
        <div
          className={`${
            isFullScreen
              ? "fixed top-0 left-0 w-screen h-screen"
              : "w-80 h-[500px]"
          } bg-white border border-gray-300 rounded-xl shadow-lg flex flex-col transition-all duration-300`}
        >
          {/* Header with maximize button */}
          <div className="flex justify-between items-center p-3 bg-red-500 rounded-t-xl">
            <span className=" text-white font-semibold">Your Abroadmate</span>
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="text-red-500 bg-white hover:bg-gray-100 px-2 py-1 rounded-md text-sm font-normal cursor-pointer"
            >
              {isFullScreen ? "Restore" : "Maximize"}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-100">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`inline-block max-w-xs px-4 py-2 rounded-2xl text-sm shadow break-words ${
                    msg.sender === "user"
                      ? "ml-auto bg-red-500 text-white rounded-br-none"
                      : "mr-auto bg-white text-gray-800 rounded-bl-none"
                  }`}
                >
                  <div className="prose prose-sm max-w-full">
                    <ReactMarkdown>
                      {msg.sender === "user"
                        ? `**You:** ${msg.text}`
                        : `**Mate:** ${msg.text}`}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center p-3 border-t border-gray-200">
            <input
              className="text-black flex-grow px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 mr-2"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="px-3 py-2 bg-red-500 text-white rounded-[25%] hover:bg-red-600 cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
