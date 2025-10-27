import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connection from "../db/db.js";

import jimp from "jimp";

// This is the ES Module 'fix' for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define our file paths
const cacheDir = path.join(__dirname, "..", "cache");
const imagePath = path.join(cacheDir, "summary.png");

export async function generateSummaryImage() {
  console.log("Starting summary image generation...");
  try {
    // 1. Get all the data from the DB

    const [topGdpResult] = await connection.query(
      "SELECT name, estimated_gdp FROM Country WHERE estimated_gdp IS NOT NULL ORDER BY estimated_gdp DESC LIMIT 5"
    );
    const [statusResult] = await connection.query(
      "SELECT  total_countries, last_refreshed_at FROM Status WHERE id = 1"
    );

    const topCountries = topGdpResult;
    const lastRefresh = statusResult[0].last_refreshed_at;
    const totalCountries = statusResult[0].total_countries;

    // 2. Create the cache directory if it doesn't exist
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }

    // 3. Create the image
    const image = new jimp(800, 600, "#FFFFFF");

    // 4. Load fonts (Jimp provides some)
    const fontBlack = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
    const fontRegular = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);

    // 5. Draw the text
    image.print(fontBlack, 50, 50, "Country API Summary");
    image.print(fontRegular, 50, 120, `Total Countries: ${totalCountries}`);

    image.print(fontBlack, 50, 200, "Top 5 Countries by GDP:");

    let yPos = 250;
    for (let i = 0; i < topCountries.length; i++) {
      const country = topCountries[i];
      const gdpText = country.estimated_gdp
        ? `$${Number(country.estimated_gdp).toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })}`
        : "N/A";
      image.print(
        fontRegular,
        70,
        yPos,
        `${i + 1}. ${country.name}: ${gdpText}`
      );
      yPos += 30; // Move down for the next line
    }

    const refreshTime = lastRefresh
      ? new Date(lastRefresh).toUTCString()
      : "Never";
    image.print(fontRegular, 50, 550, `Last Refresh: ${refreshTime}`);

    // 6. Save the file
    await image.writeAsync(imagePath);
    console.log(`Summary image saved to: ${imagePath}`);
  } catch (error) {
    console.error("Error generating summary image:", error);
  }
}
