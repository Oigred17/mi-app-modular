import React from 'react';
import { render } from '@testing-library/react';
import IconSun from './IconSun';

describe('IconSun', () => {
    test('se renderiza correctamente con props por defecto', () => {
        const { container } = render(<IconSun />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');
    });

    test('se renderiza con tamaño personalizado', () => {
        const { container } = render(<IconSun size={32} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('width', '32');
        expect(svg).toHaveAttribute('height', '32');
    });

    test('tiene viewBox correcto', () => {
        const { container } = render(<IconSun />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    test('tiene elemento círculo para el centro del sol', () => {
        const { container } = render(<IconSun />);
        const circle = container.querySelector('circle');
        expect(circle).toBeInTheDocument();
        expect(circle).toHaveAttribute('cx', '12');
        expect(circle).toHaveAttribute('cy', '12');
        expect(circle).toHaveAttribute('r', '5');
    });

    test('tiene múltiples elementos de línea para los rayos del sol', () => {
        const { container } = render(<IconSun />);
        const lines = container.querySelectorAll('line');
        expect(lines.length).toBe(8); // 8 sun rays
    });
});
