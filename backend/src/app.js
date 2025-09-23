import express from 'express';
import connectDB from "./config/db.js"
import cors from 'cors'
import {config} from 'dotenv'
import authRouter from './routes/auth.route.js'

config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', authRouter);

await connectDB();

app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto ', PORT)
})