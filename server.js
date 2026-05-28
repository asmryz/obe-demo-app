
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import process from 'node:process';
import indexRouter from './routes/index.js';



const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());
app.use('/api', indexRouter);


app.listen(PORT, `${process.env.DB_HOST}`, () => {
    console.log(`Server is running on http://${process.env.DB_HOST}:${PORT}`);
});