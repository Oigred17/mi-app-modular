import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Error404 from './Error404';

describe('Error404', () => {
    const renderWithRouter = (component) => {
        return render(<BrowserRouter>{component}</BrowserRouter>);
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
        const { container } = renderWithRouter(<Error404 />);
        const errorContainer = container.querySelector('.error-container');
        expect(errorContainer).toBeInTheDocument();
    });
});
