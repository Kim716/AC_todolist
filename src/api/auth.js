import axios from 'axios';

const baseUrl = 'https://todo-list.alphacamp.io/api/auth';

export const login = async ({ username, password }) => {
  try {
    // 發出登入請求
    const res = await axios.post(`${baseUrl}/login`, { username, password });

    // 如果 res.data.authToken 存在，代表登入成功，我們除了回傳 data 也立一個 success 的 flag，之後用來做判斷
    if (res.data.authToken) {
      return { success: true, ...res.data };
    }

    return res.data;
  } catch (error) {
    console.error('[ ⚠️⚠️⚠️ Login Failed ]:', error);
  }
};

export const register = async ({ username, email, password }) => {
  try {
    const res = await axios.post(`${baseUrl}/register`, {
      username,
      email,
      password,
    });

    // 確認是否註冊成功(註冊成功只有authToken)
    if (res.data.authToken) {
      return { success: true, ...res.data };
    }

    // 註冊失敗也還是會有回傳值{"success": false,"message": "Username or email has been taken"}
    return res.data;
  } catch (error) {
    console.error('[ ⚠️⚠️⚠️ Register Failed ]:', error);
  }
};
