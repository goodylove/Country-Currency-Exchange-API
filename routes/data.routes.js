import express from "express";
import asyncHandler from "express-async-handler";
const Router = express.Router();
import {
  getAllCountries,
  refreshCountryController,
} from "../controller/data.controller.js";

Router.post("/refresh", asyncHandler(refreshCountryController));
Router.get("/", asyncHandler(getAllCountries));

export default Router;
