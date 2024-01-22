import { comparePassword, encryptPassword } from "../lib/password.js";
import User from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, userName, password } = req.body;

    const userExist = await User.findOne({ userName });
    if (userExist && userExist.length > 0) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const encryptedPassword = await encryptPassword(password).catch((error) => {
      console.error("Error al cifrar la contraseña", error);
      res.status(500).json({ message: "Error del servidor al registrarse" });
    });

    // Crear un nuevo usuario
    const newUser = new User({
      firstName,
      lastName,
      userName,
      password: encryptedPassword,
    });

    //  Guardar el nuevo usuario en la base de datos
    const userSaved = await newUser.save();
    req.session.userId = userSaved._id;

    //  Responder con el usuario creado sin contraseña
    delete userSaved.password;
    res.status(201).json({ message: "Usted se registro con exito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor al registrarse" });
  }
};
export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ userName });
    if (!user) {
      res.status(400).json({ message: "Credenciales invalidas" });
    }

    // Veriricar si la contraseña es correcta
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Credenciales invalidas" });
    }

    // Guardar el ID del usuario en la sesion
    req.session.userId = user._id;

    // Responder con el usuario logueado sin contraseña
    delete user.password;
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor al iniciar sesion" });
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.status(200).json({ message: "Sesion cerrada" });
};
