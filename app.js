import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cartRouter from './routes/cartRouter.js';

dotenv.config();

const app = express();
const url = 'mongodb://127.0.0.1:27017/ecomerc';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use('/api/users', userRouter);
app.use('/api/carts', cartRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
