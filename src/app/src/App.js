import './App.css';
import { useEffect, useState } from 'react';
import { getTodos, createTodo } from './api/todos';

export function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState('');
  const [error, setError] = useState('');

  const fetchTodos = async () => {
    try {
      setError('');
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load TODOs.');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTodo = todo.trim();

    if (!trimmedTodo) {
      return;
    }

    try {
      setError('');

      await createTodo(trimmedTodo);

      setTodo('');

      // Fetch the latest TODO list from MongoDB.
      await fetchTodos();
    } catch (err) {
      console.error(err);
      setError('Unable to create TODO.');
    }
  };

  return (
    <div className="App">
      <div>
        <h1>List of TODOs</h1>

        {error && <p>{error}</p>}

        <ul>
          {todos.map((item, index) => (
            <li key={index}>{item.todo}</li>
          ))}
        </ul>
      </div>

      <div>
        <h1>Create a ToDo</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="todo">ToDo: </label>
            <input
              id="todo"
              type="text"
              value={todo}
              onChange={(event) => setTodo(event.target.value)}
            />
          </div>

          <div style={{ marginTop: '5px' }}>
            <button type="submit">Add ToDo!</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;