import { render, screen } from '@test-utils';
import App from './App';

describe('App', () => {
  it('renders the page heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Geriatric care assessment' })).toBeInTheDocument();
  });
});
