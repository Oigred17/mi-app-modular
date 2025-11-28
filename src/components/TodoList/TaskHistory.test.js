import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TaskHistory from './TaskHistory';

// Mock Firebase
jest.mock('../../firebaseConfig');

const { collection, query, orderBy, onSnapshot } = require('../../firebaseConfig');

describe('TaskHistory', () => {
    let mockUnsubscribe;

    beforeEach(() => {
        mockUnsubscribe = jest.fn();

        // Reset all mocks
        collection.mockClear();
        query.mockClear();
        orderBy.mockClear();
        onSnapshot.mockClear();

        // Setup default mock implementations
        collection.mockReturnValue({ _collectionName: 'task_audit_log' });
        query.mockReturnValue({ _query: 'mocked' });
        orderBy.mockReturnValue({ _orderBy: 'timestamp' });
        onSnapshot.mockReturnValue(mockUnsubscribe);
    });

    const renderWithRouter = (component) => {
        return render(<BrowserRouter>{component}</BrowserRouter>);
    };

    test('renders heading', () => {
        renderWithRouter(<TaskHistory />);
        const heading = screen.getByRole('heading', { name: /historial de tareas/i });
        expect(heading).toBeInTheDocument();
    });

    test('shows loading message initially', () => {
        onSnapshot.mockImplementation(() => mockUnsubscribe);

        renderWithRouter(<TaskHistory />);
        expect(screen.getByText(/cargando historial/i)).toBeInTheDocument();
    });

    test('renders back link', () => {
        renderWithRouter(<TaskHistory />);
        const backLink = screen.getByRole('link', { name: /volver a la lista/i });
        expect(backLink).toBeInTheDocument();
        expect(backLink).toHaveAttribute('href', '/tareas');
    });

    test('renders search input', () => {
        renderWithRouter(<TaskHistory />);
        const searchInput = screen.getByPlaceholderText(/buscar en el historial/i);
        expect(searchInput).toBeInTheDocument();
    });

    test('displays history logs from Firestore', () => {
        onSnapshot.mockImplementation((q, callback) => {
            const mockDocs = [
                {
                    id: 'log-1',
                    data: () => ({
                        taskId: 'task-1',
                        action: 'CREATED',
                        timestamp: { seconds: Date.now() / 1000, toDate: () => new Date() },
                        data: { text: 'Test Task', completed: false }
                    })
                }
            ];

            const mockQuerySnapshot = {
                docs: mockDocs
            };

            callback(mockQuerySnapshot);
            return mockUnsubscribe;
        });

        renderWithRouter(<TaskHistory />);

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('CREADO')).toBeInTheDocument();
    });

    test('translates action CREATED to CREADO', () => {
        onSnapshot.mockImplementation((q, callback) => {
            const mockDocs = [{
                id: 'log-1',
                data: () => ({
                    taskId: 'task-1',
                    action: 'CREATED',
                    timestamp: { seconds: Date.now() / 1000, toDate: () => new Date() },
                    data: { text: 'Task', completed: false }
                })
            }];

            callback({ docs: mockDocs });
            return mockUnsubscribe;
        });

        renderWithRouter(<TaskHistory />);
        expect(screen.getByText('CREADO')).toBeInTheDocument();
    });

    test('translates action COMPLETED to COMPLETADO', () => {
        onSnapshot.mockImplementation((q, callback) => {
            const mockDocs = [{
                id: 'log-1',
                data: () => ({
                    taskId: 'task-1',
                    action: 'COMPLETED',
                    timestamp: { seconds: Date.now() / 1000, toDate: () => new Date() },
                    data: { text: 'Task', completed: true }
                })
            }];

            callback({ docs: mockDocs });
            return mockUnsubscribe;
        });

        renderWithRouter(<TaskHistory />);
        expect(screen.getByText('COMPLETADO')).toBeInTheDocument();
    });

    test('translates action DELETED to ELIMINADO', () => {
        onSnapshot.mockImplementation((q, callback) => {
            const mockDocs = [{
                id: 'log-1',
                data: () => ({
                    taskId: 'task-1',
                    action: 'DELETED',
                    timestamp: { seconds: Date.now() / 1000, toDate: () => new Date() },
                    data: { text: 'Task', completed: true }
                })
            }];

            callback({ docs: mockDocs });
            return mockUnsubscribe;
        });

        renderWithRouter(<TaskHistory />);
        expect(screen.getByText('ELIMINADO')).toBeInTheDocument();
    });

    test('filters history by search term', () => {
        onSnapshot.mockImplementation((q, callback) => {
            const mockDocs = [
                {
                    id: 'log-1',
                    data: () => ({
                        taskId: 'task-1',
                        action: 'CREATED',
                        timestamp: { seconds: Date.now() / 1000, toDate: () => new Date() },
                        data: { text: 'Buy groceries', completed: false }
                    })
                },
                {
                    id: 'log-2',
                    data: () => ({
                        taskId: 'task-2',
                        action: 'COMPLETED',
                        timestamp: { seconds: Date.now() / 1000, toDate: () => new Date() },
                        data: { text: 'Write code', completed: true }
                    })
                }
            ];

            callback({ docs: mockDocs });
            return mockUnsubscribe;
        });

        renderWithRouter(<TaskHistory />);

        const searchInput = screen.getByPlaceholderText(/buscar en el historial/i);

        // Initially both tasks should be visible
        expect(screen.getByText('Buy groceries')).toBeInTheDocument();
        expect(screen.getByText('Write code')).toBeInTheDocument();

        // Filter by 'groceries'
        fireEvent.change(searchInput, { target: { value: 'groceries' } });

        expect(screen.getByText('Buy groceries')).toBeInTheDocument();
        expect(screen.queryByText('Write code')).not.toBeInTheDocument();
    });

    test('groups multiple logs by taskId and shows latest', () => {
        onSnapshot.mockImplementation((q, callback) => {
            const mockDocs = [
                {
                    id: 'log-1',
                    data: () => ({
                        taskId: 'task-1',
                        action: 'CREATED',
                        timestamp: { seconds: 1000, toDate: () => new Date(1000000) },
                        data: { text: 'Task 1', completed: false }
                    })
                },
                {
                    id: 'log-2',
                    data: () => ({
                        taskId: 'task-1',
                        action: 'COMPLETED',
                        timestamp: { seconds: 2000, toDate: () => new Date(2000000) },
                        data: { text: 'Task 1', completed: true }
                    })
                }
            ];

            callback({ docs: mockDocs });
            return mockUnsubscribe;
        });

        renderWithRouter(<TaskHistory />);

        // Should show the task only once with the latest action
        const taskTexts = screen.getAllByText('Task 1');
        expect(taskTexts.length).toBe(1);
        expect(screen.getByText('COMPLETADO')).toBeInTheDocument();
    });

    test('formats timestamp correctly', () => {
        const testDate = new Date('2024-01-15T10:30:00');

        onSnapshot.mockImplementation((q, callback) => {
            const mockDocs = [{
                id: 'log-1',
                data: () => ({
                    taskId: 'task-1',
                    action: 'CREATED',
                    timestamp: {
                        seconds: testDate.getTime() / 1000,
                        toDate: () => testDate
                    },
                    data: { text: 'Task', completed: false }
                })
            }];

            callback({ docs: mockDocs });
            return mockUnsubscribe;
        });

        const { container } = renderWithRouter(<TaskHistory />);

        const timestamp = container.querySelector('.history-timestamp');
        expect(timestamp).toBeInTheDocument();
        expect(timestamp.textContent).toBeTruthy();
    });

    test('unsubscribes from Firestore on unmount', () => {
        const { unmount } = renderWithRouter(<TaskHistory />);

        unmount();

        expect(mockUnsubscribe).toHaveBeenCalled();
    });

    test('hides loading message after data loads', () => {
        onSnapshot.mockImplementation((q, callback) => {
            const mockDocs = [{
                id: 'log-1',
                data: () => ({
                    taskId: 'task-1',
                    action: 'CREATED',
                    timestamp: { seconds: Date.now() / 1000, toDate: () => new Date() },
                    data: { text: 'Task', completed: false }
                })
            }];

            callback({ docs: mockDocs });
            return mockUnsubscribe;
        });

        renderWithRouter(<TaskHistory />);

        expect(screen.queryByText(/cargando historial/i)).not.toBeInTheDocument();
    });
});
