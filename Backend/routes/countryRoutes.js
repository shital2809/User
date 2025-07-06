const express = require("express");
const router = express.Router();
const {
  getAllCountries,
  updateCountryCurrency,
} = require("../controller/flightController");

// GET all countries
router.get("/countries", getAllCountries);

// PATCH currency details for a country by name
router.patch("/:name/currency", updateCountryCurrency);

module.exports = router;