import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
  }));
});

test('renders the Aurelia menu shell', async () => {
  window.location.hash = '';
  localStorage.clear();
  render(<App />);
  expect(screen.getByText(/тихият вид/i)).toBeInTheDocument();
  expect(await screen.findByText(/менюто ни се подготвя/i)).toBeInTheDocument();
});
