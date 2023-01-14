const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

// const password = process.argv[2];
// const url = `mongodb+srv://fso40:${password}@fso2022.a8f1h.mongodb.net/?retryWrites=true&w=majority`;

const url = process.env.MONGODB_URI;
console.log('connecting to mongo server...');

const contactInfoSchema = new mongoose.Schema({
  contactId: Number,
  name: String,
  number: String,
});

const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);

if (process.argv.length === 5) {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected');

      const newID = Math.floor(Math.random() * 10001);
      // eslint-disable-next-line prefer-destructuring

      const newContact = new ContactInfo({
        contactId: newID,
        name: process.argv[3],
        number: process.argv[4],
      });

      return newContact.save();
    })
    .then(() => {
      console.log('phoneNumber saved!');
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
} else {
  console.log('retrieving numbers!');
  mongoose.connect(url);
  ContactInfo
    .find({})
    .then((result) => {
      result.forEach((number) => {
        console.log(number);
      });
      mongoose.connection.close();
    });
}
