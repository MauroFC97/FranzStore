import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateUser,
} from "../controllers/users.controllers.js";

// GET obtener un recurso
// POST crear un recurso
// PUT actualizar un recurso
// PATCH actualizar parcialmente un recurso
// DELETE eliminar un recurso

const usersRouter = Router();

usersRouter.get("/", getAllUsers);

usersRouter.post("/", createUser);

usersRouter.get("/:userName", getOneUser);

usersRouter.patch("/:userName", updateUser);

usersRouter.delete("/:userName", deleteUser);

export { usersRouter };
