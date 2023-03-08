import { getTodos, createTodos, patchTodos, deleteTodos } from '../api/todos';
import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useEffect, useState } from 'react';
import { checkPermission } from 'api/auth';
import { useNavigate } from 'react-router-dom';

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    if (inputValue.trim().length === 0) return;

    const todo = await createTodos({ title: inputValue, isDone: false });

    setTodos((t) => {
      return [
        ...t,
        { id: todo.id, title: todo.title, isDone: todo.isDone, isEdit: false },
      ];
    });

    setInputValue('');
  };

  const handleToggle = async (id) => {
    // 為了取得當前的 isDone
    const currentTodo = todos.find((todo) => todo.id === id);

    try {
      await patchTodos({ id, isDone: !currentTodo.isDone });

      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, isDone: !todo.isDone };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeMode = ({ id, isEdit }) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isEdit,
          };
        }
        return { ...todo, isEdit: false };
      });
    });
  };

  const handleSave = async ({ id, title }) => {
    try {
      await patchTodos({ id, title });

      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              title,
              isEdit: false,
            };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodos({ id });
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getTodosAsync = async () => {
      try {
        const todos = await getTodos();
        setTodos(todos.map((todo) => ({ ...todo, isEdit: false })));
      } catch (error) {
        console.error(error);
      }
    };
    getTodosAsync();
  }, []);

  useEffect(() => {
    const checkTokenIsValid = async () => {
      const authToken = localStorage.getItem('authToken');
      // 如果 authToken 不存在，就要回到登入頁！
      if (!authToken) {
        navigate('/login');
        return;
      }

      // 確認 authToken 是不是有效的，這個會回傳 success 的布林值
      const result = await checkPermission(authToken);
      // 如果 authToken 無效，就要回到登入頁
      if (!result) {
        navigate('/login');
      }
    };

    checkTokenIsValid();
  }, []);

  return (
    <div>
      TodoPage
      <Header />
      <TodoInput
        inputValue={inputValue}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />
      <TodoCollection
        todoItems={todos}
        onToggle={handleToggle}
        onChangeMode={handleChangeMode}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <Footer todoItems={todos} />
    </div>
  );
};

export default TodoPage;
