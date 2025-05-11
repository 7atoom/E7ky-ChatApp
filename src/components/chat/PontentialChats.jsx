import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { pontentialChats, createChat, onlineUsers } = useContext(ChatContext);

  return (
    <>
      <div className='all-users'>
        {pontentialChats && pontentialChats.length > 0 ? (
          pontentialChats.map((u, index) => {
            return (
              <div
                className='single-user'
                key={index}
                onClick={() => createChat(user._id, u._id)}>
                {u?.name}
                <span
                  className={
                    onlineUsers?.some((user) => user?.userId === u?._id)
                      ? "user-online"
                      : ""
                  }></span>
              </div>
            );
          })
        ) : (
          <div className='empty-potential-users'>
            <p>No potential chats available</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PotentialChats;
