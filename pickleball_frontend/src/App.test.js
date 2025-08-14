import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';

test('renders app brand name', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
  const brandElement = screen.getByText(/PicklePlay/i);
  expect(brandElement).toBeInTheDocument();
});
