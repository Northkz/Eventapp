import React, { memo, useRef, useState } from "react";
import ChatBox from "./ChatBox/ChatBox";
import Conversation from "./Conversation/Conversation";
import "./Chat.css";
import { useEffect } from "react";
import { userChats, joinChats, getVenues, createChat } from "../../api/ChatRequests";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import useAuthStore from "../../AuthStore";

const Chat = () => {
  const { token } = useAuthStore(); // import token from AuthStore
  const socket = io("ws://localhost:8800",{transports: ["websocket","polling"],});
  const [error, setError] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userName, setUserName] = useState([]);
  const [email, setEmail] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [msg, setRecv] = useState(null);
  // Get the chat in chat section
  let tmp_user = "";
  const fetchUserInfo = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/user/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user information");
      }

      const user_data = await response.json();

      setEmail(user_data.email);
      setUserName(user_data.name);
      tmp_user = user_data.email;
    } catch (error) {
      setError(error.message);
    }
  };

  const createChatIfNotExists = async (venueId) => {
    try {
      const chatResponse = await createChat(venueId);
      const chat = chatResponse.data;

      await joinChats(tmp_user, venueId);
    } catch (error) {
      console.error(`Error checking chat for venue ${venueId}:`, error);
    }
  };



  const getChats = async () => {
    try {
      const venuesResponse = await getVenues();
      const venues = venuesResponse.data.venues;

      await Promise.all(
        venues.map(async (venue) => {
          await createChatIfNotExists(venue.id);
        })
      );

      const chatData = await userChats(tmp_user);
      setChats(chatData.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserInfo();
      getChats();
    }
  }, [token]);

   // Connect to Socket.io
   useEffect(() => {
    // Connect to Socket.io
    socket.emit("new-user-add", email);
    socket.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  
    // Cleanup function for disconnecting socket when the component unmounts
    return () => {
      console.log("Disconnecting socket");
      socket.disconnect();
    };
  }, [email]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage!==null) {
      socket.emit("send-message", sendMessage);}
  }, [sendMessage]);


  // Get the message from socket server
  socket.on("recieve-message", (data) => {
    setReceivedMessage(data);
    setRecv(data);
  });
  useEffect(() => {

  }, []);

  
  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== email);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };


  if (!token) {
    return <div>Please login to view this page</div>;
  }

  return (
    <div className="Chat">
      <div className="Left-side-chat">
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div key={chat._id} onClick={() => setCurrentChat(chat)}>
                <Conversation data={chat} currentUser={email}  online={checkOnlineStatus(chat)}/>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
        </div>
        <ChatBox
          chat={currentChat}
          currentUser={email}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
          userName = {email}
        />
      </div>
    </div>
  );
};

export default Chat;
