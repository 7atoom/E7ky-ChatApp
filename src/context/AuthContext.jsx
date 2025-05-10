import { createContext, useState, useCallback, useEffect } from "react";
import { postRequest, baseUrl } from "../utils/services";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({
  user: null,
  registerInfo: {
    name: "",
    email: "",
    password: "",
  },
  loginInfo: { email: "", password: "" },
  updateRegisterInfo: () => {},
  updateLoginInfo: () => {},
  setUser: () => {},
  registerUser: () => {},
  loginUser: () => {},
  registerError: null,
  loginError: null,
  isRegisterLoading: null,
  isLoginLoading: null,
  isLoggedIn: false,
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const navigate = useNavigate();

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();

      setIsRegisterLoading(true);
      setRegisterError(null);
      const response = await postRequest(
        `${baseUrl}/users/register`,
        registerInfo
      );
      console.log("response", response);
      setIsRegisterLoading(false);
      if (response.error) {
        return setRegisterError(response);
      }
      localStorage.setItem("user", JSON.stringify(response));
      setUser(response);
      navigate("/");
    },
    [registerInfo, navigate]
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);
      const response = await postRequest(`${baseUrl}/users/login`, loginInfo);
      console.log("login response", response);
      setIsLoginLoading(false);
      if (response.error) {
        return setLoginError(response);
      }
      localStorage.setItem("user", JSON.stringify(response));
      setUser(response);
      navigate("/chat"); // or wherever you want to go
    },
    [loginInfo, navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        loginInfo,
        updateRegisterInfo,
        updateLoginInfo,
        setUser,
        registerUser,
        loginUser,
        registerError,
        loginError,
        isRegisterLoading,
        isLoginLoading,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
