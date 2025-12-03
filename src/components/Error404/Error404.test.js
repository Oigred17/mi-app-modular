import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Error404 from './Error404';

describe('Error404', () => {
    const renderWithRouter = (component) => {
        return render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                {component}
            </BrowserRouter>
        );
    };

    test('renderiza mensaje 404', () => {
        renderWithRouter(<Error404 />);
        const errorElement = screen.getByText('404');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveClass('glitch');
    });

    test('renderiza mensaje "Página no encontrada"', () => {
        renderWithRouter(<Error404 />);
        const message = screen.getByText(/página no encontrada/i);
        expect(message).toBeInTheDocument();
        expect(message).toHaveClass('error-message');
    });

    test('renderiza enlace para volver al inicio', () => {
        renderWithRouter(<Error404 />);
        const homeLink = screen.getByRole('link', { name: /volver al inicio/i });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/');
    });

    test('tiene la clase de contenedor correcta', () => {
        renderWithRouter(<Error404 />);
        // Verificar que todos los elementos del contenedor están presentes
        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByText(/página no encontrada/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /volver al inicio/i })).toBeInTheDocument();
    });
});
