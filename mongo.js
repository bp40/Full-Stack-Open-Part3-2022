const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fso40:${password}@fso2022.a8f1h.mongodb.net/?retryWrites=true&w=majority`;

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const PhoneNumber = mongoose.model('PhoneNumber', numberSchema);

if (process.argv.length === 5) {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected');

      const phoneNumber = new PhoneNumber({
        name: process.argv[3],
        number: process.argv[4],
      });

      return phoneNumber.save();
    })
    .then(() => {
      console.log('phoneNumber saved!');
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
} else {
  console.log('retrieving numbers!');
  mongoose.connect(url);
  PhoneNumber
    .find({})
    .then((result) => {
      result.forEach((number) => {
        console.log(number);
      });
      mongoose.connection.close();
    });
}
