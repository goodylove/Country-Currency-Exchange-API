import axios from "axios";
import { StatusCodes } from "http-status-codes";

export async function fetchCountriesCurrencyRate() {
  try {
    const response = await axios.get(process.env.COUNTRY_CURRENCY_API_URL, {
      timeout: 5000,
    });
    const data = response.data.rates;
    return data;
  } catch (error) {
    const err = new Error();
    err.error = "External data source unavailable";
    err.details = "Could not fetch data from country currency API";
    err.statusCode = StatusCodes.SERVICE_UNAVAILABLE;
    throw err;
  }
}

export async function fetchCountries(code) {
  try {
    const response = await axios.get(process.env.COUNTRY_API_URL, {
      timeout: 5000,
    });
    const data = response.data;
    return data;
  } catch (error) {
    const err = new Error();
    err.error = "External data source unavailable";
    err.details = "Could not fetch data from country API";
    err.statusCode = StatusCodes.SERVICE_UNAVAILABLE;
    throw err;
  }
}

export const getEstimatedGdp = (population, exchangeRate) => {
  return (population * random(1000 - 2000)) / exchangeRate;
};
