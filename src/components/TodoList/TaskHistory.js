import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import './TaskHistory.css';

const TaskHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const historyCollectionRef = collection(db, "task_audit_log");
    const q = query(historyCollectionRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const historyLogs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(historyLogs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    // El objeto timestamp de Firestore puede no estar presente inmediatamente
    // o puede tener una estructura diferente si aún no se ha sincronizado con el servidor.
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  const translateAction = (action) => {
    const translations = {
      'CREATED': 'CREADO',
      'COMPLETED': 'COMPLETADO',
      'DELETED': 'ELIMINADO',
    };
    return translations[action] || action;
  };


  // 1. Agrupar logs por taskId
  const groupedByTask = history.reduce((acc, log) => {
    const { taskId } = log;
    if (!acc[taskId]) {
      acc[taskId] = [];
    }
    acc[taskId].push(log);
    // Ordenamos los logs de cada tarea para que el más reciente esté primero
    acc[taskId].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
    return acc;
  }, {});

  // 2. Crear una lista visual a partir de los grupos
  const displayHistory = Object.values(groupedByTask).map(logs => {
    const latestLog = logs[0]; // El log más reciente
    const originalText = logs.find(l => l.action === 'CREATED')?.data?.text || latestLog.data?.text || 'Texto no disponible';
    return {
      id: latestLog.id, // Usamos el id del último log para la key
      taskId: latestLog.taskId,
      text: originalText,
      latestAction: latestLog.action,
      timestamp: latestLog.timestamp,
    };
  }).filter(item => ['CREATED', 'COMPLETED', 'DELETED'].includes(item.latestAction));

  // 3. Aplicar el filtro de búsqueda
  const filteredHistory = displayHistory.filter(item => {
    const action = item.latestAction || '';
    const text = item.text || '';
    const searchTermLower = searchTerm.toLowerCase();

    return action.toLowerCase().includes(searchTermLower) || text.toLowerCase().includes(searchTermLower);
  });

  return (
    <div className="task-history-container">
      <h2>Historial de Tareas</h2>
      <div className="history-controls">
        <Link to="/tareas" className="back-link">← Volver a la lista</Link>
        <input
          type="text"
          placeholder="Buscar en el historial..."
          className="history-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading && <p>Cargando historial...</p>}
      <ul>
        {filteredHistory.map(log => (
          <li key={log.id} className={`history-item action-${log.latestAction?.toLowerCase()}`}>
            <span className="history-action">{translateAction(log.latestAction)}</span>
            <span className="history-text">{log.text}</span>
            <span className="history-timestamp">{formatDate(log.timestamp)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskHistory;