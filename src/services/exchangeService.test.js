const axios = require('axios');
const {
  fetchExchangeRate,
  fetchAllExchangeRates,
  saveNewExchangeRate,
  rateCache,
  customRates, 
} = require('./exchangeService');

jest.mock('axios'); // Mock axios to avoid actual API calls

describe('Exchange Service', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
    rateCache.flushAll(); // Clear all cached rates
    for (const key in customRates) {
      delete customRates[key]; // Reset custom rates after each test
    }
  });

  describe('fetchExchangeRate', () => {
    it('should return a cached rate if it exists', async () => {
      rateCache.set('USD_EUR', 0.85); // Set a cached rate
      const rate = await fetchExchangeRate('USD', 'EUR');
      expect(rate).toBe(0.85); // Check if the cached rate is returned
    });

    it('should fetch a rate from the API if not cached', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          conversion_rates: {
            USD: 1,
            EUR: 0.85,
          },
        },
      });
      const rate = await fetchExchangeRate('USD', 'EUR');
      expect(rate).toBe(0.85); // Ensure the rate fetched from the API is correct
    });

    it('should throw an error if the currency code is invalid', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          conversion_rates: {
            USD: 1,
          },
        },
      });
      await expect(fetchExchangeRate('USD', 'EUR')).rejects.toThrow('Invalid currency code'); // Check for error on invalid code
    });

    it('should throw an error if the API response is invalid', async () => {
      axios.get.mockResolvedValueOnce({
        data: {}, // Mock an empty response
      });
      await expect(fetchExchangeRate('USD', 'EUR')).rejects.toThrow('Invalid response from API'); // Check for error on invalid response
    });
  });

  describe('fetchAllExchangeRates', () => {
    it('should return all rates from the API', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          conversion_rates: {
            USD: 1,
            EUR: 0.85,
          },
        },
      });
      const rates = await fetchAllExchangeRates();
      expect(rates).toEqual({
        USD: 1,
        EUR: 0.85, // Check if all rates from the API are returned
      });
    });

    it('should throw an error if API fetch fails', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network error'));
      await expect(fetchAllExchangeRates()).rejects.toThrow('Failed to fetch exchange rates: Network error'); // Check for error on fetch failure
    });

    it('should merge custom rates with API rates', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          conversion_rates: {
            USD: 1,
            CAD: 1.25,
          },
        },
      });
      saveNewExchangeRate('USD', 'AUD', 1.35); // Add a custom rate
      const rates = await fetchAllExchangeRates();
      expect(rates).toEqual({
        USD: 1,
        CAD: 1.25,
        AUD: 1.35, // Check if custom rates are merged with API rates
      });
    });
  });

  describe('saveNewExchangeRate', () => {
    it('should save a new custom exchange rate', () => {
      saveNewExchangeRate('USD', 'CAD', 1.25); // Save a new custom rate
      expect(customRates['USD']['CAD']).toBe(1.25); // Verify the custom rate is saved correctly
    });
  });
});
