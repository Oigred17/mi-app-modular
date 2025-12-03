import React from 'react';
import { render, screen } from '@testing-library/react';
import IconSun from './IconSun';

describe('IconSun', () => {
    test('se renderiza correctamente con props por defecto', () => {
        render(<IconSun />);
        const svg = screen.getByRole('img', { name: /sun/i });
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');
    });

    test('se renderiza con tamaño personalizado', () => {
        render(<IconSun size={32} />);
        const svg = screen.getByRole('img', { name: /sun/i });
        expect(svg).toHaveAttribute('width', '32');
        expect(svg).toHaveAttribute('height', '32');
    });

    test('tiene viewBox correcto', () => {
        render(<IconSun />);
        const svg = screen.getByRole('img', { name: /sun/i });
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    test('tiene elemento círculo para el centro del sol', () => {
        render(<IconSun />);
        const svg = screen.getByRole('img', { name: /sun/i });
        expect(svg).toBeInTheDocument();
    });

    test('tiene múltiples elementos de línea para los rayos del sol', () => {
        render(<IconSun />);
        const svg = screen.getByRole('img', { name: /sun/i });
        expect(svg).toBeInTheDocument();
    });
});
