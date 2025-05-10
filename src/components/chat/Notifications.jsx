import { useState } from "react";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { unreadNotificationsFun } from "../../utils/unreadNotifications.jsx";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, userChats, allUsers } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  const unreadNotifications = unreadNotificationsFun(notifications);
  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);
    return {
      ...n,
      senderName: sender?.name,
    };
  });
  console.log("un", unreadNotifications);
  console.log("mn", modifiedNotifications);

  return (
    <div className='notifications me-3'>
      <div className='notifications-icon' onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='currentColor'
          class='bi bi-chat-left-dots-fill'
          viewBox='0 0 16 16'>
          <path d='M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2' />
        </svg>
        {unreadNotifications.length === 0 ? null : (
          <span className='notification-count'>
            <span>{notifications?.length}</span>
          </span>
        )}
      </div>
      {isOpen ? (
        <div className='notifications-box'>
          <div className='notifications-header'>
            <h3>Notifications</h3>
            <div className='mark-as-read'>Mark all as read</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default Notifications;
