import { getTodos, createTodos, patchTodos, deleteTodos } from '../api/todos';
import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from 'contexts/AuthContext';

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);

  const navigate = useNavigate();
  const { isAuthenticated, currentMember } = useAuthContext();

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

  // 取得 todos 資料
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
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      TodoPage
      <Header currentMember={currentMember?.name} />{' '}
      {/* 一定要有 ?. 因為有些時候  currentMember 為 null*/}
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
