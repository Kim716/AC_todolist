import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkPermission, login } from '../api/auth';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleClick = async () => {
    // 沒有輸入帳密就直接擋掉
    if (username.length === 0 || password.length === 0) {
      return;
    }

    const { success, authToken } = await login({ username, password });

    // 用 success 是否為 true 判斷有沒有成功，但我會覺得也不用特別立 success 的 flag，直接判斷 authToken 存不存在就好拉？
    if (success) {
      localStorage.setItem('authToken', authToken);

      // 跳出登入成功訊息
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: '登入成功',
        timer: 1500,
        showConfirmButton: false,
      });

      // 網頁跳轉
      navigate('/todos');
      return;
    }

    // 跳出登入失敗訊息
    Swal.fire({
      position: 'top',
      icon: 'error',
      title: '登入失敗',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // dependency 的部分，教案擺入 navigate，eslint 也表示要擺入東西，但如果本就沒有打算根據什麼狀況的更新來啟動 useEffect 應該可以不用擺？
  useEffect(() => {
    const checkTokenIsValid = async () => {
      const authToken = localStorage.getItem('authToken');
      // 如果 authToken 不存在，就什麼都別做，留在這頁
      if (!authToken) {
        return;
      }

      // 確認 authToken 是不是有效的，這個會回傳 success 的布林值
      const result = await checkPermission(authToken);
      // 如果 authToken 有效，代表是登入狀態，就直接去 todos 頁面
      if (result) {
        navigate('/todos');
      }
    };

    checkTokenIsValid();
  }, []);

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>登入 Todo</h1>

      <AuthInputContainer>
        <AuthInput
          label={'帳號'}
          value={username}
          placeholder={'請輸入帳號'}
          onChange={(nameInputValue) => setUsername(nameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          type="password"
          label="密碼"
          value={password}
          placeholder="請輸入密碼"
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick}>登入</AuthButton>
      <AuthLinkText>
        <Link to="/signup">
          <AuthLinkText>註冊</AuthLinkText>
        </Link>
      </AuthLinkText>
    </AuthContainer>
  );
};

export default LoginPage;
