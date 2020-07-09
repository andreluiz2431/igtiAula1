// TRABALHO PRÁTICO - projeto base

// Imports
import express from 'express';
import mongoose from 'mongoose';
import studentRouter from './routes/studentRouter.js';

//require('dotenv').config();

//Conectar ao MongoDB pelo Mongoose
(async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.USERBD}:${process.env.PWDBD}@cluster0.gauhr.mongodb.net/accounts?retryWrites=true&w=majority`,
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

app.listen(process.env.PORT, () => console.log('API Iniciada'));
