import Rating from '../models/rating.model.js';

// Controlador para crear o actualizar un rating
export const rate = async (req, res, next) => {
    try {
        const { tmdbId, mediaType, rating } = req.body;

        // Validación de campos obligatorios
        if (!tmdbId || !mediaType || rating == null) {
            return res.status(400).json({ message: 'Faltan campos.' });
        }

        // Validación de que el rating sea un número entre 1 y 5
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating inválido.' });
        }

        // Busca si el usuario ya calificó este contenido (tmdbId + mediaType).
        // Si existe, actualiza el valor del rating.
        // Si no existe, lo crea (gracias a la opción upsert: true).
        const doc = await Rating.findOneAndUpdate(
            { user: req.user._id, tmdbId, mediaType }, // criterio de búsqueda
            { rating }, // nuevo valor
            { new: true, upsert: true, setDefaultsOnInsert: true } // opciones de actualización
        );

        // Calcula las estadísticas globales para ese contenido:
        // promedio de todas las calificaciones y número de votos
        const stats = await Rating.aggregate([
            { $match: { tmdbId: Number(tmdbId), mediaType } }, // filtra por el contenido
            { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } } // calcula estadísticas
        ]);

        // Responde con el rating actualizado del usuario
        // y con las estadísticas globales (si no hay estadísticas, usa el rating actual como base)
        res.json({ rating: doc, stats: stats[0] || { avg: rating, count: 1 } });

    } catch (err) {
        next(err);
    }
};

// Controlador para obtener el rating de un usuario específico
export const getUserRating = async (req, res, next) => {
    try {
        const { tmdbId, mediaType } = req.query;

        // Validación: es obligatorio enviar el tmdbId
        if (!tmdbId) {
            return res.status(400).json({ message: 'tmdbId requerido' });
        }

        // Busca el rating que haya dejado este usuario en particular
        const doc = await Rating.findOne({ user: req.user._id, tmdbId, mediaType });

        // Devuelve el rating del usuario (puede ser null si no existe)
        res.json({ rating: doc });

    } catch (err) {
        next(err);
    }
};

// Controlador para obtener estadísticas globales de un contenido
export const getAggregatedRating = async (req, res, next) => {
    try {
        const { tmdbId, mediaType } = req.query;

        // Validación: es obligatorio enviar el tmdbId
        if (!tmdbId) {
            return res.status(400).json({ message: 'tmdbId requerido' });
        }

        // Calcula promedio y cantidad total de calificaciones para el contenido
        const stats = await Rating.aggregate([
            { $match: { tmdbId: Number(tmdbId), mediaType } }, // filtra por el contenido
            { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } } // genera estadísticas
        ]);

        // Devuelve las estadísticas (si no hay calificaciones, devuelve avg: 0 y count: 0)
        res.json({ stats: stats[0] || { avg: 0, count: 0 } });

    } catch (err) {
        next(err);
    }
};
