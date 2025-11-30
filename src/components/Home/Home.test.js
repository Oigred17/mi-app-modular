import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home', () => {
    test('renderiza el encabezado de bienvenida', () => {
        render(<Home />);
        const heading = screen.getByRole('heading', { name: /bienvenido a la aplicación de demostración/i });
        expect(heading).toBeInTheDocument();
    });

    test('renderiza texto descriptivo', () => {
        render(<Home />);
        const text = screen.getByText(/usa la navegación de arriba/i);
        expect(text).toBeInTheDocument();
    });

    test('menciona Directorio de Usuarios en el texto', () => {
        render(<Home />);
        const text = screen.getByText(/directorio de usuarios/i);
        expect(text).toBeInTheDocument();
    });

    test('menciona Lista de Tareas en el texto', () => {
        render(<Home />);
        const text = screen.getByText(/lista de tareas/i);
        expect(text).toBeInTheDocument();
    });
});
