import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import "./MessageInput.css";
import moment from "moment";
import "moment/locale/en-gb";

function ChatMessages() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(""); // State to store the user's name
  const [lastSeen, setLastSeen] = useState(""); // State to store the last seen time
  const { theme } = useContext(ThemeContext); // Use theme context

  useEffect(() => {
    axios
      .get(`https://devapi.beyondchats.com/api/get_chat_messages?chat_id=${id}`)
      .then((response) => {
        console.log("API Response:", response.data); // Log the response to check its structure
        const data = response.data.data || [];
        setMessages(data || []); // Adjust based on the actual API response structure
        if (data.length > 0 && data[0].sender) {
          setUserName(data[0].sender.name || "Unknown User"); // Set the user's name
          calculateLastSeen(data[0].updated_at);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the messages!", error);
        setError("There was an error fetching the messages!");
        setLoading(false);
      });
  }, [id]);

  const calculateLastSeen = (updatedAt) => {
    const updateTime = new Date(updatedAt);
    const currentTime = new Date();
    const timeDifference = Math.floor((currentTime - updateTime) / 1000 / 60); // Difference in minutes

    if (timeDifference < 1) {
      setLastSeen("just now");
    } else if (timeDifference < 60) {
      setLastSeen(`${timeDifference} minutes ago`);
    } else if (timeDifference < 1440) {
      const hours = Math.floor(timeDifference / 60);
      setLastSeen(`${hours} hour${hours > 1 ? "s" : ""} ago`);
    } else {
      const days = Math.floor(timeDifference / 1440);
      setLastSeen(`${days} day${days > 1 ? "s" : ""} ago`);
    }
  };

  const formatTimeDifference = (updatedAt) => {
    const updateTime = new Date(updatedAt);
    const currentTime = new Date();
    const timeDifference = Math.floor((currentTime - updateTime) / 1000 / 60); // Difference in minutes

    if (timeDifference < 1) {
      return "just now";
    } else if (timeDifference < 60) {
      return `${timeDifference} minutes ago`;
    } else if (timeDifference < 1440) {
      const hours = Math.floor(timeDifference / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(timeDifference / 1440);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  const renderMessageContent = (message) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const videoExtensions = ["mp4", "webm", "ogg"];

    const messageParts = message.split(urlRegex).map((part, index) => {
      const isUrl = urlRegex.test(part);
      if (isUrl) {
        const extension = part.split(".").pop();
        if (videoExtensions.includes(extension)) {
          return (
            <video key={index} controls className="message-video">
              <source src={part} type={`video/${extension}`} />
              Your browser does not support the video tag.
            </video>
          );
        }
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
      return part;
    });

    return <p>{messageParts}</p>;
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  if (loading) {
    return <p>Loading messages...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={`content ${theme}`}>
      <div className="content-header">
        <div className="details">
          <h3>{userName}</h3>
          <span>last seen {lastSeen}</span> {/* Display the last seen time */}
        </div>
        <div className="icons">
          <i className="fas fa-phone-alt"></i>
          <i className="fas fa-search"></i>
          <i className="fas fa-ellipsis-v"></i>
        </div>
      </div>
      <div className="chat-messages">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              className={`message ${
                message.sender_id === 1 ? "received" : "sent"
              }`}
              key={message.id}
            >
              <div className="message-head">
                <span
                  className="message-sender"
                  style={{ color: getRandomColor() }}
                >
                  {message.sender.name}
                </span>
                <span className="message-update">
                  {moment(message.updated_at).format("LT")}
                </span>
              </div>
              {renderMessageContent(message.message)}
            </div>
          ))
        ) : (
          <p>No messages available</p>
        )}
      </div>
      <div className="message-box">
        <div className="message-content">
          <i className="far fa-smile"></i>
          <input type="text" placeholder="Message" />
          <i className="fas fa-paperclip"></i>
        </div>
        <div className="micro">
          <i className="fas fa-microphone"></i>
        </div>
      </div>
    </div>
  );
}

export default ChatMessages;
