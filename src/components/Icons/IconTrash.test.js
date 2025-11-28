import React from 'react';
import { render } from '@testing-library/react';
import IconTrash from './IconTrash';

describe('IconTrash', () => {
    test('renders correctly with default props', () => {
        const { container } = render(<IconTrash />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');
    });

    test('renders with custom size', () => {
        const { container } = render(<IconTrash size={20} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('width', '20');
        expect(svg).toHaveAttribute('height', '20');
    });

    test('has correct viewBox', () => {
        const { container } = render(<IconTrash />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    test('has trash can icon elements', () => {
        const { container } = render(<IconTrash />);
        const polyline = container.querySelector('polyline');
        const paths = container.querySelectorAll('path');
        const lines = container.querySelectorAll('line');

        expect(polyline).toBeInTheDocument();
        expect(paths.length).toBeGreaterThan(0);
        expect(lines.length).toBe(2); // Two vertical lines in trash can
    });
});
