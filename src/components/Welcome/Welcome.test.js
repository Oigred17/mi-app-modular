import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Welcome from './Welcome';

describe('Welcome', () => {
    test('se renderiza correctamente con el nombre por defecto', () => {
        render(<Welcome />);
        const section = screen.getByRole('region', { name: /bienvenida/i });
        expect(section).toBeInTheDocument();
    });

    test('comienza con texto vacío y escribe progresivamente', async () => {
        render(<Welcome nombre="Test User" />);

        await waitFor(() => {
            expect(screen.getByText(/bienvenido/i)).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    test('muestra mensaje de bienvenida para usuario regular', async () => {
        render(<Welcome nombre="Regular User" />);

        await waitFor(() => {
            expect(screen.getByText(/bienvenido, regular user/i)).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    test('muestra enlace a tareas después de completar la escritura', async () => {
        render(<Welcome nombre="Usuario" />);

        await waitFor(() => {
            const link = screen.getByRole('link', { name: /ver mis tareas/i });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', '#/tareas');
        }, { timeout: 15000 });
    });

    test('renderiza símbolos de prompt de consola', async () => {
        const { container } = render(<Welcome nombre="Test" />);

        await waitFor(() => {
            const prompts = container.querySelectorAll('.console-prompt');
            expect(prompts.length).toBeGreaterThan(0);
        }, { timeout: 2000 });
    });

    test('renderiza elemento cursor durante la escritura', () => {
        const { container } = render(<Welcome nombre="Test" />);

        const cursor = container.querySelector('.cursor');
        expect(cursor).toBeInTheDocument();
    });

    test('tiene aria-label correcto en la sección', () => {
        render(<Welcome />);
        const section = screen.getByLabelText('Bienvenida');
        expect(section).toBeInTheDocument();
        expect(section.tagName).toBe('SECTION');
    });
});

describe('TypedText component', () => {
    test('escribe texto carácter por carácter', async () => {
        const testText = "Hello World";
        render(<Welcome nombre={testText} />);


        await waitFor(() => {
            expect(screen.getByText(/bienvenido/i)).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});
