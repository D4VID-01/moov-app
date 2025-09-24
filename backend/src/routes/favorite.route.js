import express from 'express';
import { addFavorite, removeFavorite, listFavorites } from '../controllers/favorite.controller.js';
import { authRequired } from '../middlewares/auth.required.js';

const router = express.Router();
router.post('/', authRequired, addFavorite);
router.delete('/', authRequired, removeFavorite); // ?tmdbId=&mediaType=
router.get('/', authRequired, listFavorites); // ?details=true

export default router;