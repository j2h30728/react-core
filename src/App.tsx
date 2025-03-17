import { useState } from "custom-jsx-library";

const App = () => {
  const [todos, setTodos] = useState<{ id: string; value: string; complete: boolean }[]>([]);

  const handleClick = (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const inputElement = form.querySelector("input") as HTMLInputElement;
    const newTodo = {
      id: Date(),
      value: inputElement.value,
      complete: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const handleToggleComplete = (e: Event) => {
    e.stopPropagation();
    const button = e.target as HTMLButtonElement;
    const selectedId = button.parentElement!.id;
    setTodos((prev) => prev.map((todo) => (todo.id === selectedId ? { ...todo, complete: !todo.complete } : todo)));
  };

  return (
    <div>
      <h1>TODO APP</h1>
      <form onSubmit={handleClick}>
        <input placeholder="todo" />
        <button>추가</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li id={todo.id}>
            <span style={{ textDecorationLine: todo.complete ? "line-through" : "none" }}>{todo.value}</span>
            <button onClick={handleToggleComplete}>{todo.complete ? "취소" : "완료"}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
