import 'dotenv/config';
import express from 'express';
import connectDB from "./config/db.js"
import cors from 'cors'
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import tmdbRouter from './routes/tmdb.route.js'
import ratingRouter from './routes/rating.route.js'


const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());


app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/tmdb', tmdbRouter);
app.use('/api/rating', ratingRouter);


await connectDB();

app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto ', PORT)
})