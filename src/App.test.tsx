
import { render } from '@testing-library/react';
import App from './App';

// Mock the ProjectDetails component
jest.mock('./pages/ProjectDetails', () => () => <div>Mocked ProjectDetails Component</div>);

describe('App Component', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the ProjectDetails component', () => {
    const { getByText } = render(<App />);
    expect(getByText('Mocked ProjectDetails Component')).toBeInTheDocument();
  });
});