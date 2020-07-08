// TRABALHO PRÁTICO - projeto base

import express from 'express';
import mongoose from 'mongoose';
import studentRouter from './routes/studentRouter.js';

//Conectar ao MongoDB pelo Mongoose
(async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://teste:1234@cluster0.gauhr.mongodb.net/accounts?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (error) {
    console.log('Erro ao conectar no MongoDB');
  }
})();

const app = express();
app.use(express.json());
app.use(studentRouter);

app.listen(3000, () => console.log('API Iniciada'));
