import axios from 'axios';

const baseUrl = 'https://todo-list.alphacamp.io/api';

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

// 發送請求前都要做一個在 header 放 authToken 的動作
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error(error);
  },
);

export const getTodos = async () => {
  try {
    const res = await axiosInstance.get(`${baseUrl}/todos`);
    return res.data.data;
  } catch (error) {
    console.error('[⚠️ Get Todos failed]: ', error);
  }
};

// 這裡參數直接進行解構，但看到下面會有點疑惑，是不是不用解構？直接把要放的 data 原封不動傳進去就好？
// 經過測試不解構也OK，但也許這樣寫可讀性高？
export const createTodos = async ({ title, isDone }) => {
  try {
    // post 會自動新增 id
    // 第二個參數是要 create 的資料
    const res = await axiosInstance.post(`${baseUrl}/todos`, { title, isDone });
    return res.data;
  } catch (error) {
    console.error('[⚠️ Create Todo failed]: ', error);
  }
};

export const patchTodos = async ({ id, title, isDone }) => {
  try {
    const res = await axiosInstance.patch(`${baseUrl}/todos/${id}`, {
      title,
      isDone,
    });
    return (await res).data;
  } catch (error) {
    console.error('[⚠️ Patch Todo failed]: ', error);
  }
};

export const deleteTodos = async ({ id }) => {
  try {
    const res = await axiosInstance.delete(`${baseUrl}/todos/${id}`);
    return res.data;
  } catch (error) {
    console.error('[⚠️ Delete Todo failed]: ', error);
  }
};
