import TodoItem from './TodoItem';

const TodoCollection = ({
  todoItems,
  onToggle,
  onChangeMode,
  onSave,
  onDelete,
}) => {
  const todoItemsJSX = todoItems.map((item) => (
    <TodoItem
      todoItem={item}
      key={item.id}
      onToggle={onToggle}
      onChangeMode={({ id, isEdit }) => onChangeMode({ id, isEdit })}
      // onChangeMode={onChangeMode}
      onSave={({ id, title }) => onSave?.({ id, title })}
      onDelete={(id) => onDelete(id)}
    />
  ));

  return (
    <div>
      TodoCollection
      {todoItemsJSX}
    </div>
  );
};

export default TodoCollection;
