import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import UserChat from "../components/chat/UserChat";
import PontentialChats from "../components/chat/PontentialChats";
import ChatBox from "../components/chat/ChatBox";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, updateCurrentChat } =
    useContext(ChatContext);

  return (
    <div className='chat-layout'>
      <div className='messages-box'>
        <div className='p-4'>
          <PontentialChats />
        </div>
        {isUserChatsLoading ? (
          <div className='flex items-center justify-center p-4'>
            <p>Loading chats...</p>
          </div>
        ) : (
          userChats?.map((chat, index) => (
            <div key={index} onClick={() => updateCurrentChat(chat)}>
              <UserChat chat={chat} user={user} />
            </div>
          ))
        )}
      </div>
      <ChatBox />
    </div>
  );
};

export default Chat;
