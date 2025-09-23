import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Valición de campos
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Faltan campos." });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "El email ya está registrado." });
    }

    // Encriptación de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Creación y guardado de el usuario
    const user = await User.create({
      username,
      email,
      password: passwordHash
    });

    // Generación de token JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    // Configuración de la cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true", // en producción debe ser true
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    });

    // Respuesta al cliente
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    });

  } catch (err) {
    next(err);
 }
};
