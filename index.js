import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connection from "./db/db.js";
import ErrorHandlerMiddleware from "./middleware/errorHandler.js";
import { NotFoundHandler } from "./middleware/not-found.js";
import router from "./routes/data.routes.js";
import Router from "./routes/data.routes.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to Backend Task: Country Currency & Exchange API </h1>"
  );
});

app.get("/test-db", async (req, res) => {
  try {
    const [columns] = await connection.query("SELECT *  FROM  Country");
    res.json({
      message: "Database connected successfully!",
      data: columns,
    });
  } catch (err) {
    console.error("DB connection failed:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/countries", Router);


app.use(NotFoundHandler);
app.use(ErrorHandlerMiddleware);

const PORT = process.env.PORT || 3000;
function startServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
