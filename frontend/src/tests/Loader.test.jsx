import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader from '../components/Loader';

describe('Loader', () => {
  it('renders the default loading label', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders a custom label when provided', () => {
    render(<Loader label="Fetching notes..." />);
    expect(screen.getByText('Fetching notes...')).toBeInTheDocument();
  });
});
