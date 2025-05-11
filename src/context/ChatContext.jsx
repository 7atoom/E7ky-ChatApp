import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext({
  userChats: null,
  isUserChatsLoading: false,
  userChatsError: null,
  pontentialChats: [],
  createChat: () => {},
  updateCurrentChat: () => {},
  messages: null,
  isMessagesLoading: false,
  messagesError: null,
  currentChat: null,
  sendTextMessage: () => {},
  onlineUsers: [],
  notifications: [],
  allUser: [],
});

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [pontentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]); // State for notifications
  const [allUsers, setAllUsers] = useState([]); // State for all users

  console.log("Messages", messages);
  console.log("Current Chat", currentChat);
  console.log("online users", onlineUsers);
  console.log("Notifications", notifications);
  // Socket connection
  useEffect(() => {
    const newSocket = io("https://chat-api-cova.onrender.com");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Listen for online users
  useEffect(() => {
    if (!socket) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
  }, [socket, user]);

  // send Message
  useEffect(() => {
    if (!socket) return;

    const recipientId = currentChat?.members?.find(
      (id) => id && id !== user?._id
    );
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage, socket, currentChat, user]);

  // recieve Message and Notification
  useEffect(() => {
    if (!socket) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, user, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) {
        return console.log("error fetching users", response);
      }

      const usersArray = response.users || []; // fallback if undefined

      const pChats = usersArray.filter((u) => {
        if (!u || !user || !user._id) return false;

        let isChatCreated = false;

        if (user._id === u._id) {
          return false;
        }

        if (userChats) {
          isChatCreated = userChats.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }

        return !isChatCreated;
      });

      setPotentialChats(pChats);
      setAllUsers(usersArray);
    };

    getUsers();
  }, [user, userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
        setIsUserChatsLoading(false);
        if (response.error) {
          return setUserChatsError(response);
        }
        setUserChats(response.chats);
      }
    };
    getUserChats();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);
      const response = await getRequest(
        `${baseUrl}/messages/${currentChat._id}`
      );
      setIsMessagesLoading(false);
      if (response.error) {
        return setMessagesError(response);
      }
      setMessages(response.messages);
    };
    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) {
        console.warn("Text message is empty. Please provide a valid message.");
        return;
      }

      const response = await postRequest(`${baseUrl}/messages`, {
        chatId: currentChatId,
        senderId: sender._id,
        text: textMessage,
      });

      if (response.error) {
        return setSendTextMessageError(response.error);
      }

      setNewMessage(response.message);
      setMessages((prev) => {
        if (prev) {
          return [...prev, response.message];
        } else {
          return [response.message];
        }
      });
      setTextMessage("");
    },
    []
  );

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(
    async (firstId, secondId) => {
      // ✅ Check if the chat already exists in the current state
      const alreadyExists = userChats?.some((chat) => {
        const members = chat.members;
        return members.includes(firstId) && members.includes(secondId);
      });

      if (alreadyExists) {
        console.warn("Chat already exists. Skipping creation.");
        return; // Stop here — don’t make the API call
      }

      console.log("Payload being sent:", { firstId, secondId });

      try {
        const response = await postRequest(`${baseUrl}/chats`, {
          firstId,
          secondId,
        });

        if (response.error) {
          console.error("Error creating chat:", response.message);
          return;
        }

        if (response.chat) {
          console.log("Chat created or found:", response.chat);

          setUserChats((prev) => {
            if (prev) {
              // ✅ Also check here to avoid adding duplicate to state
              const exists = prev.some((c) => c._id === response.chat._id);
              if (exists) return prev;
              return [...prev, response.chat];
            } else {
              return [response.chat];
            }
          });
        } else {
          console.warn("No chat returned from server.");
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    },
    [userChats]
  );

  useEffect(() => {
  // Reset currentChat when the user logs in, registers, or changes
  setCurrentChat(null);
}, [user]);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        pontentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
      }}>
      {children}
    </ChatContext.Provider>
  );
};
