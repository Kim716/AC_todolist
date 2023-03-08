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
