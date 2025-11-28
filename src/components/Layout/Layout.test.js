import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';

describe('Layout', () => {
    const TestComponent = () => <div>Test Content</div>;

    const renderWithRouter = () => {
        return render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<TestComponent />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
    };

    test('renders Header component', () => {
        renderWithRouter();
        // Header should contain navigation links
        const navigation = screen.getByRole('navigation');
        expect(navigation).toBeInTheDocument();
    });

    test('renders main element', () => {
        renderWithRouter();
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
    });

    test('renders Outlet content (child routes)', () => {
        renderWithRouter();
        const testContent = screen.getByText('Test Content');
        expect(testContent).toBeInTheDocument();
    });

    test('has correct structure with Header and main', () => {
        const { container } = renderWithRouter();
        const header = container.querySelector('.app-header');
        const main = container.querySelector('main');

        expect(header).toBeInTheDocument();
        expect(main).toBeInTheDocument();
    });
});
