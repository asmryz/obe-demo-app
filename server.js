import express from 'express';
import cors from 'cors';
import process from 'node:process';
import indexRouter from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors());
app.use(express.json());
// Serve static files from dist
app.use(express.static('dist'));
app.use('/api', indexRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});