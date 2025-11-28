import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserDirectory from './UserDirectory';

// Mock global fetch
global.fetch = jest.fn();

describe('UserDirectory', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('shows loading message initially', () => {
        fetch.mockImplementation(() => new Promise(() => { })); // Never resolves

        render(<UserDirectory />);
        expect(screen.getByText(/cargando usuarios/i)).toBeInTheDocument();
    });

    test('renders user list when fetch is successful', async () => {
        const mockUsers = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                website: 'john.example.com'
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
                website: 'jane.example.com'
            }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUsers
        });

        render(<UserDirectory />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
        expect(screen.getByText(/john.example.com/i)).toBeInTheDocument();

        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument();
        expect(screen.getByText(/jane.example.com/i)).toBeInTheDocument();
    });

    test('renders heading', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => []
        });

        render(<UserDirectory />);

        const heading = screen.getByRole('heading', { name: /directorio de usuarios/i });
        expect(heading).toBeInTheDocument();
    });

    test('displays error message when fetch fails', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        render(<UserDirectory />);

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });

        expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    test('displays error when response is not ok', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({})
        });

        render(<UserDirectory />);

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });
    });

    test('does not show loading message after data is loaded', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [{ id: 1, name: 'Test User', email: 'test@test.com', website: 'test.com' }]
        });

        render(<UserDirectory />);

        await waitFor(() => {
            expect(screen.queryByText(/cargando usuarios/i)).not.toBeInTheDocument();
        });
    });

    test('renders users in list format', async () => {
        const mockUsers = [
            { id: 1, name: 'User 1', email: 'user1@test.com', website: 'user1.com' }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUsers
        });

        const { container } = render(<UserDirectory />);

        await waitFor(() => {
            expect(screen.getByText('User 1')).toBeInTheDocument();
        });

        const userCard = container.querySelector('.user-card');
        expect(userCard).toBeInTheDocument();
    });
});
