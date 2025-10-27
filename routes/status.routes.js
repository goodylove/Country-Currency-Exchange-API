import { Router } from "express";
import asyncHandler from "express-async-handler";
import { getStatus } from "../controller/status.controller.js";

const statusRouter = Router();

statusRouter.get("/", asyncHandler(getStatus));
export default statusRouter;
