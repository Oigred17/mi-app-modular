import React from 'react';
import { render, screen } from '@testing-library/react';
import IconTrash from './IconTrash';

describe('IconTrash', () => {
    test('se renderiza correctamente con props por defecto', () => {
        render(<IconTrash />);
        const svg = screen.getByRole('img', { name: /trash/i });
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');
    });

    test('se renderiza con tamaño personalizado', () => {
        render(<IconTrash size={20} />);
        const svg = screen.getByRole('img', { name: /trash/i });
        expect(svg).toHaveAttribute('width', '20');
        expect(svg).toHaveAttribute('height', '20');
    });

    test('tiene viewBox correcto', () => {
        render(<IconTrash />);
        const svg = screen.getByRole('img', { name: /trash/i });
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    test('tiene elementos de icono de papelera', () => {
        render(<IconTrash />);
        const svg = screen.getByRole('img', { name: /trash/i });
        expect(svg).toBeInTheDocument();
    });
});
