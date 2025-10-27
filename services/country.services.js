import connection from "../db/db.js";
import { fetchCountries, fetchCountriesCurrencyRate } from "../lib/external.js";

async function refreshCountryData() {
  let countries = await fetchCountries();
  let rates = await fetchCountriesCurrencyRate();

  let countriesProcessed = 0;

  for (const country of countries) {
    let currency_code = null;
    let exchange_rate = null;

    if (country.currencies && country.currencies.length > 0) {
      currency_code = country.currencies[0].code;

      if (rates[currency_code]) {
        exchange_rate = rates[currency_code];
      }
    }

    const name = country.name;
    const capital = country.capital || null;
    const region = country.region || null;
    const population = country.population || 0;
    const flag_url = country.flag || null;

    let estimated_gdp = null;
    if (population > 0 && exchange_rate) {
      const multiplier = Math.random() * (2000 - 1000) + 1000;
      estimated_gdp = (population * multiplier) / exchange_rate;
    } else if (currency_code && !exchange_rate) {
      estimated_gdp = null;
    } else {
      estimated_gdp = 0;
    }

    const sql = `
      INSERT INTO Country 
        (name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        capital = VALUES(capital),
        region = VALUES(region),
        population = VALUES(population),
        currency_code = VALUES(currency_code),
        exchange_rate = VALUES(exchange_rate),
        estimated_gdp = VALUES(estimated_gdp),
        flag_url = VALUES(flag_url);
    `;

    const values = [
      name,
      capital,
      region,
      population,
      currency_code,
      exchange_rate,
      estimated_gdp,
      flag_url,
    ];

    try {
      await connection.query(sql, values);
      countriesProcessed++;
    } catch (error) {
      if (
        error.code === "ER_NO_DEFAULT_FOR_FIELD" ||
        error.code === "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD"
      ) {
        console.warn(
          `Validation failed for ${name}: ${error.message}. Skipping.`
        );
        // This handles your 400 Bad Request rule, we just skip bad data
      } else {
        console.error(`Failed to save country ${name}: ${error.message}`);
      }
    }
  }
  console.log(`Finished processing. ${countriesProcessed} countries saved.`);

  try {
    // We update the single row (id=1) in our status table
    const statusSql = `
    UPDATE Status 
    SET total_countries = ${countriesProcessed},
        last_refreshed_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `;

    await connection.query(statusSql);
    console.log("Global refresh timestamp updated.");
  } catch (error) {
    console.error("Failed to update global status:", error.message);
    throw new Error("Failed to update refresh status");
  }

  return {
    message: "Data refreshed successfully",
    countries_processed: countriesProcessed,
  };
}

export default refreshCountryData;
