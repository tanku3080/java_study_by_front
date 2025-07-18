// src/components/AddTodoForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Todo } from './data/types';

interface Props {
  onAdd: (todo: Todo) => void;
}

const AddTodoForm: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const envValue = process.env.REACT_APP_VITE_API_BASE_URL;
  console.log("env確認:", envValue);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTodo = {
      title,
      completed: false
    };
    const res = await axios.post<Todo>(`${envValue}/todos`, newTodo);
    onAdd(res.data);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="新しいToDo"
        required
      />
      <button type="submit">追加</button>
    </form>
  );
};

export default AddTodoForm;
