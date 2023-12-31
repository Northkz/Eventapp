import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { addMessage, getMessages } from "../../../api/MessageRequests";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from 'react-input-emoji'

const ChatBox = ({ chat, currentUser, setSendMessage,  receivedMessage, userName}) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");



  // Receive Message from parent component
  useEffect(()=> {
    if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
      setMessages([...messages, receivedMessage]);
    }

  },[receivedMessage])

  const handleChange = (newMessage)=> {
    setNewMessage(newMessage)
  }

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);


  // Always scroll to last Message
  useEffect(()=> {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  },[messages])



  // Send Message
  const handleSend = async(e)=> {
    e.preventDefault()
    const message = {
      senderId : currentUser,
      text: newMessage,
      chatId: chat._id,
  }

  const receiverId = chat.members.filter(userId => userId !== currentUser);
  // send message to socket server
  setSendMessage({...message, receiverId})
  // sen  d message to database
  try {
    const { data } = await addMessage(message);
    setMessages([...messages, data]);
    setNewMessage("");
  }
  catch
  {
    console.log("error")
  }
}

// Receive Message from parent component
useEffect(()=> {
  console.log("Message Arrived: ", receivedMessage)
  if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
    setMessages([...messages, receivedMessage]);
  }

},[receivedMessage])



  const scroll = useRef();
  const imageRef = useRef();
  return (
      <div className="ChatBox-container">
        {chat ? (
          <>
            <div className="chat-header" style={{ fontSize: "1.5rem", backgroundColor: "#f4f4f4;"}}>
               <div className="name">
                    <span>
                      {chat.title}
                    </span>
                  </div>
            
            </div>
            {/* chat-body */}
            <div className="chat-body" >
              {messages.map((message) => (
                <>
                  <div ref={scroll}
                    className={
                      message.senderId === currentUser
                        ? "message own"
                        : "message"
                    }
                  >
                    <span>{message.text}</span>{" "}
                    <span>{format(message.createdAt)}</span>
                  </div>
                </>
              ))}
            </div>
            <div className="chat-sender">
              <InputEmoji
                value={newMessage}
                onChange={handleChange}
              />
              <div className="send-button button" onClick = {handleSend}>Send</div>
              <input
                type="file"
                name=""
                id=""
                style={{ display: "none" }}
              />
            </div>{" "}
            
          </>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
        )}
      </div>
    
  );
};

export default ChatBox;
