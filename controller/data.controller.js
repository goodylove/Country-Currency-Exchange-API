import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


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
  const { region, currency, sort } = req.query;

  let sql = `SELECT id, name,
      capital,
      region,
      population,
      currency_code,
      exchange_rate,
      estimated_gdp,
      flag_url,
      last_refreshed_at FROM  Country`;

  const whereClauses = [];
  const values = [];

  if (region) {
    whereClauses.push("region = ?");
    values.push(region);
  }
  if (currency) {
    whereClauses.push("currency_code = ?");
    values.push(currency);
  }

  if (whereClauses.length > 0) {
    sql += " WHERE " + whereClauses.join(" AND ");
  }

  console.log(whereClauses);
  if (sort === "gdp_desc") {
    sql += " ORDER BY estimated_gdp DESC";
  } else if (sort === "gdp_asc") {
    sql += " ORDER BY estimated_gdp ASC";
  }

  const [results] = await connection.query(sql, values);

  res.status(StatusCodes.OK).json(results);
}

export async function getSingleCountry(req, res) {
  const { name } = req.params;

  let sql = `SELECT id, name,
      capital,
      region,
      population,
      currency_code,
      exchange_rate,
      estimated_gdp,
      flag_url,
      last_refreshed_at FROM  Country WHERE name = ?`;

  const values = [name];
  const [results] = await connection.query(sql, values);

  if (results.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Country not found" });
  }
  res.status(StatusCodes.OK).json(results[0]);
}

export async function deleteCountry(req, res) {
  const { name } = req.params;

  const sql = "DELETE FROM country WHERE name = ?";
  const values = [name];

  const [results] = await connection.query(sql, values);

  if (results.affectedRows === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: "Country not found",
    });
  }

  res.status(StatusCodes.OK).json({
    message: "Country deleted successfully",
  });
}



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function getSummaryImage(req, res) {
  // We must use an absolute path for res.sendFile
  const imagePath = path.join(__dirname, "..", "cache", "summary.png");

  // Check if the file exists
  if (fs.existsSync(imagePath)) {
    // Send the file
    res.sendFile(imagePath);
  } else {
    // Send the 404 error as required
    res.status(StatusCodes.NOT_FOUND).json({
      error: "Summary image not found",
    });
  }
}