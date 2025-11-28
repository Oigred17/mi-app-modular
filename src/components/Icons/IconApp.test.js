import React from 'react';
import { render, screen } from '@testing-library/react';
import IconApp from './IconApp';

describe('IconApp', () => {
    test('renders correctly with default props', () => {
        const { container } = render(<IconApp />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '36');
        expect(svg).toHaveAttribute('height', '36');
    });

    test('renders with custom size', () => {
        const { container } = render(<IconApp size={48} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('width', '48');
        expect(svg).toHaveAttribute('height', '48');
    });

    test('renders with custom title', () => {
        const customTitle = 'Custom App Title';
        const { container } = render(<IconApp title={customTitle} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('aria-label', customTitle);
    });

    test('has correct viewBox', () => {
        const { container } = render(<IconApp />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    test('has role="img" for accessibility', () => {
        const { container } = render(<IconApp />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('role', 'img');
    });
});
