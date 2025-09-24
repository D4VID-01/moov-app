import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authRequired = async (req, res, next) => {
    try {
        let token;
        
        // 1. Revisa si el token viene en el header "Authorization: Bearer <token>"
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer "))
            token = req.headers.authorization.split(" ")[1];

        // 2. Si no está en el header, revisa si viene en una cookie httpOnly
         else if (req.cookies && req.cookies.token)
            token = req.cookies.token;

        // 3. Si no hay token, devuelve 401 Unauthorized
        if (!token) return res.status(401).json({ message: "No token, autorización requerida." });

         // 4. Verifica el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Busca el usuario en la base de datos (excluyendo la contraseña)
        const user = await User.findById(decoded.id).select("-password");

        // 6. Si no existe el usuario, devuelve 401
        if (!user) return res.status(401).json({ message: "Usuario no encontrado." });
    
        // 7. Adjunta el usuario a req.user para que los controladores puedan usarlo
        req.user = user;

        // 8. Todo bien, pasa al siguiente middleware o controlador
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: 'Token invalido o expirado'})
    }
}