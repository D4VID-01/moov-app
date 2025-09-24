import Favorite from '../models/favorite.model.js';
import { fetchFromTmdb } from './tmdb.controller.js';

// Agregar un favorito
export const addFavorite = async (req, res, next) => {
    try {
        const { tmdbId, mediaType } = req.body;
        if (!tmdbId || !mediaType)
            return res.status(400).json({ message: 'Faltan campos.' });

        const doc = await Favorite.findOneAndUpdate(
            { user: req.user._id, tmdbId, mediaType },
            { $setOnInsert: { createdAt: new Date() } },
            { new: true, upsert: true }
        );

        res.status(201).json({ favorite: doc });
    } catch (err) {
        next(err);
    }
};

// Eliminar un favorito
export const removeFavorite = async (req, res, next) => {
    try {
        const { tmdbId, mediaType } = req.query;
        if (!tmdbId)
            return res.status(400).json({ message: 'tmdbId requerido' });

        await Favorite.deleteOne({ user: req.user._id, tmdbId, mediaType });

        res.json({ message: 'Eliminado' });
    } catch (err) {
        next(err);
    }
};

// Listar favoritos
export const listFavorites = async (req, res, next) => {
    try {
        const favs = await Favorite.find({ user: req.user._id }).lean();

        if (req.query.details === 'true') {
            const detailed = await Promise.all(favs.map(async f => {
                try {
                    const details = await fetchFromTmdb(`/${f.mediaType}/${f.tmdbId}`);
                    return { ...f, details };
                } catch (e) {
                    return { ...f, details: null };
                }
            }));
            return res.json({ favorites: detailed });
        }

        res.json({ favorites: favs });
    } catch (err) {
        next(err);
    }
};
