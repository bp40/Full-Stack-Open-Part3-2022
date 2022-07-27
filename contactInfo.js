require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((err) => {
    console.log('error connecting to MongoDB:', err.message);
  });

const contactInfoSchema = new mongoose.Schema({
  contactId: Number,
  name: String,
  number: String,
});

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
