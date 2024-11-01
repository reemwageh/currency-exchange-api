// Import necessary functions and valid currencies
const { fetchExchangeRate, fetchAllExchangeRates, saveNewExchangeRate } = require('../services/exchangeService');
const validCurrencies = require('../../config/validCurrencies.json').validCurrencies;

// Function to get the exchange rate between two currencies
async function getExchangeRate(req, res) {
   // Get 'from' and 'to' currencies from the request
  const { from, to } = req.query;
   // Check if both currencies are provided
  if (!from || !to) {
    return res.status(400).json({ message: 'Both "from" and "to" query parameters are required' });
  }
   // Check if the currencies are valid
  if (!validCurrencies.includes(from) || !validCurrencies.includes(to)) {
    return res.status(400).json({ message: 'Invalid currency code provided' });
  }

  try {
    // Get the exchange rate
    const rate = await fetchExchangeRate(from, to);
    res.status(200).json({ from, to, rate }); // response with the rate
  } catch (error) {
    res.status(500).json({ message: error.message }); // response with error message
  }
}
// Function to get all exchange rates
async function getAllExchangeRates(req, res) {
  try {
     // Get all rates
    const rates = await fetchAllExchangeRates();
    res.status(200).json({ rates }); // get all rates
  } catch (error) {
    res.status(500).json({ message: error.message }); // response with error message
  }
}


// Function to add a new exchange rate
async function addNewExchangeRate(req, res) {
  // Get 'from', 'to', and 'rate' from the request body
  const { from, to, rate } = req.body;
  // Check if all fields are provided
  if (!from || !to || !rate) {
    return res.status(400).json({ message: 'All fields ("from", "to", "rate") are required' });
  }
  // Check if the rate is a positive number
  if (typeof rate !== 'number' || rate <= 0) {
    return res.status(400).json({ message: 'Rate must be a positive number' });
  }

  try {
     // Save the new exchange rate
    await saveNewExchangeRate(from, to, rate);
    res.status(201).json({ message: `Exchange rate added for ${from} to ${to}` }); // reponse with success message
  } catch (error) {
    res.status(500).json({ message: error.message }); // response with error message
  }
}

// Export the functions for use in other parts of the application
module.exports = { getExchangeRate, 
  getAllExchangeRates, 
  addNewExchangeRate };

