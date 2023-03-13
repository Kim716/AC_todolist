import { useAuthContext } from 'contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos');
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return <div>HomePage</div>;
};

export default HomePage;
