import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserDirectory from './UserDirectory';

// Mock global fetch
global.fetch = jest.fn();

describe('UserDirectory', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('muestra mensaje de carga inicialmente', () => {
        fetch.mockImplementation(() => new Promise(() => { })); // Never resolves

        render(<UserDirectory />);
        expect(screen.getByText(/cargando usuarios/i)).toBeInTheDocument();
    });

    test('renderiza la lista de usuarios cuando la petición es exitosa', async () => {
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

        await waitFor(
            () => {
                expect(screen.getByText('John Doe')).toBeInTheDocument();
            },
            { timeout: 3000 }
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
        // Use getAllByText since the domain appears in both email and website
        expect(screen.getAllByText(/john.example.com/i).length).toBeGreaterThan(0);

        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument();
        // Use getAllByText since the domain appears in both email and website
        expect(screen.getAllByText(/jane.example.com/i).length).toBeGreaterThan(0);
    });

    test('renderiza el encabezado', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => []
        });

        render(<UserDirectory />);

        const heading = screen.getByRole('heading', { name: /directorio de usuarios/i });
        expect(heading).toBeInTheDocument();
    });

    test('muestra mensaje de error cuando la petición falla', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        render(<UserDirectory />);

        await waitFor(
            () => {
                expect(screen.getByText(/error/i)).toBeInTheDocument();
            },
            { timeout: 3000 }
        );

        expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    test('muestra error cuando la respuesta no es ok', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({})
        });

        render(<UserDirectory />);

        await waitFor(
            () => {
                expect(screen.getByText(/error/i)).toBeInTheDocument();
            },
            { timeout: 3000 }
        );
    });

    test('no muestra mensaje de carga después de cargar los datos', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [{ id: 1, name: 'Test User', email: 'test@test.com', website: 'test.com' }]
        });

        render(<UserDirectory />);

        await waitFor(
            () => {
                expect(screen.queryByText(/cargando usuarios/i)).not.toBeInTheDocument();
            },
            { timeout: 3000 }
        );
    });

    test('renderiza usuarios en formato de lista', async () => {
        const mockUsers = [
            { id: 1, name: 'User 1', email: 'user1@test.com', website: 'user1.com' }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUsers
        });

        render(<UserDirectory />);

        await waitFor(
            () => {
                expect(screen.getByText('User 1')).toBeInTheDocument();
            },
            { timeout: 3000 }
        );

        // Verify we have user list items rendered
        const userCards = screen.queryAllByRole('listitem');
        expect(userCards.length).toBeGreaterThan(0);
    });
});
