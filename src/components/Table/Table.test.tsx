import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import Table from './Table';
import { getProjectDetailsFromApi } from '../../api/api';

jest.mock('../../api/api', () => ({
  getProjectDetailsFromApi: jest.fn(),
}));

describe('Table Component', () => {
  beforeEach(() => {
    (getProjectDetailsFromApi as jest.Mock).mockResolvedValue([
      { "s.no": 1, "amt.pledged": 100, "percentage.funded": 10 },
      { "s.no": 2, "amt.pledged": 200, "percentage.funded": 20 },
      { "s.no": 3, "amt.pledged": 300, "percentage.funded": 30 },
      { "s.no": 4, "amt.pledged": 400, "percentage.funded": 40 },
      { "s.no": 5, "amt.pledged": 500, "percentage.funded": 50 },
      { "s.no": 6, "amt.pledged": 600, "percentage.funded": 60 },
    ]);
  });

  it('matches the snapshot', async () => {
    const { container } = render(<Table />);

    // Wait for async data to be loaded
    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for the microtask queue to clear

    // Snapshot the rendered output
    expect(container).toMatchSnapshot();
  });

  it('renders the table with data', async () => {
    render(<Table />);

    await waitFor(() => screen.getByRole('heading', { name: 'Project Details' }));

    // Verify table rows
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row'); // Includes header and data rows
    expect(rows).toHaveLength(6); // 1 header + 5 data rows

    // Verify specific data in the first row
    const firstRowCells = within(rows[1]).getAllByRole('cell');
    expect(firstRowCells[0]).toHaveTextContent('1'); // S.No
    expect(firstRowCells[1]).toHaveTextContent('10'); // Percentage funded
    expect(firstRowCells[2]).toHaveTextContent('100'); // Amount pledged
  });

  it('renders pagination controls', async () => {
    render(<Table />);

    await waitFor(() => screen.getByRole('heading', { name: 'Project Details' }));

    // Verify pagination container
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('handles pagination correctly', async () => {
    render(<Table />);

    await waitFor(() => screen.getByRole('heading', { name: 'Project Details' }));

    // Verify first page rows
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(6);

    // Verify specific data on the first page
    const firstRowCells = within(rows[1]).getAllByRole('cell');
    expect(firstRowCells[0]).toHaveTextContent('1');

    // Click "Next" button
    const nextButton = screen.getByRole('button', { name: '>' });
    fireEvent.click(nextButton);

    // Wait for the second page to load
    await waitFor(() => {
      const secondPageRows = within(table).getAllByRole('row');
      expect(secondPageRows).toHaveLength(2); // Header + remaining 1 row on page 2
    });

    // Verify data on the second page
    const secondPageFirstRow = within(rows[1]).getAllByRole('cell');
    expect(secondPageFirstRow[0]).not.toHaveTextContent('6');
  });
});
