import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home', () => {
    test('renders welcome heading', () => {
        render(<Home />);
        const heading = screen.getByRole('heading', { name: /bienvenido a la aplicación de demostración/i });
        expect(heading).toBeInTheDocument();
    });

    test('renders descriptive text', () => {
        render(<Home />);
        const text = screen.getByText(/usa la navegación de arriba/i);
        expect(text).toBeInTheDocument();
    });

    test('mentions Directorio de Usuarios in text', () => {
        render(<Home />);
        const text = screen.getByText(/directorio de usuarios/i);
        expect(text).toBeInTheDocument();
    });

    test('mentions Lista de Tareas in text', () => {
        render(<Home />);
        const text = screen.getByText(/lista de tareas/i);
        expect(text).toBeInTheDocument();
    });
});
