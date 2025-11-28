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

    test('renders correctly', () => {
        renderWithProviders(<Header />);
        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
    });

    test('renders navigation with correct links', () => {
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

    test('renders ThemeSwitcher button', () => {
        renderWithProviders(<Header />);
        const themeSwitcherButton = screen.getByRole('button');
        expect(themeSwitcherButton).toBeInTheDocument();
        expect(themeSwitcherButton).toHaveClass('theme-switcher-btn');
    });

    test('renders logo (IconApp)', () => {
        const { container } = renderWithProviders(<Header />);
        const logo = container.querySelector('.logo');
        expect(logo).toBeInTheDocument();

        const svg = logo.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    test('has correct header structure', () => {
        const { container } = renderWithProviders(<Header />);
        const header = container.querySelector('.app-header');
        expect(header).toBeInTheDocument();

        const logoNav = container.querySelector('.logo-nav');
        expect(logoNav).toBeInTheDocument();
    });
});
