import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
} from "../controllers/products.controller.js";
import { upload } from "../lib/upload.js";
import { isAdmin } from "../middlewares/isAdmin.js";

// GET obtener un recurso
// POST crear un recurso
// PUT actualizar un recurso
// PATCH actualizar parcialmente un recurso
// DELETE eliminar un recurso

const productsRouter = Router();

productsRouter.get("/", getAllProducts);

productsRouter.post("/", isAdmin, upload.single("thumbnail"), createProduct);

productsRouter.get("/:title", isAdmin, getOneProduct);

productsRouter.patch("/:title", isAdmin, updateProduct);

productsRouter.delete("/:title", isAdmin, deleteProduct);
export { productsRouter };
