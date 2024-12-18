
import { render, screen } from '@testing-library/react';
import ProjectDetails from './ProjectDetails';
import { getProjectDetailsFromApi } from '../../api/api';

// Mock the API call
jest.mock('../api/api', () => ({
  getProjectDetailsFromApi: jest.fn(),
}));

// Mock the Table component
jest.mock('../components/Table', () => () => <div>Mocked Table Component</div>);

describe('ProjectDetails Component', () => {
  it('should match the snapshot', async () => {
    (getProjectDetailsFromApi as jest.Mock).mockResolvedValue([
      { "s.no": 1, "amt.pledged": 100, "percentage.funded": 50 },
      { "s.no": 2, "amt.pledged": 200, "percentage.funded": 75 },
    ]);

    const { asFragment } = render(<ProjectDetails />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the Table component', async () => {
    (getProjectDetailsFromApi as jest.Mock).mockResolvedValue([
      { "s.no": 1, "amt.pledged": 100, "percentage.funded": 50 },
      { "s.no": 2, "amt.pledged": 200, "percentage.funded": 75 },
    ]);

    render(<ProjectDetails />);
    expect(screen.getByText('Mocked Table Component')).toBeInTheDocument();
  });
});