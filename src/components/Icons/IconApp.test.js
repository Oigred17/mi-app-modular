import React from 'react';
import { render, screen } from '@testing-library/react';
import IconApp from './IconApp';

describe('IconApp', () => {
    test('se renderiza correctamente con props por defecto', () => {
        render(<IconApp />);
        const svg = screen.getByRole('img', { name: /mi app/i });
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '36');
        expect(svg).toHaveAttribute('height', '36');
    });

    test('se renderiza con tamaño personalizado', () => {
        render(<IconApp size={48} />);
        const svg = screen.getByRole('img', { name: /mi app/i });
        expect(svg).toHaveAttribute('width', '48');
        expect(svg).toHaveAttribute('height', '48');
    });

    test('se renderiza con título personalizado', () => {
        const customTitle = 'Custom App Title';
        render(<IconApp title={customTitle} />);
        const svg = screen.getByRole('img', { name: customTitle });
        expect(svg).toHaveAttribute('aria-label', customTitle);
    });

    test('tiene viewBox correcto', () => {
        render(<IconApp />);
        const svg = screen.getByRole('img', { name: /mi app/i });
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    test('tiene role="img" para accesibilidad', () => {
        render(<IconApp />);
        const svg = screen.getByRole('img', { name: /mi app/i });
        expect(svg).toHaveAttribute('role', 'img');
    });
});
