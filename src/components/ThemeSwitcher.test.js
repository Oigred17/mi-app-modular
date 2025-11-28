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

    test('renders correctly with light theme', () => {
        renderWithThemeContext('light');
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('theme-switcher-btn');
    });

    test('renders correctly with dark theme', () => {
        renderWithThemeContext('dark');
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    test('shows IconMoon when theme is light', () => {
        const { container } = renderWithThemeContext('light');
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        // IconMoon has a specific path with moon shape
        const path = container.querySelector('path[d*="M21 12.79"]');
        expect(path).toBeInTheDocument();
    });

    test('shows IconSun when theme is dark', () => {
        const { container } = renderWithThemeContext('dark');
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        // IconSun has a circle element
        const circle = container.querySelector('circle');
        expect(circle).toBeInTheDocument();
    });

    test('calls toggleTheme when button is clicked', () => {
        renderWithThemeContext('light');
        const button = screen.getByRole('button');

        fireEvent.click(button);

        expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    test('calls toggleTheme multiple times on multiple clicks', () => {
        renderWithThemeContext('light');
        const button = screen.getByRole('button');

        fireEvent.click(button);
        fireEvent.click(button);
        fireEvent.click(button);

        expect(mockToggleTheme).toHaveBeenCalledTimes(3);
    });
});
