const express = require('express');
const {
  getExchangeRate,
  getAllExchangeRates,
  addNewExchangeRate,
} = require('../controllers/exchangeController');

const router = express.Router(); 

/**
 * @swagger
 * /api/exchange:
 *   get:
 *     summary: Get exchange rate from one currency to another
 *     parameters:
 *       - name: from
 *         in: query
 *         required: true
 *         description: The currency code to convert from
 *         schema:
 *           type: string
 *       - name: to
 *         in: query
 *         required: true
 *         description: The currency code to convert to
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exchange rate successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                 to:
 *                   type: string
 *                 rate:
 *                   type: number
 */
router.get('/exchange', getExchangeRate); // Route to get exchange rate between two currencies

/**
 * @swagger
 * /api/exchange-rates:
 *   get:
 *     summary: Get all exchange rates
 *     responses:
 *       200:
 *         description: All exchange rates successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rates:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *       500:
 *         description: Failed to fetch exchange rates
 */
router.get('/exchange-rates', getAllExchangeRates); // Route to get all exchange rates

/**
 * @swagger
 * /api/exchange-rates:
 *   post:
 *     summary: Add a custom exchange rate
 *     description: Adds a custom exchange rate for a specific currency pair.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               rate:
 *                 type: number
 *     responses:
 *       201:
 *         description: Custom exchange rate added.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Internal server error.
 */
router.post('/exchange-rates', addNewExchangeRate); // Route to add a new custom exchange rate

module.exports = router; // Export the router to use in other parts of the application
