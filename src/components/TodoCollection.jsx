import TodoItem from './TodoItem';

const TodoCollection = ({
  todoItems,
  onToggle,
  onChangeMode,
  onSave,
  onDelete,
}) => {
  const todoItemsJSX = todoItems.map((item) => (
    <TodoItem todoItem={item} key={item.id} onToggle={onToggle} />
  ));

  return (
    <div>
      TodoCollection
      {todoItemsJSX}
    </div>
  );
};

export default TodoCollection;
