import express from 'express';
import { rate, getUserRating, getAggregatedRating } from '../controllers/rating.controller.js'
import { authRequired } from '../middlewares/auth.required.js';
import errorHandler from '../middlewares/errorHandle.js'


const router = express.Router();

router.post('/', authRequired, rate, errorHandler);
router.get('/mine', authRequired, getUserRating, errorHandler); // ?tmdbId=&mediaType=
router.get('/stats', getAggregatedRating, errorHandler); // ?tmdbId=&mediaType=

export default router;