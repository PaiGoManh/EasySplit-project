const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  payer: { type: mongoose.Schema.Types.ObjectId, ref: 'Friend', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Friend', required: true }],
  splitMethod: { type: String, enum: ['equal', 'percentage', 'fixed'], required: true },
  notes: { type: String },
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
