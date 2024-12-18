import { getProjectDetailsFromApi } from './api';

describe('getProjectDetailsFromApi', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch project details successfully', async () => {
    const mockData = { key: 'value' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const data = await getProjectDetailsFromApi();
    expect(data).toEqual(mockData);
  });

  it('should throw an error if fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Error getting data'));

    await expect(getProjectDetailsFromApi()).rejects.toThrow('Error getting data');
  });

  it('should throw an error if JSON parsing fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockRejectedValue(new Error('Error parsing JSON data')),
    });

    await expect(getProjectDetailsFromApi()).rejects.toThrow('Error parsing JSON data');
  });
});