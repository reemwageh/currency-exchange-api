const axios = require('axios');
const NodeCache = require('node-cache');

// Object to store custom exchange rates
const customRates = {}; 
// Cache to store fetched rates for 1 hour
const rateCache = new NodeCache({ stdTTL: 3600 }); 

// Function to fetch the exchange rate between two currencies
async function fetchExchangeRate(from, to) {
  const cacheKey = `${from}_${to}`; // Create a unique key for caching
  
  const cachedRate = rateCache.get(cacheKey); // Check if rate is cached
  if (cachedRate) {
    return cachedRate; // Return cached rate if available
  }

  try {
    // Fetch exchange rates from the API
    const response = await axios.get(process.env.API_URL, {
      params: { apikey: process.env.API_KEY },
    });

    // Check if API response is valid
    if (!response.data?.conversion_rates) {
      throw new Error('Invalid response from API');
    }

    const rateFrom = response.data.conversion_rates[from]; // Get rate for 'from' currency
    const rateTo = response.data.conversion_rates[to]; // Get rate for 'to' currency

    // Check if both rates are available
    if (!rateFrom || !rateTo) {
      throw new Error('Invalid currency code');
    }

    // Calculate and cache the exchange rate
    const exchangeRate = rateTo / rateFrom;
    rateCache.set(cacheKey, exchangeRate); // Store the rate in cache
    return exchangeRate; // Return the exchange rate
  } catch (error) {
    throw new Error('Failed to fetch exchange rate: ' + error.message);
  }
}

// Function to fetch all available exchange rates
async function fetchAllExchangeRates() {
  try {
    // Fetch rates from the API
    const response = await axios.get(process.env.API_URL, {
      params: { apikey: process.env.API_KEY },
    });

    // Check if API response is valid
    if (!response.data?.conversion_rates) {
      throw new Error('Invalid response from API');
    }

    const apiRates = response.data.conversion_rates; // Get conversion rates from API

    // Merge API rates with custom rates
    const mergedRates = { ...apiRates }; 
    for (const from in customRates) {
      for (const to in customRates[from]) {
        mergedRates[to] = customRates[from][to]; // Add custom rates to merged rates
      }
    }

    return mergedRates; // Return all merged rates
  } catch (error) {
    throw new Error('Failed to fetch exchange rates: ' + error.message);
  }
}

// Function to save a new custom exchange rate
function saveNewExchangeRate(from, to, rate) {
  if (!customRates[from]) {
    customRates[from] = {}; // Initialize object for 'from' currency if it doesn't exist
  }
  customRates[from][to] = rate; // Save the custom rate
}

// Export functions and variables for use in other modules
module.exports = {
  rateCache,
  fetchExchangeRate,
  fetchAllExchangeRates,
  saveNewExchangeRate,
  customRates, 
};
