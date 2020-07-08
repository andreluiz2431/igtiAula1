import mongoose from 'mongoose';

const studentSchema = mongoose.Schema({
  agencia: { type: Number, required: true },
  conta: { type: Number, required: true },
  name: { type: String, required: true },
  balance: { type: Number, required: true },
});

const studentMondel = mongoose.model('account', studentSchema, 'account');

export default studentMondel;
