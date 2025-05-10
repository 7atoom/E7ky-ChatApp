import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

const PontentialChats = () => {
  const { user } = useContext(AuthContext);
  const { pontentialChats, createChat, onlineUsers } = useContext(ChatContext);

  console.log("PontentialChats", pontentialChats);
  return (
    <>
      <div className='all-users'>
        {pontentialChats &&
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
          })}
      </div>
    </>
  );
};

export default PontentialChats;
