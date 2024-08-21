import dotenv from "dotenv";
dotenv.config();
import express from "express";
import dbConnect from "../config/dbConnect.js";
import morgan from "morgan";
import usersRouter from "../routes/usersRouter.js";
import booksRouter from "../routes/booksRouter.js";
import categoriesRouter from "../routes/categoriesRouter.js";
import reviewsRouter from "../routes/reviewsRouter.js";
import ordersRouter from "../routes/ordersRouter.js";
import couponsRouter from "../routes/couponsRouter.js";
import { globalErrHandler, notFoundHandler } from "../middlewares/globalErrHandler.js";

// mongoDB connect
dbConnect();

const app = express();
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));

// Routes
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/books", booksRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/reviews", reviewsRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/coupons", couponsRouter);

// Error Middlewares
app.use(notFoundHandler);
app.use(globalErrHandler);

export default app;