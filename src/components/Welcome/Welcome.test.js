import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Welcome from './Welcome';

// Mock timers for testing the typing effect
jest.useFakeTimers();

describe('Welcome', () => {
    afterEach(() => {
        jest.clearAllTimers();
    });

    test('renders correctly with default name', () => {
        render(<Welcome />);
        const section = screen.getByRole('region', { name: /bienvenida/i });
        expect(section).toBeInTheDocument();
    });

    test('starts with empty text and types progressively', () => {
        render(<Welcome nombre="Test User" />);

        // Initially, the full text should not be there yet
        expect(screen.queryByText('Bienvenido, Test User!')).not.toBeInTheDocument();

        // Fast-forward time to see typing effect
        act(() => {
            jest.advanceTimersByTime(1000); // Advance 1 second
        });

        // Now some text should have appeared
        const consoleLines = screen.getAllByText(/bienvenido/i, { exact: false });
        expect(consoleLines.length).toBeGreaterThan(0);
    });

    test('shows welcome message for regular user', () => {
        render(<Welcome nombre="Regular User" />);

        // Fast-forward enough time for full typing
        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(screen.getByText(/bienvenido, regular user/i)).toBeInTheDocument();
    });

    test('shows special message for Desarrollador', () => {
        render(<Welcome nombre="Desarrollador" />);

        // Fast-forward typing animation
        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(screen.getByText(/eres un crack/i)).toBeInTheDocument();
        expect(screen.getByText(/aplicación modular/i)).toBeInTheDocument();
    });

    test('shows regular message for non-developer', () => {
        render(<Welcome nombre="Usuario" />);

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(screen.getByText(/tareas/i)).toBeInTheDocument();
        expect(screen.getByText(/directorio de usuarios/i)).toBeInTheDocument();
    });

    test('shows link to tasks after typing completes', () => {
        render(<Welcome nombre="Usuario" />);

        // Fast-forward enough time for all typing steps
        act(() => {
            jest.advanceTimersByTime(10000);
        });

        const link = screen.getByRole('link', { name: /ver mis tareas/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '#/tareas');
    });

    test('renders console prompt symbols', () => {
        const { container } = render(<Welcome nombre="Test" />);

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        const prompts = container.querySelectorAll('.console-prompt');
        expect(prompts.length).toBeGreaterThan(0);
    });

    test('renders cursor element during typing', () => {
        const { container } = render(<Welcome nombre="Test" />);

        // Before typing is complete
        const cursor = container.querySelector('.cursor');
        expect(cursor).toBeInTheDocument();
    });

    test('has correct section aria-label', () => {
        render(<Welcome />);
        const section = screen.getByLabelText('Bienvenida');
        expect(section).toBeInTheDocument();
        expect(section.tagName).toBe('SECTION');
    });
});

describe('TypedText component', () => {
    test('types text character by character', () => {
        const testText = "Hello World";
        render(<Welcome nombre={testText} />);

        // Initially empty or just started
        act(() => {
            jest.advanceTimersByTime(100);
        });

        // After some time, partial text
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // Check that some text is appearing progressively
        const consoleContent = screen.getByText(/bienvenido/i, { exact: false });
        expect(consoleContent).toBeInTheDocument();
    });
});
