import { useState } from "custom-jsx-library";

const App = () => {
  const [todos, setTodos] = useState<{ id: string; value: string; complete: boolean }[]>([]);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const value = formData.get("todoInput")?.toString().trim();

    if (!value) {
      window.alert("입력을 부탁드립니다.");
      return;
    }

    const newTodo = {
      id: Date.now().toString(),
      value,
      complete: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const handleToggleComplete = (id: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, complete: !todo.complete } : todo)));
  };

  return (
    <div>
      <h1>TODO APP</h1>
      <form onSubmit={handleSubmit}>
        <input name="todoInput" placeholder="todo" />
        <button>추가</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li id={todo.id}>
            <span style={{ textDecorationLine: todo.complete ? "line-through" : "none" }}>{todo.value}</span>
            <button type="button" onClick={() => handleToggleComplete(todo.id)}>
              {todo.complete ? "취소" : "완료"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
