import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Valición de campos
  if (!name || !email || !password) {
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
      name,
      email,
      password: passwordHash
    });

    // Generación de token JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
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
        name: user.name,
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


export const login = async (req, res, next) => {

  const {email, password} = req.body;
  if( !email||!password ) return res.status(400).json('Faltan campos por llenar');

  try {

    // Verificar si el usuario exiate
    const user = await User.findOne({ email });
    if ( !user ) return res.status(400).json({message: 'Dirección no registrada'});
  
    // Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(401).json({message: 'Clave incorrecta'});

    // Generación de token 
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_IN || '1d'}
    );

    // Configuración de cookie segura
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    // Respuesta al cliente
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    })

  } catch (error) {
    next(error);
  }
};

export const logout =  async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === true,
    sameSite: 'lax'
  });

  res.json({message: 'Sesión cerrada correctamente'});
};