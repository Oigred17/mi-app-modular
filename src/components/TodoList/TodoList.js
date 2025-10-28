import React, { useState, useEffect } from 'react';
import './TodoList.css';
import IconTrash from '../Icons/IconTrash'; // Importar el nuevo ícono
import { db } from '../../firebaseConfig'; // <-- Importa nuestra config
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"; // <-- Importa funciones de Firestore

const TodoList = () => {
  const [tasks, setTasks] = useState([]); 
  const [inputValue, setInputValue] = useState('');

  // --- LEER TAREAS (GET) ---
  useEffect(() => {
    const collectionRef = collection(db, "tasks");
    const q = query(collectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newTasks = [];
      querySnapshot.forEach((doc) => {
        newTasks.push({ 
          ...doc.data(), 
          id: doc.id
        });
      });
      setTasks(newTasks);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    await addDoc(collection(db, "tasks"), {
      text: inputValue,
      completed: false,
      createdAt: serverTimestamp()
    });

    setInputValue('');
  };

  const toggleTaskCompletion = async (task) => {
    const taskRef = doc(db, "tasks", task.id);
    await updateDoc(taskRef, {
      completed: !task.completed
    });
  };

  const deleteTask = async (taskId) => {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
  };

  return (
    <div className="todo-list-container">
      <h2>Mi Lista de Tareas</h2>

      <form onSubmit={handleAddTask} className="add-task-form">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Añade una nueva tarea..."
        />
        <button type="submit">Añadir</button>
      </form>

      <ul>
        {tasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task)}
            />
            <span>{task.text}</span>
            <button 
              onClick={() => deleteTask(task.id)}
              className="delete-btn"
            >
              <IconTrash size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;