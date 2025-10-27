import { StatusCodes } from "http-status-codes";
import refreshCountryData from "../services/country.services.js";
import connection from "../db/db.js";

export async function refreshCountryController(req, res) {
  const result = await refreshCountryData();
  res
    .status(200)
    .json({ message: "Country data refreshed successfully", result });
}

export async function getAllCountries(req, res) {
  const { region, currency } = req.params;

  const [result] = await connection.query(`SELECT id, name,
      capital,
      region,
      population,
      currency_code,
      exchange_rate,
      estimated_gdp,
      flag_url FROM  Country  WHERE (region=" " " + region + " " ) ORDER BY  estimated_gdp DESC`);

  res.status(StatusCodes.OK).json(result);
}
