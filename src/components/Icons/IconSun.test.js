import React from 'react';
import { render } from '@testing-library/react';
import IconSun from './IconSun';

describe('IconSun', () => {
    test('renders correctly with default props', () => {
        const { container } = render(<IconSun />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');
    });

    test('renders with custom size', () => {
        const { container } = render(<IconSun size={32} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('width', '32');
        expect(svg).toHaveAttribute('height', '32');
    });

    test('has correct viewBox', () => {
        const { container } = render(<IconSun />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    test('has circle element for sun center', () => {
        const { container } = render(<IconSun />);
        const circle = container.querySelector('circle');
        expect(circle).toBeInTheDocument();
        expect(circle).toHaveAttribute('cx', '12');
        expect(circle).toHaveAttribute('cy', '12');
        expect(circle).toHaveAttribute('r', '5');
    });

    test('has multiple line elements for sun rays', () => {
        const { container } = render(<IconSun />);
        const lines = container.querySelectorAll('line');
        expect(lines.length).toBe(8); // 8 sun rays
    });
});
