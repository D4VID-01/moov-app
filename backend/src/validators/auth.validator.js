import { body } from "express-validator";

export const registerValidtor = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('password')
    .isLength({min: 8, max: 25})
    .withMessage('La contraseña debe contener entre 8 y 25 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe contener al menos un número')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('La contraseña debe contener al menos un carácter especial')
];

export const loginValidator = [
    body('name').notEmpty().withMessage('Correo electrónico inválido'),
    body('email').isEmail().withMessage('Clave inválida'),
    
]