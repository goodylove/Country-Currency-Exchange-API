Country Currency & Exchange API
This is a RESTful API built with Node.js, Express, and MySQL. It fetches country data from the RestCountries API and currency exchange rates from the Open Exchange Rate API, calculates an estimated GDP, and caches all data in a local MySQL database.

The API provides endpoints to retrieve all countries, filter them, get a single country, and view the cache status. It also dynamically generates a summary image of the cached data.

Features
Data Caching: Fetches and stores data in a MySQL database to act as a fast, local cache.

Data Processing: Computes an estimated_gdp for each country based on population and exchange rate.

Dynamic Filtering: Supports filtering countries by region and currency_code.

Sorting: Allows sorting the country list by estimated_gdp.

Image Generation: Dynamically creates and serves a .png image summarizing the database content.

Robust Error Handling: Gracefully handles external API failures and invalid requests.

Prerequisites
Before you begin, ensure you have the following installed on your local machine:

Node.js (v18.x or later)



Installation & Setup
Clone the repository:

Bash

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
Install dependencies:

Bash

npm install
Set up the Database:

Log in to your MySQL server (e.g., mysql -u root -p).

Create the database:

SQL

CREATE DATABASE countries_api_db;
Use the database:

SQL

USE countries_api_db;
Run the following SQL script to create the necessary tables:

SQL

-- Create the 'countries' table
CREATE TABLE countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    capital VARCHAR(255) NULL,
    region VARCHAR(255) NULL,
    population BIGINT NOT NULL,
    currency_code VARCHAR(10) NULL,
    exchange_rate DECIMAL(20, 6) NULL,
    estimated_gdp DECIMAL(30, 6) NULL,
    flag_url VARCHAR(512) NULL,
    last_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the 'Status' table
CREATE TABLE Status (
    id INT PRIMARY KEY DEFAULT 1,
    last_refreshed_at TIMESTAMP NULL
);

-- Insert the single row we will always use for status
INSERT IGNORE INTO Status (id, global_last_refreshed_at) VALUES (1, NULL);
Configure Environment Variables:

Create a .env file in the root of the project:

Bash

touch .env
Add the following configuration, replacing the values with your MySQL credentials:

Ini, TOML

# .env file
PORT=3000

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=countries_api_db
Running the Application
Start the server:

Bash

npm start
The server will be running on http://localhost:3000 (or the port you specified in .env).

!! IMPORTANT: Initial Data Refresh !! When you first start the server, the database is empty. You must run the initial data refresh to populate the database.

Use Postman or curl to send a POST request:

Bash

curl -X POST http://localhost:3000/countries/refresh
This process will take 10-20 seconds. Once complete, all other GET endpoints will work.

API Endpoints
1. Refresh Data Cache
Refetches all data from the external APIs, recalculates GDP, and updates the MySQL database. This also generates the summary.png image.

Method: POST

URL: /countries/refresh

Success Response (200 OK):

JSON

{
  "message": "Data refreshed successfully",
  "countries_processed": 250
}
Error Response (503 Service Unavailable): (If external APIs fail)

JSON

{
  "error": "External data source unavailable",
  "details": "Could not fetch data from RestCountries API"
}
2. Get All Countries
Retrieves a list of all countries from the database. Supports filtering and sorting.

Method: GET

URL: /countries

Query Parameters (Optional):

region (e.g., ?region=Africa): Filters by region.

currency (e.g., ?currency=NGN): Filters by currency code.

sort (e.g., ?sort=gdp_desc): Sorts by estimated GDP.

Example Request: GET /countries?region=Africa&sort=gdp_desc

Success Response (200 OK):

JSON

[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139589,
    "currency_code": "NGN",
    "exchange_rate": 1600.23,
    "estimated_gdp": 25767448125.2,
    "flag_url": "https://flagcdn.com/ng.svg",
    "last_refreshed_at": "2025-10-27T18:00:00Z"
  },
  {
    "id": 2,
    "name": "Ghana",
    "capital": "Accra",
    "region": "Africa",
    "population": 31072940,
    "currency_code": "GHS",
    "exchange_rate": 15.34,
    "estimated_gdp": 3029834520.6,
    "flag_url": "https://flagcdn.com/gh.svg",
    "last_refreshed_at": "2025-10-27T18:00:00Z"
  }
]
3. Get a Single Country
Retrieves a single country record by its name.

Method: GET

URL: /countries/:name (e.g., /countries/Nigeria)

Success Response (200 OK):

JSON

{
  "id": 1,
  "name": "Nigeria",
  "capital": "Abuja",
  "region": "Africa",
  "population": 206139589,
  "currency_code": "NGN",
  "exchange_rate": 1600.23,
  "estimated_gdp": 25767448125.2,
  "flag_url": "https://flagcdn.com/ng.svg",
  "last_refreshed_at": "2025-10-27T18:00:00Z"
}
Error Response (404 Not Found):

JSON

{
  "error": "Country not found"
}
4. Delete a Country
Deletes a country record from the database by its name.

Method: DELETE

URL: /countries/:name (e.g., /countries/Nigeria)

Success Response (200 OK):

JSON

{
  "message": "Country deleted successfully"
}
Error Response (404 Not Found):

JSON

{
  "error": "Country not found"
}
5. Get API Status
Retrieves the total number of countries in the database and the timestamp of the last successful refresh.

Method: GET

URL: /status

Success Response (200 OK):

JSON

{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-27T18:00:00Z"
}
6. Get Summary Image
Serves the generated summary.png image, which is created/updated every time the refresh endpoint is called.

Method: GET

URL: /countries/image

Success Response (200 OK):

Returns the image file (MIME type image/png).

Error Response (404 Not Found): (If the POST /countries/refresh endpoint has not been run yet)

JSON

{
  "error": "Summary image not found"
}
Tech Stack
Backend: Node.js, Express

Database: MySQL (with mysql2)

HTTP Client: Axios

Image Generation: Jimp

Environment Variables: dotenv