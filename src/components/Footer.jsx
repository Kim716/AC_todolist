import { useAuthContext } from 'contexts/AuthContext';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  display: flex;
  justify-content: space-between;

  padding: 0 16px;
  p {
    font-size: 14px;
    font-weight: 300;
    margin: 2rem 0 1rem;
  }
`;

const StyledButton = styled.button`
  padding: 0;
  border: 0;
  background: none;
  vertical-align: baseline;
  appearance: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  outline: 0;

  font-size: 14px;
  font-weight: 300;
  margin: 2rem 0 1rem;
  &:hover {
    text-decoration: underline;
  }
`;

const Footer = ({ todoItems }) => {
  const { logout } = useAuthContext();

  const itemLeft = todoItems.filter((todo) => todo.isDone === false).length;

  return (
    <StyledFooter>
      <p>總項目： {todoItems.length}</p>
      <p>待完成項目： {itemLeft}</p>
      <StyledButton onClick={logout}>登出</StyledButton>
    </StyledFooter>
  );
};

export default Footer;
