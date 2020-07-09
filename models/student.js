import mongoose from 'mongoose';

// Esqueleto do Banco de dados
const studentSchema = mongoose.Schema({
  agencia: { type: Number, required: true },
  conta: { type: Number, required: true },
  name: { type: String, required: true },
  balance: { type: Number, required: true },
});

// salvando modelo da coleção
const studentMondel = mongoose.model('account', studentSchema, 'account');

export default studentMondel;
