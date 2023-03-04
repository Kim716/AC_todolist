import clsx from 'clsx';
import styled from 'styled-components';

const StyledAddTodoContainer = styled.div`
  min-height: 52px;
  display: flex;
  align-items: center;
  position: relative;
  word-wrap: break-word;
  word-break: break-word;
  padding: 0 12px;
  box-shadow: 0 17px 0 -16px #e5e5e5;
  flex-wrap: wrap;

  &.active {
    box-shadow: 0 17px 0 -16px var(--major);
  }
`;

const StyledLabelIcon = styled.label`
  display: inline-flex;
  font-size: 30px;
  transition: color 0.2s ease-out;
  font-weight: 300;

  &:after {
    content: '+';
  }
`;

const StyledInputContainer = styled.div`
  min-height: 52px;
  display: flex;
  align-items: center;
  flex: 1;
  user-select: none;

  input {
    flex: 1;
    padding: 8px 12px;
    border: 0;
    outline: 0;
    font-size: 1rem;

    &::placeholder {
      color: var(--major);
      font-size: 13px;
    }
  }
  $.active {
    input::placeholder {
      color: var(--gray);
    }
  }
`;

const StyledAddTodoActionContainer = styled.div`
  button {
    font-size: 13px;
    color: var(--major);
    padding-right: 5px;
    display: none;
  }

  &.active {
    button {
      display: block;
    }
  }
`;

// 雖然沒有用 form 包覆，但不論是 keydown or addtodo 可以整合成 submit 的概念，就不用寫重複的 handle
const TodoInput = ({
  inputValue,
  onChange,
  onSubmit,
  onKeyDown,
  onAddTodo,
}) => {
  return (
    <StyledAddTodoContainer
      className={clsx('', { active: inputValue.length > 0 })}
    >
      <StyledLabelIcon className="icon" htmlFor="add-todo-input" />

      <StyledInputContainer>
        <input
          id="add-todo-input"
          type="text"
          placeholder="新增工作"
          value={inputValue}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit?.();
            }
          }}
        />
      </StyledInputContainer>
      <StyledAddTodoActionContainer
        className={clsx('', { active: inputValue.length > 0 })}
      >
        <button className="btn-reset" onClick={() => onSubmit?.()}>
          新增
        </button>
      </StyledAddTodoActionContainer>
    </StyledAddTodoContainer>
  );
};

export default TodoInput;
