import React, { useEffect, useState, ChangeEvent, KeyboardEvent, useRef } from 'react';
import axios from 'axios';
import { Todo } from './data/types';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTitles, setEditingTitles] = useState<{ [key: number]: string }>({});
  const textAreaRefs = useRef<{ [key: number]: HTMLTextAreaElement | null }>({});
  const envValue = process.env.REACT_APP_VITE_API_BASE_URL;

  useEffect(() => {
    todos.forEach(todo => {
        const el = textAreaRefs.current[todo.id];
        if (el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        }
    });
  }, [todos]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get<Todo[]>(`${envValue}/todos`)
      .then(res => setTodos(res.data))
      .catch(err => console.error(err));
  };

  const handleCompleted = (todo: Todo) => {
    const updated = { ...todo, completed: !todo.completed };
    axios.patch<Todo>(`${envValue}/todos/${todo.id}`, updated)
      .then(res => {
        setTodos(prev => prev.map(t => (t.id === todo.id ? res.data : t)));
        setEditingTitles(prev => ({ ...prev, [todo.id]: res.data.title }));
      })
      .catch(err => console.error(err));
  };

  const handleTitleChange = (id: number, value: string,e?: ChangeEvent<HTMLTextAreaElement>) => {
    setEditingTitles(prev => ({ ...prev, [id]: value }));
    if (e) {
        const textarea = e.target;
        textarea.style.height = "auto"; // 高さリセット
        textarea.style.height = textarea.scrollHeight + "px"; // 入力内容に合わせて高さ再設定
        }
    };

  const handleTitleSubmit = (todo: Todo) => {
    const newTitle = editingTitles[todo.id];
    if (!newTitle || newTitle.trim() === "" || newTitle === todo.title) return;

    const updated = { ...todo, title: newTitle };
    axios.patch<Todo>(`${envValue}/todos/${todo.id}`, updated)
      .then(res => {
        setTodos(prev => prev.map(t => (t.id === todo.id ? res.data : t)));
        setEditingTitles(prev => ({ ...prev, [todo.id]: res.data.title }));
      })
      .catch(err => console.error(err));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, todo: Todo) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleTitleSubmit(todo);
    }
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '2rem auto',
        backgroundColor: '#f9f9f9',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>📝 ToDo一覧</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleCompleted(todo)}
              style={{ transform: 'scale(1.3)' }}
            />
            <textarea
            ref={(el) => {
                textAreaRefs.current[todo.id] = el;
            }}
            value={editingTitles[todo.id] ?? todo.title}
            onChange={(e) => handleTitleChange(todo.id, e.target.value, e)}
            onKeyDown={(e) => handleKeyDown(e, todo)}
            rows={1}
            style={{
                flexGrow: 1,
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid #ddd',
                resize: 'none',
                fontSize: '1rem',
                backgroundColor: todo.completed ? '#e8f5e9' : '#fff',
                color: todo.completed ? '#777' : '#000',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
                lineHeight: '1.4',
                overflow: 'hidden',
                }}
                />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
