import express from "express";
import { createCategoryCtrl, getCategoriesCtrl, getCategoryCtrl, updateCategoryCtrl,
deleteCategoryCtrl } from "../controllers/categoriesCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { isAdmin } from '../middlewares/isAdmin.js';

const categoriesRouter = express.Router();

categoriesRouter.post("/", isLoggedIn, isAdmin, createCategoryCtrl);

categoriesRouter.get("/", getCategoriesCtrl);

categoriesRouter.get("/:categoryId", getCategoryCtrl);

categoriesRouter.put("/update/:categoryId", isLoggedIn, isAdmin, updateCategoryCtrl);

categoriesRouter.delete("/delete/:categoryId", isLoggedIn, isAdmin, deleteCategoryCtrl);

export default categoriesRouter;