import { Router } from 'express';
import { search, getDetails, trending, discover } from '../controllers/tmdb.controller.js';
import errorHandler from '../middlewares/errorHandle.js'

const router = Router();

router.get('/search', search, errorHandler); // ?query=
router.get('/trending', trending, errorHandler);
router.get('/discover', discover, errorHandler); // ?mediaType=movie|tv
router.get('/:mediaType/:id', getDetails, errorHandler);

export default router;