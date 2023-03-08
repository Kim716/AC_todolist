import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import Swal from 'sweetalert2';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleRegisterClick = async () => {
    // 沒有輸入就直接擋掉
    if (username.length === 0 || password.length === 0 || email.length === 0) {
      return;
    }

    const { success, authToken } = await register({
      username,
      email,
      password,
    });

    if (success) {
      localStorage.setItem('authToken', authToken);

      // 跳出登入成功訊息
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: '註冊成功',
        timer: 1500,
        showConfirmButton: false,
      });

      // 網頁跳轉
      navigate('/todos');
      return;
    }

    Swal.fire({
      position: 'top',
      icon: 'error',
      title: '註冊失敗',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>建立您的帳號</h1>

      <AuthInputContainer>
        <AuthInput
          label="帳號"
          value={username}
          placeholder="請輸入帳號"
          onChange={(nameInputValue) => setUsername(nameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          type="email"
          label={'Email'}
          value={email}
          placeholder={'請輸入 email'}
          onChange={(emailInputValue) => setEmail(emailInputValue)}
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
      <AuthButton onClick={handleRegisterClick}>註冊</AuthButton>
      <AuthLinkText>
        <Link to="/login">
          <AuthLinkText>取消</AuthLinkText>
        </Link>
      </AuthLinkText>
    </AuthContainer>
  );
};

export default SignUpPage;
