import express from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProductsByCategory,
	editProduct,
	getProduct
} from "../controllers/productController.js";
import  {protectRoute} from "../middlewares/protectRoutes.js";
import { adminRoute } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/",  getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.post("/create", protectRoute, createProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.put("/:id", protectRoute, adminRoute, editProduct);
router.get("/:id",   getProduct);

export default router;
