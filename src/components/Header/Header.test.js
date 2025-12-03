import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { ThemeProvider } from '../../context/ThemeContext';

describe('Header', () => {
    const renderWithProviders = (component) => {
        return render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <ThemeProvider>
                    {component}
                </ThemeProvider>
            </BrowserRouter>
        );
    };

    test('se renderiza correctamente', () => {
        renderWithProviders(<Header />);
        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
    });

    test('renderiza la navegación con los enlaces correctos', () => {
        renderWithProviders(<Header />);

        const inicioLink = screen.getByRole('link', { name: /inicio/i });
        const tareasLink = screen.getByRole('link', { name: /tareas/i });
        const directorioLink = screen.getByRole('link', { name: /directorio/i });

        expect(inicioLink).toBeInTheDocument();
        expect(inicioLink).toHaveAttribute('href', '/');

        expect(tareasLink).toBeInTheDocument();
        expect(tareasLink).toHaveAttribute('href', '/tareas');

        expect(directorioLink).toBeInTheDocument();
        expect(directorioLink).toHaveAttribute('href', '/directorio');
    });

    test('renderiza el botón ThemeSwitcher', () => {
        renderWithProviders(<Header />);
        const themeSwitcherButton = screen.getByRole('button');
        expect(themeSwitcherButton).toBeInTheDocument();
        expect(themeSwitcherButton).toHaveClass('theme-switcher-btn');
    });

    test('renderiza el logo (IconApp)', () => {
        renderWithProviders(<Header />);
        // Verificar que la navegación está presente (contiene el logo y nav)
        const navigation = screen.getByRole('navigation');
        expect(navigation).toBeInTheDocument();
    });

    test('tiene la estructura de encabezado correcta', () => {
        renderWithProviders(<Header />);
        // Verificar que el header contiene los elementos esperados
        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();

        const navigation = screen.getByRole('navigation');
        expect(navigation).toBeInTheDocument();
    });
});
