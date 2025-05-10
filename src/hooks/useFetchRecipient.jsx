import { useEffect, useState } from "react";
import { getRequest, baseUrl } from "../utils/services";

export const useFetchRecipient = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId = chat?.members?.find((id) => id && id !== user?._id);

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) {
        console.warn("No valid recipient ID found");
        return;
      }

      try {
        const response = await getRequest(`${baseUrl}/users/${recipientId}`);
        if (response.error) {
          setError(response.error);
        } else {
          setRecipientUser(response.user);
        }
      } catch (err) {
        console.error("Error fetching recipient user:", err);
        setError(err);
      }
    };

    getUser();
  }, [recipientId]);

  return { recipientUser };
};
