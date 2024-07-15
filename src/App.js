import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatList from "./components/ChatList";
import ChatMessages from "./components/MessageInput";
import "./App.css";
import { ThemeProvider } from "./components/ThemeContext";
function App() {
  return (
    <Router>
      <div className="app-container">
        <ThemeProvider>
          <ChatList />
          <Routes>
            <Route path="/chat/:id" element={<ChatMessages />} />
            <Route
              path="/"
              element={
                <div className="no-chat-selected">
                  Select a chat to view messages
                </div>
              }
            />
          </Routes>{" "}
        </ThemeProvider>
      </div>
    </Router>
  );
}

export default App;
