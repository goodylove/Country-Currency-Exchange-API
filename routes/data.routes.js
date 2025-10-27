import express from "express";
import asyncHandler from "express-async-handler";
const Router = express.Router();
import {
  deleteCountry,
  getAllCountries,
  getSingleCountry,
  getSummaryImage,
  refreshCountryController,
} from "../controller/data.controller.js";

Router.post("/refresh", asyncHandler(refreshCountryController));

Router.get("/", asyncHandler(getAllCountries));
Router.get("/image", asyncHandler(getSummaryImage));

Router.get("/:name", asyncHandler(getSingleCountry));

Router.delete("/:name", asyncHandler(deleteCountry));

export default Router;
