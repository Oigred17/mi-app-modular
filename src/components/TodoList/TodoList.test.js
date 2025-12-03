import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TodoList from './TodoList';
import * as firebaseFirestore from 'firebase/firestore';

// Mock firebase
jest.mock('../../firebaseConfig', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
  doc: jest.fn(),
  serverTimestamp: jest.fn(),
  writeBatch: jest.fn()
}));

describe('TodoList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el componente con título', () => {
    firebaseFirestore.onSnapshot.mockImplementation((query, callback) => {
      callback({ forEach: jest.fn() });
      return jest.fn();
    });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TodoList />
      </BrowserRouter>
    );

    expect(screen.getByText('Mi Lista de Tareas')).toBeInTheDocument();
  });

  test('renderiza la lista de tareas', async () => {
    const mockTasks = [
      { id: '1', text: 'Tarea 1', completed: false },
      { id: '2', text: 'Tarea 2', completed: true }
    ];

    firebaseFirestore.onSnapshot.mockImplementation((query, callback) => {
      callback({
        forEach: (fn) => {
          mockTasks.forEach(task => {
            fn({
              id: task.id,
              data: () => task
            });
          });
        }
      });
      return jest.fn();
    });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TodoList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Tarea 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Tarea 2')).toBeInTheDocument();
  });

  test('muestra el campo de entrada y botón', () => {
    firebaseFirestore.onSnapshot.mockImplementation((query, callback) => {
      callback({ forEach: jest.fn() });
      return jest.fn();
    });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TodoList />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Añade una nueva tarea...')).toBeInTheDocument();
    expect(screen.getByText('Añadir')).toBeInTheDocument();
  });

  test('muestra el botón para ver historial', () => {
    firebaseFirestore.onSnapshot.mockImplementation((query, callback) => {
      callback({ forEach: jest.fn() });
      return jest.fn();
    });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TodoList />
      </BrowserRouter>
    );

    expect(screen.getByText('Ver Historial')).toBeInTheDocument();
  });

  test('renderiza checkboxes para las tareas', async () => {
    const mockTasks = [
      { id: '1', text: 'Tarea 1', completed: false },
      { id: '2', text: 'Tarea 2', completed: true }
    ];

    firebaseFirestore.onSnapshot.mockImplementation((query, callback) => {
      callback({
        forEach: (fn) => {
          mockTasks.forEach(task => {
            fn({
              id: task.id,
              data: () => task
            });
          });
        }
      });
      return jest.fn();
    });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TodoList />
      </BrowserRouter>
    );

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBe(2);
    });

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[1]).toBeChecked(); // Segunda tarea está completada
  });

  test('renderiza botones de eliminar para cada tarea', async () => {
    const mockTasks = [
      { id: '1', text: 'Tarea 1', completed: false },
      { id: '2', text: 'Tarea 2', completed: true }
    ];

    firebaseFirestore.onSnapshot.mockImplementation((query, callback) => {
      callback({
        forEach: (fn) => {
          mockTasks.forEach(task => {
            fn({
              id: task.id,
              data: () => task
            });
          });
        }
      });
      return jest.fn();
    });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TodoList />
      </BrowserRouter>
    );

  });
});
