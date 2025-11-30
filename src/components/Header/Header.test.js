import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { ThemeProvider } from '../../context/ThemeContext';

describe('Header', () => {
    const renderWithProviders = (component) => {
        return render(
            <BrowserRouter>
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
        const { container } = renderWithProviders(<Header />);
        const logo = container.querySelector('.logo');
        expect(logo).toBeInTheDocument();

        const svg = logo.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    test('tiene la estructura de encabezado correcta', () => {
        const { container } = renderWithProviders(<Header />);
        const header = container.querySelector('.app-header');
        expect(header).toBeInTheDocument();

        const logoNav = container.querySelector('.logo-nav');
        expect(logoNav).toBeInTheDocument();
    });
});
