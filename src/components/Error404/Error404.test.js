import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Error404 from './Error404';

describe('Error404', () => {
    const renderWithRouter = (component) => {
        return render(<BrowserRouter>{component}</BrowserRouter>);
    };

    test('renders 404 message', () => {
        renderWithRouter(<Error404 />);
        const errorElement = screen.getByText('404');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveClass('glitch');
    });

    test('renders "Página no encontrada" message', () => {
        renderWithRouter(<Error404 />);
        const message = screen.getByText(/página no encontrada/i);
        expect(message).toBeInTheDocument();
        expect(message).toHaveClass('error-message');
    });

    test('renders link to go back home', () => {
        renderWithRouter(<Error404 />);
        const homeLink = screen.getByRole('link', { name: /volver al inicio/i });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/');
    });

    test('has correct container class', () => {
        const { container } = renderWithRouter(<Error404 />);
        const errorContainer = container.querySelector('.error-container');
        expect(errorContainer).toBeInTheDocument();
    });
});
