import React from 'react';
import { render, screen } from '@testing-library/react';
import IconApp from './IconApp';

describe('IconApp', () => {
    test('se renderiza correctamente con props por defecto', () => {
        const { container } = render(<IconApp />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '36');
        expect(svg).toHaveAttribute('height', '36');
    });

    test('se renderiza con tamaño personalizado', () => {
        const { container } = render(<IconApp size={48} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('width', '48');
        expect(svg).toHaveAttribute('height', '48');
    });

    test('se renderiza con título personalizado', () => {
        const customTitle = 'Custom App Title';
        const { container } = render(<IconApp title={customTitle} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('aria-label', customTitle);
    });

    test('tiene viewBox correcto', () => {
        const { container } = render(<IconApp />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    test('tiene role="img" para accesibilidad', () => {
        const { container } = render(<IconApp />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('role', 'img');
    });
});
