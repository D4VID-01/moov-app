import express from 'express';
import connectDB from "./config/db.js"
import cors from 'cors'
import {config} from 'dotenv'

config();

const PORT = process.env.PORT;
const app = express();

await connectDB();

app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto ', PORT)
})