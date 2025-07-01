// src/components/TodoList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Todo } from './data/types';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    axios.get<Todo[]>('http://localhost:8080/api/todos')
      .then(res => setTodos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>ToDo一覧</h2>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title} - {todo.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
