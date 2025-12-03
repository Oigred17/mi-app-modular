import React from 'react';
import { render, screen } from '@testing-library/react';
import Welcome from './Welcome';

describe('Welcome', () => {
    test('se renderiza correctamente con el nombre por defecto', () => {
        render(<Welcome />);
        const section = screen.getByRole('region', { name: /bienvenida/i });
        expect(section).toBeInTheDocument();
    });

    test('comienza con contenido de consola', () => {
        render(<Welcome nombre="Test User" />);
        const section = screen.getByRole('region', { name: /bienvenida/i });
        expect(section).toBeInTheDocument();
    });

    test('renderiza con usuario regular', () => {
        render(<Welcome nombre="Regular User" />);
        const section = screen.getByRole('region', { name: /bienvenida/i });
        expect(section).toBeInTheDocument();
    });

    test('renderiza estructura correcta de consola', () => {
        render(<Welcome nombre="Test" />);
        const section = screen.getByRole('region', { name: /bienvenida/i });
        expect(section).toHaveClass('welcome-console');
    });

    test('tiene aria-label correcto en la sección', () => {
        render(<Welcome />);
        const section = screen.getByLabelText('Bienvenida');
        expect(section).toBeInTheDocument();
        expect(section.tagName).toBe('SECTION');
    });

    test('renderiza contenido de consola válido', () => {
        render(<Welcome nombre="Test" />);
        const section = screen.getByRole('region', { name: /bienvenida/i });
        expect(section).toBeInTheDocument();
        expect(section).toHaveClass('welcome-console');
    });

    test('aceptan nombres personalizados', () => {
        render(<Welcome nombre="CustomName" />);
        const section = screen.getByRole('region', { name: /bienvenida/i });
        expect(section).toBeInTheDocument();
    });

    test('renderiza correctamente para desarrollador', () => {
        render(<Welcome nombre="Desarrollador" />);
        const section = screen.getByRole('region', { name: /bienvenida/i });
        expect(section).toBeInTheDocument();
    });
});
