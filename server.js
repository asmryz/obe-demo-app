import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import indexRouter from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api', indexRouter);

// static
app.use(express.static('dist'));

// SPA fallback (Express 5 safe)
app.use((req, res) => {
    res.sendFile(new URL('./dist/index.html', import.meta.url).pathname);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
