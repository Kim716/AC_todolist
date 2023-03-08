import { createContext, useState } from 'react';
import * as jwt from 'jsonwebtoken';
import { login, register } from 'api/auth';

const defaultAuthContext = {
  isAuthenticated: false, // 是否登入的判斷，取得憑證會更改為 true
  currentMember: null, // 使用者的資料
  // 以下三者皆為 function
  register: null,
  login: null,
  logout: null,
};

const AuthContext = createContext(defaultAuthContext);

export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payload, setPayload] = useState(null);

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
