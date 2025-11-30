import React from 'react';
import { render } from '@testing-library/react';
import IconTrash from './IconTrash';

describe('IconTrash', () => {
    test('se renderiza correctamente con props por defecto', () => {
        const { container } = render(<IconTrash />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');
    });

    test('se renderiza con tamaño personalizado', () => {
        const { container } = render(<IconTrash size={20} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('width', '20');
        expect(svg).toHaveAttribute('height', '20');
    });

    test('tiene viewBox correcto', () => {
        const { container } = render(<IconTrash />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    test('tiene elementos de icono de papelera', () => {
        const { container } = render(<IconTrash />);
        const polyline = container.querySelector('polyline');
        const paths = container.querySelectorAll('path');
        const lines = container.querySelectorAll('line');

        expect(polyline).toBeInTheDocument();
        expect(paths.length).toBeGreaterThan(0);
        expect(lines.length).toBe(2); // Two vertical lines in trash can
    });
});
