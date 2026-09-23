const API_URL = 'http://localhost:8000/todos/';

export async function getTodos() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch TODOs');
  }

  return response.json();
}

export async function createTodo(todo) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ todo }),
  });

  if (!response.ok) {
    throw new Error('Failed to create TODO');
  }

  return response.json();
}
