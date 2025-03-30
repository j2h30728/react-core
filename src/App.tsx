import { useState } from "custom-jsx-library";
import { useEffect } from "custom-jsx-library/core/hooks";

const App = () => {
  const [todos, setTodos] = useState<{ id: string; value: string; complete: boolean }[]>([]);
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const handleInput = (e: InputEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setInputValue(value);
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const newTodo = {
      id: Date.now().toString(),
      value: inputValue,
      complete: false,
    };
    setTodos((prev) => [...prev, newTodo]);

    (e.target as HTMLFormElement).reset();
    setInputValue("");
  };

  const handleToggleComplete = (id: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, complete: !todo.complete } : todo)));
  };

  const handleDelete = (id: string) => {
    console.log("handleDelete", todos, id);
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  useEffect(() => {
    console.log("todos", todos);
  }, [todos]);

  return (
    <div>
      <h1>TODO APP</h1>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>증가</button>
      <h3>KEYED FORM</h3>
      <form onSubmit={handleSubmit}>
        <input name="todoInput" placeholder="todo" onChange={handleInput} />
        <button>추가</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li id={todo.id} key={todo.id}>
            <span style={{ textDecorationLine: todo.complete ? "line-through" : "none" }}>{todo.value}</span>
            <button type="button" onClick={() => handleToggleComplete(todo.id)}>
              {todo.complete ? "취소" : "완료"}
            </button>
            <button type="button" onClick={() => handleDelete(todo.id)}>
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
