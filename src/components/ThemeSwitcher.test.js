import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitcher from './ThemeSwitcher';
import ThemeContext from '../context/ThemeContext';

describe('ThemeSwitcher', () => {
    const mockToggleTheme = jest.fn();

    const renderWithThemeContext = (theme) => {
        return render(
            <ThemeContext.Provider value={{ theme, toggleTheme: mockToggleTheme }}>
                <ThemeSwitcher />
            </ThemeContext.Provider>
        );
    };

    beforeEach(() => {
        mockToggleTheme.mockClear();
    });

    test('se renderiza correctamente con el tema claro', () => {
        renderWithThemeContext('light');
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('theme-switcher-btn');
    });

    test('se renderiza correctamente con el tema oscuro', () => {
        renderWithThemeContext('dark');
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    test('muestra IconMoon cuando el tema es claro', () => {
        const { container } = renderWithThemeContext('light');
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        // IconMoon has a specific path with moon shape
        const path = container.querySelector('path[d*="M21 12.79"]');
        expect(path).toBeInTheDocument();
    });

    test('muestra IconSun cuando el tema es oscuro', () => {
        const { container } = renderWithThemeContext('dark');
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        // IconSun has a circle element
        const circle = container.querySelector('circle');
        expect(circle).toBeInTheDocument();
    });

    test('llama a toggleTheme cuando se hace clic en el botón', () => {
        renderWithThemeContext('light');
        const button = screen.getByRole('button');

        fireEvent.click(button);

        expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    test('llama a toggleTheme múltiples veces en múltiples clics', () => {
        renderWithThemeContext('light');
        const button = screen.getByRole('button');

        fireEvent.click(button);
        fireEvent.click(button);
        fireEvent.click(button);

        expect(mockToggleTheme).toHaveBeenCalledTimes(3);
    });
});
