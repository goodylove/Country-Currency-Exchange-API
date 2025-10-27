

#  Country Currency & Exchange API

A simple RESTful API that fetches country data from an external source, matches each country’s currency with its exchange rate, computes an estimated GDP, and stores everything in a MySQL database.
This project is designed to help you practice API integration, database caching, and CRUD operations.

---

##  Features

* Fetches countries from [REST Countries API](https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies)
* Fetches exchange rates from [Exchange Rate API](https://open.er-api.com/v6/latest/USD)
* Matches each country’s currency with its rate
* Computes `estimated_gdp = population × random(1000–2000) ÷ exchange_rate`
* Stores or updates country data in MySQL
* Generates a summary image showing total countries, top 5 by GDP, and last refresh timestamp
* Provides CRUD endpoints and caching behavior

---

##  API Endpoints

|   Method   | Endpoint             | Description                                                                                         |
| :--------: | :------------------- | :-------------------------------------------------------------------------------------------------- |
|  **POST**  | `/countries/refresh` | Fetch all countries and exchange rates, then cache in the DB                                        |
|   **GET**  | `/countries`         | Get all countries (supports filters & sorting: `?region=Africa`, `?currency=NGN`, `?sort=gdp_desc`) |
|   **GET**  | `/countries/:name`   | Get one country by name                                                                             |
| **DELETE** | `/countries/:name`   | Delete a country record                                                                             |
|   **GET**  | `/status`            | Show total countries and last refresh timestamp                                                     |
|   **GET**  | `/countries/image`   | Serve generated summary image                                                                       |

---

##  Database Schema

### **Country**

| Column              | Type                               | Description               |
| ------------------- | ---------------------------------- | ------------------------- |
| `id`                | INT (PK, auto-increment)           | Unique ID                 |
| `name`              | VARCHAR(100), **unique**, not null | Country name              |
| `capital`           | VARCHAR(100)                       | Country capital           |
| `region`            | VARCHAR(100)                       | Region name               |
| `population`        | BIGINT, not null                   | Population                |
| `currency_code`     | VARCHAR(10)                        | Currency code             |
| `exchange_rate`     | DECIMAL(20,6)                      | Exchange rate against USD |
| `estimated_gdp`     | DECIMAL(20,2)                      | Computed GDP estimate     |
| `flag_url`          | VARCHAR(255)                       | URL of the country’s flag |
| `last_refreshed_at` | TIMESTAMP                          | Auto updated on refresh   |

### **Status**

| Column              | Type                     | Description                      |
| ------------------- | ------------------------ | -------------------------------- |
| `id`                | INT (PK, auto-increment) | Always 1                         |
| `total_countries`   | BIGINT                   | Total number of cached countries |
| `last_refreshed_at` | TIMESTAMP                | Last refresh time                |

---

## Installation & Setup

###  Prerequisites

Make sure you have installed:

* Node.js ≥ 18
* MySQL ≥ 8
* npm or yarn

---

###  Clone the Repository

```bash
git clone https://github.com/your-username/country-currency-api.git
cd country-currency-api
```

---

###  Install Dependencies

```bash
npm install
```

---

###  Setup Environment Variables

Create a `.env` file in your root directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=country_db
```

---

###  Create the Database and Tables

Login to MySQL:

```bash
mysql -u root -p
```

Then:

```sql
CREATE DATABASE country_db;
USE country_db;

CREATE TABLE Country (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  capital VARCHAR(100),
  region VARCHAR(100),
  population BIGINT NOT NULL,
  currency_code VARCHAR(10),
  exchange_rate DECIMAL(20,6),
  estimated_gdp DECIMAL(20,2),
  flag_url VARCHAR(255),
  last_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total_countries BIGINT,
  last_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO Status (total_countries) VALUES (0);
```

---

###  Run the App

```bash
npm start
```

Your API will start at `http://localhost:3000`.

---

##  Testing the Endpoints

### Refresh and Populate Database

```
POST /countries/refresh
```

### Get All Countries

```
GET /countries
```

### Get Countries by Region or Currency

```
GET /countries?region=Africa
GET /countries?currency=NGN
```

### Get One Country

```
GET /countries/Nigeria
```

### Delete a Country

```
DELETE /countries/Nigeria
```

### Check Refresh Status

```
GET /status
```

### Get Summary Image

```
GET /countries/image
```

---

##  Error Responses

| Status Code | Example Response                                  |
| ----------- | ------------------------------------------------- |
| **400**     | `{ "error": "Validation failed" }`                |
| **404**     | `{ "error": "Country not found" }`                |
| **500**     | `{ "error": "Internal server error" }`            |
| **503**     | `{ "error": "External data source unavailable" }` |

---

##  Notes

* If a country has multiple currencies, only the first is used.
* If no currency or rate is available, GDP = 0 or null but the record is still stored.
* `/countries/refresh` updates existing countries and recalculates new GDP values each time.
* Summary image (`cache/summary.png`) is auto-regenerated on every refresh.



---
##  License

MIT License — free to use and modify.


