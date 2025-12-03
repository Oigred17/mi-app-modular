import React from 'react';
import { render, screen } from '@testing-library/react';
import IconMoon from './IconMoon';

describe('IconMoon', () => {
    test('se renderiza correctamente con props por defecto', () => {
        render(<IconMoon />);
        const svg = screen.getByRole('img', { name: /moon/i });
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');
    });

    test('se renderiza con tamaño personalizado', () => {
        render(<IconMoon size={32} />);
        const svg = screen.getByRole('img', { name: /moon/i });
        expect(svg).toHaveAttribute('width', '32');
        expect(svg).toHaveAttribute('height', '32');
    });

    test('tiene viewBox correcto', () => {
        render(<IconMoon />);
        const svg = screen.getByRole('img', { name: /moon/i });
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    test('tiene elemento path de luna', () => {
        render(<IconMoon />);
        const svg = screen.getByRole('img', { name: /moon/i });
        expect(svg).toBeInTheDocument();
    });
});
