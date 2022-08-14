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
  contactId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    minLength: [3, 'Name must be longer than 3 characters'],
    required: true,
  },
  number: {
    type: String,
    minLength: [8, 'Number should be longer than 8 numbers'],
    required: true,
    validate: {
      validator(v) {
        return /\d{2,3}-\d{5,}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
