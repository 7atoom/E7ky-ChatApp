import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import Stack from "react-bootstrap/Stack";
import avatar from "../../assets/avatar.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext.jsx";

const UserChat = ({ chat, user }) => {
  const { recipientUser, error } = useFetchRecipient(chat, user);
  const { onlineUsers } = useContext(ChatContext);

  const isOnline = onlineUsers?.some((onlineUser) => {
    return onlineUser?.userId === recipientUser?._id;
  });

  if (error) {
    return <div>Error loading user.</div>;
  }

  if (!recipientUser) {
    return <div>Loading...</div>;
  }

  return (
    <Stack
      direction='horizontal'
      gap={3}
      className='user-card align-items-center p-2 justify-content-between'
      role='button'>
      <div className='d-flex'>
        <div className='me-2'>
          <img src={avatar} alt='user-avatar' height='35px' />
        </div>
        <div className='text-content'>
          <div className='name'>{recipientUser.name}</div>
          <div className='text'>Text Message</div>
        </div>
      </div>
      <div className='d-flex flex-column align-items-end'>
        <div className='date'>25/11/2002</div>
        <div className='this-user-notifications'>2</div>
        <div className={isOnline ? "user-online" : ""}></div>
      </div>
    </Stack>
  );
};

export default UserChat;
