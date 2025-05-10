import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext.jsx";
import avatar from "../../assets/avatar.svg";

const UserChat = ({ chat, user, onClick }) => {
  const { recipientUser, error } = useFetchRecipient(chat, user);
  const { onlineUsers, notifications } = useContext(ChatContext);

  const isOnline = onlineUsers?.some((onlineUser) => {
    return onlineUser?.userId === recipientUser?._id;
  });

  if (error) {
    return <div className='user-card'>Error loading user.</div>;
  }

  if (!recipientUser) {
    return <div className='user-card'>Loading...</div>;
  }

  return (
    <div className='user-card' onClick={onClick} style={{ cursor: "pointer" }}>
      <div className='d-flex align-items-center'>
        <div className='avatar-container'>
          <img src={avatar} alt='user-avatar' className='avatar' />
          {isOnline && <span className='user-online'></span>}
        </div>
        <div className='text-content'>
          <div className='name'>{recipientUser.name}</div>
          <div className='text'>Click to chat</div>
        </div>
      </div>
      <div className='d-flex flex-column align-items-end'>
        <div className='date'>Today</div>
        {/* Uncomment if you want to show notification count */}
        {/* <div className='this-user-notifications'>2</div> */}
      </div>
    </div>
  );
};

export default UserChat;
