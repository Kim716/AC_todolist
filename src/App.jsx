import { AuthContextProvider } from 'contexts/AuthContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import { TodoPage, LoginPage, SignUpPage, HomePage } from './pages';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AuthContextProvider>
          <Routes>
            <Route path="todos" element={<TodoPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignUpPage />} />
            {/* * 代表除了以上設定好的路由，其他字串不符合的會被導引到 homepage */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
