import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
  }));
});

test('renders the Aurelia menu shell', async () => {
  render(<App />);
  expect(screen.getByText(/a quiet kind/i)).toBeInTheDocument();
  expect(await screen.findByText(/our menu is being prepared/i)).toBeInTheDocument();
});
