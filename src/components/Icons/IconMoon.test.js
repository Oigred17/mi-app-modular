import React from 'react';
import { render } from '@testing-library/react';
import IconMoon from './IconMoon';

describe('IconMoon', () => {
    test('se renderiza correctamente con props por defecto', () => {
        const { container } = render(<IconMoon />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');
    });

    test('se renderiza con tamaño personalizado', () => {
        const { container } = render(<IconMoon size={32} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('width', '32');
        expect(svg).toHaveAttribute('height', '32');
    });

    test('tiene viewBox correcto', () => {
        const { container } = render(<IconMoon />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    test('tiene elemento path de luna', () => {
        const { container } = render(<IconMoon />);
        const path = container.querySelector('path');
        expect(path).toBeInTheDocument();
        expect(path).toHaveAttribute('d', 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z');
    });
});
