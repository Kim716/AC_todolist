import { createContext, useEffect, useState, useContext } from 'react';
import * as jwt from 'jsonwebtoken';
import { checkPermission, login, register } from '../api/auth';
import { useLocation } from 'react-router-dom';

const defaultAuthContext = {
  isAuthenticated: false, // 是否登入的判斷，取得憑證會更改為 true
  currentMember: null, // 使用者的資料
  // 以下三者皆為 function
  register: null,
  login: null,
  logout: null,
};

const AuthContext = createContext(defaultAuthContext);

// 要寫成箭頭函式是因為 useContext 要在元件第一層被調用，不能在這裡就直接調用
export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payload, setPayload] = useState(null);

  // 取得當前頁面的 pathname 用來判斷當前頁面有沒有改變
  const { pathname } = useLocation();

  // 確認身份
  useEffect(() => {
    const checkTokenIsValid = async () => {
      const authToken = localStorage.getItem('authToken');
      // 如果 authToken 不存在，就要回到登入頁！
      if (!authToken) {
        setPayload(null);
        setIsAuthenticated(false);
        return;
      }

      // 確認 authToken 是不是有效的，這個會回傳 success 的布林值
      const result = await checkPermission(authToken);
      // 如果 authToken 無效，就要回到登入頁
      if (result) {
        setIsAuthenticated(true);
        const tempPayload = jwt.decode(authToken);
        setPayload(tempPayload);
      } else {
        setPayload(null);
        setIsAuthenticated(false);
      }
    };

    checkTokenIsValid();
  }, [pathname]);
  // 如果當前頁面有改變，就觸發這個 useEffect

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentMember: payload && {
          id: payload.sub,
          name: payload.name,
        },
        register: async (data) => {
          const { success, authToken } = await register({
            username: data.username,
            email: data.email,
            password: data.password,
          });

          // 不用先判斷 success 嗎？

          // 解析 token
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }

          // 最後才把有沒有成功回傳去？
          return success;
        },
        login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            password: data.password,
          });

          // 解析 token
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }

          // 最後才把有沒有成功回傳去？
          return success;
        },
        logout: () => {
          localStorage.removeItem('authToken');
          setPayload(null);
          setIsAuthenticated(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
