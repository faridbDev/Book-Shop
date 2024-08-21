import express from "express";
import { createBookCtrl, getBooksCtrl, getBookCtrl, updateBookCtrl, deleteBookCtrl } from "../controllers/booksCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { isAdmin } from '../middlewares/isAdmin.js';
import bookImagesUpload from "../utils/bookImagesUpload.js";

const booksRouter = express.Router();

booksRouter.post("/", isLoggedIn, isAdmin, bookImagesUpload.array('images'), createBookCtrl);

booksRouter.get("/", getBooksCtrl);

booksRouter.get("/:bookId", getBookCtrl);

booksRouter.put("/update/:bookId", isLoggedIn, isAdmin, updateBookCtrl);

booksRouter.delete("/delete/:bookId", isLoggedIn, isAdmin, deleteBookCtrl);

export default booksRouter;