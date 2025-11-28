import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TodoList from './TodoList';

// Mock Firebase
jest.mock('../../firebaseConfig');

const {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    serverTimestamp,
    writeBatch
} = require('../../firebaseConfig');

describe('TodoList', () => {
    let mockUnsubscribe;
    let mockBatch;

    beforeEach(() => {
        mockUnsubscribe = jest.fn();
        mockBatch = {
            set: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            commit: jest.fn(() => Promise.resolve())
        };

        // Reset all mocks
        collection.mockClear();
        query.mockClear();
        orderBy.mockClear();
        onSnapshot.mockClear();
        doc.mockClear();
        serverTimestamp.mockClear();
        writeBatch.mockClear();

        // Setup default mock implementations
        collection.mockReturnValue({ _collectionName: 'tasks' });
        query.mockReturnValue({ _query: 'mocked' });
        orderBy.mockReturnValue({ _orderBy: 'createdAt' });
        onSnapshot.mockReturnValue(mockUnsubscribe);
        doc.mockReturnValue({ _collection: 'tasks', id: 'mock-id' });
        serverTimestamp.mockReturnValue({ seconds: Date.now() / 1000 });
        writeBatch.mockReturnValue(mockBatch);

        // Clear global alert mock
        global.alert = jest.fn();
    });

    const renderWithRouter = (component) => {
        return render(<BrowserRouter>{component}</BrowserRouter>);
    };

    test('renders heading', () => {
        renderWithRouter(<TodoList />);
        const heading = screen.getByRole('heading', { name: /mi lista de tareas/i });
        expect(heading).toBeInTheDocument();
    });

    test('renders add task form', () => {
        renderWithRouter(<TodoList />);
        const input = screen.getByPlaceholderText(/añade una nueva tarea/i);
        const button = screen.getByRole('button', { name: /añadir/i });

        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    test('renders link to history', () => {
        renderWithRouter(<TodoList />);
        const link = screen.getByRole('link', { name: /ver historial/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/historial');
    });

    test('displays tasks from Firestore', () => {
        // Mock onSnapshot to call callback with mock data
        onSnapshot.mockImplementation((q, callback) => {
            const mockQuerySnapshot = {
                forEach: (fn) => {
                    fn({
                        id: 'task-1',
                        data: () => ({ text: 'Test Task', completed: false, createdAt: {} })
                    });
                }
            };
            callback(mockQuerySnapshot);
            return mockUnsubscribe;
        });

        renderWithRouter(<TodoList />);

        expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    test('allows user to type in input field', () => {
        renderWithRouter(<TodoList />);
        const input = screen.getByPlaceholderText(/añade una nueva tarea/i);

        fireEvent.change(input, { target: { value: 'Nueva tarea' } });

        expect(input.value).toBe('Nueva tarea');
    });

    test('adds new task when form is submitted', async () => {
        renderWithRouter(<TodoList />);
        const input = screen.getByPlaceholderText(/añade una nueva tarea/i);
        const form = input.closest('form');

        fireEvent.change(input, { target: { value: 'Nueva tarea' } });
        fireEvent.submit(form);

        await waitFor(() => {
            expect(writeBatch).toHaveBeenCalled();
        });

        expect(mockBatch.set).toHaveBeenCalled();
        expect(mockBatch.commit).toHaveBeenCalled();
    });

    test('does not add empty task', () => {
        renderWithRouter(<TodoList />);
        const input = screen.getByPlaceholderText(/añade una nueva tarea/i);
        const form = input.closest('form');

        fireEvent.change(input, { target: { value: '   ' } });
        fireEvent.submit(form);

        expect(writeBatch).not.toHaveBeenCalled();
    });

    test('clears input after adding task', async () => {
        renderWithRouter(<TodoList />);
        const input = screen.getByPlaceholderText(/añade una nueva tarea/i);
        const form = input.closest('form');

        fireEvent.change(input, { target: { value: 'Nueva tarea' } });
        fireEvent.submit(form);

        await waitFor(() => {
            expect(input.value).toBe('');
        });
    });

    test('renders checkbox for each task', () => {
        onSnapshot.mockImplementation((q, callback) => {
            const mockQuerySnapshot = {
                forEach: (fn) => {
                    fn({
                        id: 'task-1',
                        data: () => ({ text: 'Test Task', completed: false })
                    });
                }
            };
            callback(mockQuerySnapshot);
            return mockUnsubscribe;
        });

        renderWithRouter(<TodoList />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
    });

    test('renders completed task with checked checkbox', () => {
        onSnapshot.mockImplementation((q, callback) => {
            const mockQuerySnapshot = {
                forEach: (fn) => {
                    fn({
                        id: 'task-1',
                        data: () => ({ text: 'Completed Task', completed: true })
                    });
                }
            };
            callback(mockQuerySnapshot);
            return mockUnsubscribe;
        });

        renderWithRouter(<TodoList />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    test('toggles task completion when checkbox is clicked', async () => {
        onSnapshot.mockImplementation((q, callback) => {
            const mockQuerySnapshot = {
                forEach: (fn) => {
                    fn({
                        id: 'task-1',
                        data: () => ({ text: 'Test Task', completed: false })
                    });
                }
            };
            callback(mockQuerySnapshot);
            return mockUnsubscribe;
        });

        renderWithRouter(<TodoList />);

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        await waitFor(() => {
            expect(mockBatch.update).toHaveBeenCalled();
        });
    });

    test('shows alert when trying to delete incomplete task', async () => {
        onSnapshot.mockImplementation((q, callback) => {
            const mockQuerySnapshot = {
                forEach: (fn) => {
                    fn({
                        id: 'task-1',
                        data: () => ({ text: 'Incomplete Task', completed: false })
                    });
                }
            };
            callback(mockQuerySnapshot);
            return mockUnsubscribe;
        });

        renderWithRouter(<TodoList />);

        const deleteButton = screen.getByRole('button', { name: '' }); // IconTrash has no text
        fireEvent.click(deleteButton);

        expect(global.alert).toHaveBeenCalledWith('No puedes eliminar una tarea que no ha sido completada.');
        expect(mockBatch.delete).not.toHaveBeenCalled();
    });

    test('deletes completed task', async () => {
        onSnapshot.mockImplementation((q, callback) => {
            const mockQuerySnapshot = {
                forEach: (fn) => {
                    fn({
                        id: 'task-1',
                        data: () => ({ text: 'Completed Task', completed: true })
                    });
                }
            };
            callback(mockQuerySnapshot);
            return mockUnsubscribe;
        });

        renderWithRouter(<TodoList />);

        const deleteButtons = screen.getAllByRole('button');
        const deleteButton = deleteButtons.find(btn => btn.className.includes('delete-btn'));

        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(mockBatch.delete).toHaveBeenCalled();
            expect(mockBatch.commit).toHaveBeenCalled();
        });
    });

    test('unsubscribes from Firestore on unmount', () => {
        const { unmount } = renderWithRouter(<TodoList />);

        unmount();

        expect(mockUnsubscribe).toHaveBeenCalled();
    });
});
