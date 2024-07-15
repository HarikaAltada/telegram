import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ChatList.css";
import Sidebar from "./Sidebar";
import moment from "moment";
import "moment/locale/en-gb";
import { ThemeContext } from "./ThemeContext";

function ChatList() {
  const { theme } = useContext(ThemeContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchChats(currentPage);
  }, [currentPage]);

  const fetchChats = (page) => {
    setLoading(true);
    axios
      .get(`https://devapi.beyondchats.com/api/get_all_chats?page=${page}`)
      .then((response) => {
        console.log("Chats API Response:", response.data);
        // Assuming response.data.data.data is the array of chats
        const normalizedChats = response.data.data.data.map((chat) => ({
          ...chat,
          creator: {
            ...chat.creator,
            name: chat.creator.name || "Harika",
            phone: chat.creator.phone || "8899779068",
          },
        }));
        setChats(normalizedChats);
        setTotalPages(response.data.data.last_page || 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
        setError("Error fetching chats. Please try again later.");
        setLoading(false);
      });
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading && chats.length === 0) {
    return <p>Loading chats...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <aside className={`right-side ${theme}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={`header-container ${theme}`}>
        <div className="header">
          <div className="toggle-button" onClick={() => setIsSidebarOpen(true)}>
            <i className="fas fa-bars"></i>
          </div>
          <div className={`search-box ${theme}`}>
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search..." />
          </div>
        </div>
      </div>
      <div className={`chat-list-container ${theme}`}>
        <div className="chat-list">
          {chats.length > 0 ? (
            <>
              {chats.map((chat) => (
                <Link to={`/chat/${chat.id}`} key={chat.id}>
                  <div className={`chat-box ${theme}`}>
                    <div className="chat-details">
                      <div className="chat-title">
                        <h3>{chat.creator.name}</h3>
                        <span>{moment(chat.created_at).format("LT")}</span>
                      </div>
                      <div className="chat-msg">
                        <p>{chat.creator.phone}</p>
                        <span>{chat.msg_count}</span>
                      </div>
                    </div>
                    <div className="pen">
                      <i className="fas fa-pen"></i>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </>
          ) : (
            <p>No chats available</p>
          )}
        </div>
      </div>
    </aside>
  );
}

export default ChatList;
