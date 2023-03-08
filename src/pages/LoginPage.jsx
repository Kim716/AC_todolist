import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from 'api/auth';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = async (username, password) => {
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

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>登入 Todo</h1>

      <AuthInputContainer>
        <AuthInput
          label={'帳號'}
          value={userName}
          placeholder={'請輸入帳號'}
          onChange={(nameInputValue) => setUserName(nameInputValue)}
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
      <AuthButton onClick={() => handleClick(userName, password)}>
        登入
      </AuthButton>
      <AuthLinkText>
        <Link to="/signup">
          <AuthLinkText>註冊</AuthLinkText>
        </Link>
      </AuthLinkText>
    </AuthContainer>
  );
};

export default LoginPage;
