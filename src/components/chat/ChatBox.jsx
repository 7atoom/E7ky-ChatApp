import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import InputEmoji from "react-input-emoji";
import moment from "moment";
import avatar from "../../assets/avatar.svg";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const {
    currentChat,
    messages,
    isMessagesLoading,
    sendTextMessage,
    onlineUsers,
  } = useContext(ChatContext);
  const { recipientUser } = useFetchRecipient(currentChat, user);
  const [textMessage, setTextMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Smooth scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!recipientUser) {
    return (
      <div className='chat-box'>
        <div className='empty-state'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path>
          </svg>
          <h3>No conversation selected</h3>
          <p>Choose a contact to start chatting</p>
        </div>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className='chat-box'>
        <div className='empty-state'>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  const isOnline = onlineUsers?.some((onlineUser) => {
    return onlineUser?.userId === recipientUser?._id;
  });

  return (
    <div className='chat-box'>
      <div className='chat-header'>
        <div className='avatar-container'>
          <img src={avatar} alt='user-avatar' className='avatar' />
          {isOnline && <span className='user-online'></span>}
        </div>
        <div className='chat-header-content'>
          <span className='chat-header-name'>{recipientUser?.name}</span>
          <span className='chat-header-status'>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className='messages'>
        {messages &&
          messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message?.senderId === user?._id ? "self" : ""
              }`}>
              <span>{message.text}</span>
              <span className='message-footer'>
                {moment(message.createdAt).calendar()}
              </span>
            </div>
          ))}
        {/* Add a reference to the bottom of the messages */}
        <div ref={messagesEndRef}></div>
      </div>

      <div className='chat-input'>
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          cleanOnEnter
          onEnter={() =>
            sendTextMessage(textMessage, user, currentChat._id, setTextMessage)
          }
          placeholder='Type a message...'
        />
        <button
          className='send-btn'
          onClick={() =>
            sendTextMessage(textMessage, user, currentChat._id, setTextMessage)
          }>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='18'
            fill='currentColor'
            viewBox='0 0 16 16'>
            <path d='M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z' />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
