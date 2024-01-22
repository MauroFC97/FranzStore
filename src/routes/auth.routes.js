import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { userSchema } from "../lib/validation.js";

// GET obtener un recurso
// POST crear un recurso
// PUT actualizar un recurso
// PATCH actualizar parcialmente un recurso
// DELETE eliminar un recurso

const authRouter = Router();

authRouter.post("/register", validateSchema(userSchema), register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export { authRouter };
