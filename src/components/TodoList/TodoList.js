import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TodoList.css';
import IconTrash from '../Icons/IconTrash';
import { db } from '../../firebaseConfig'; // <-- Importa nuestra config
import { collection, query, orderBy, onSnapshot, doc, serverTimestamp, writeBatch } from "firebase/firestore"; // <-- Importa más funciones de Firestore

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

    const batch = writeBatch(db);
    const newTaskRef = doc(collection(db, "tasks")); // Crea una referencia con un ID nuevo
    const auditLogRef = doc(collection(db, "task_audit_log")); // Referencia para el log

    const newTaskData = {
        text: inputValue,
        completed: false,
        createdAt: serverTimestamp()
    };

    // 1. Añadir la nueva tarea
    batch.set(newTaskRef, newTaskData);

    // 2. Registrar la creación en el historial
    batch.set(auditLogRef, {
      taskId: newTaskRef.id,
      action: 'CREATED',
      timestamp: serverTimestamp(),
      data: { text: inputValue, completed: false }
    });

    await batch.commit();
    setInputValue(''); // Limpiar el input después de confirmar
  };

  const toggleTaskCompletion = async (task) => {
    const taskRef = doc(db, "tasks", task.id);
    const auditLogRef = doc(collection(db, "task_audit_log"));
    const newCompletedStatus = !task.completed;

    const batch = writeBatch(db);

    // 1. Actualizar la tarea
    batch.update(taskRef, { completed: newCompletedStatus });

    // 2. Registrar el cambio en el historial SOLO si se está completando
    if (newCompletedStatus) {
      batch.set(auditLogRef, {
        taskId: task.id,
        action: 'COMPLETED', // Usamos 'COMPLETED' para que aparezca en el historial
        timestamp: serverTimestamp(),
        data: { ...task, completed: newCompletedStatus }
      });
    } else {
      // Si se desmarca, la volvemos a registrar como 'CREATED' para que el historial lo refleje
      batch.set(auditLogRef, {
        taskId: task.id,
        action: 'CREATED', // La "re-abrimos", volviendo a su estado inicial en el historial
        timestamp: serverTimestamp(),
        data: { ...task, completed: newCompletedStatus }
      });
    }

    await batch.commit();
  };

  const deleteTask = async (taskToDelete) => {
    if (!taskToDelete || !taskToDelete.id) return;

    // Verificación: No permitir borrar si la tarea no está completada.
    if (!taskToDelete.completed) {
      alert("No puedes eliminar una tarea que no ha sido completada.");
      return; // Detiene la ejecución de la función
    }

    const taskRef = doc(db, "tasks", taskToDelete.id);
    const auditLogRef = doc(collection(db, "task_audit_log"));

    try {
      const batch = writeBatch(db);

      // 1. Registrar la eliminación en el historial
      batch.set(auditLogRef, {
        taskId: taskToDelete.id,
        action: 'DELETED',
        timestamp: serverTimestamp(),
        data: { text: taskToDelete.text, completed: taskToDelete.completed }
      });
      // 2. Eliminar la tarea de la lista principal
      batch.delete(taskRef);

      await batch.commit(); // Ejecutar las operaciones
    } catch (error) {
      console.error("Error al mover la tarea al historial: ", error);
    }
  };

  return (
    <div className="todo-list-container">
      <h2>Mi Lista de Tareas</h2>
      
      <div className="header-actions">
        <Link to="/historial" className="history-link-btn">Ver Historial</Link>
      </div>

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
              onClick={() => deleteTask(task)}
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