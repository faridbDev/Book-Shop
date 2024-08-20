import express from "express";
import { createCategoryCtrl, getCategoriesCtrl, getCategoryCtrl, updateCategoryCtrl,
deleteCategoryCtrl } from "../controllers/categoriesCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";


const categoriesRouter = express.Router();

categoriesRouter.post("/", isLoggedIn, createCategoryCtrl);

categoriesRouter.get("/", getCategoriesCtrl);

categoriesRouter.get("/:categoryId", getCategoryCtrl);

categoriesRouter.put("/update/:categoryId", isLoggedIn, updateCategoryCtrl);

categoriesRouter.delete("/delete/:categoryId", isLoggedIn, deleteCategoryCtrl);

export default categoriesRouter;