import express from "express";
import { createBookCtrl, getBooksCtrl, getBookCtrl, updateBookCtrl, deleteBookCtrl } from "../controllers/booksCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";


const booksRouter = express.Router();

booksRouter.post("/", isLoggedIn, createBookCtrl);

booksRouter.get("/", getBooksCtrl);

booksRouter.get("/:bookId", getBookCtrl);

booksRouter.put("/update/:bookId", isLoggedIn, updateBookCtrl);

booksRouter.delete("/delete/:bookId", isLoggedIn, deleteBookCtrl);

export default booksRouter;