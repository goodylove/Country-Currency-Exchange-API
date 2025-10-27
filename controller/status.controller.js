import { StatusCodes } from "http-status-codes";
import connection from "../db/db.js";

export async function getStatus(req, res) {
    
  const statusQuery =
    "SELECT total_countries , last_refreshed_at FROM Status WHERE id = 1";

  const [columns] = await connection.query(statusQuery);
  const data = columns[0];

  const output = {
    total_countries: data.total_countries,
    last_refreshed_at: data.last_refreshed_at,
  };

  res.status(StatusCodes.OK).json(output);
}
