import React, { useState } from 'react';
import './App.css';
import AddTodoForm from './component/AddTodoForm';
import { Todo } from './component/data/types';
import TodoList from './component/TodoList';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleAdd = (todo: Todo) => {
    setTodos([...todos, todo]);
  };

  return (
    <div className="App">
      <h1>ToDo アプリ</h1>
      <AddTodoForm onAdd={handleAdd} />
      <TodoList />
    </div>
  );
};

export default App;
