import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import TaskHistory from './TaskHistory';
import * as firebaseFirestore from 'firebase/firestore';

// Mock firebase
jest.mock('../../firebaseConfig', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn()
}));

describe('TaskHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el componente con estado de carga', () => {
    firebaseFirestore.onSnapshot.mockImplementation(() => {
      // No llamamos al callback para mantener el estado de carga
      return jest.fn(); // Retorna un unsubscribe mock
    });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TaskHistory />
      </BrowserRouter>
    );

    expect(screen.getByText('Historial de Tareas')).toBeInTheDocument();
    expect(screen.getByText('Cargando historial...')).toBeInTheDocument();
  });

  test('renderiza el historial de tareas cuando se cargan', async () => {
    const mockHistoryData = [
      {
        id: '1',
        taskId: 'task1',
        action: 'CREATED',
        timestamp: { seconds: 1000000000, toDate: () => new Date('2024-01-01') },
        data: { text: 'Tarea 1' }
      },
      {
        id: '2',
        taskId: 'task1',
        action: 'COMPLETED',
        timestamp: { seconds: 1000000100, toDate: () => new Date('2024-01-02') },
        data: { text: 'Tarea 1', completed: true }
      }
    ];

    firebaseFirestore.onSnapshot.mockImplementation((_q, callback) => {
      callback({
        docs: mockHistoryData.map(doc => ({
          id: doc.id,
          data: () => ({ ...doc })
        }))
      });
      return jest.fn(); // Retorna unsubscribe mock
    });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TaskHistory />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Cargando historial...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('COMPLETADO')).toBeInTheDocument();
  });

  test('filtra tareas por búsqueda', async () => {
    const mockHistoryData = [
      {
        id: '1',
        taskId: 'task1',
        action: 'CREATED',
        timestamp: { seconds: 1000000000, toDate: () => new Date('2024-01-01') },
        data: { text: 'Comprar pan' }
      },
      {
        id: '2',
        taskId: 'task2',
        action: 'DELETED',
        timestamp: { seconds: 1000000100, toDate: () => new Date('2024-01-02') },
        data: { text: 'Lavar ropa' }
      }
    ];

    firebaseFirestore.onSnapshot.mockImplementation((_q, callback) => {
      callback({
        docs: mockHistoryData.map(doc => ({
          id: doc.id,
          data: () => ({ ...doc })
        }))
      });
      return jest.fn();
    });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TaskHistory />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Cargando historial...')).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Buscar en el historial...');
    await userEvent.type(searchInput, 'pan');

    expect(screen.getByText('Comprar pan')).toBeInTheDocument();
    expect(screen.queryByText('Lavar ropa')).not.toBeInTheDocument();
  });

  test('muestra el botón para volver a la lista', () => {
    firebaseFirestore.onSnapshot.mockImplementation((_q, callback) => {
      callback({ docs: [] });
      return jest.fn();
    });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TaskHistory />
      </BrowserRouter>
    );

    expect(screen.getByText('← Volver a la lista')).toBeInTheDocument();
  });
});
