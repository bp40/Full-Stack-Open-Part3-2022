const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const ContactInfo = require('./contactInfo');
require('dotenv').config();

const app = express();

// eslint-disable-next-line no-unused-vars
morgan.token('req', (req, res) => {
  if (req.method === 'POST') {
    return `{"name":"${req.body.name}","number":"${req.body.number}"}`;
  }
  return '';
});

app.use(express.json());
app.use(cors());
app.use(express.static('build'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req'));

app.get('/info', (req, res) => {
  ContactInfo.countDocuments({}).then((count) => {
    res.send(
      `
      <p>Phonebook has info for ${count} people</p>
      <p> ${new Date()}</p>
      `,
    );
  });
});

app.get('/api/persons', (req, res) => {
  ContactInfo.find({}).then((contact) => {
    res.json(contact);
  });
  // res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  ContactInfo.find({ contactId: req.params.id }).then((contact) => {
    res.json(contact);
  });
});

app.delete('/api/persons/:id', (req, res) => {
  const contactID = Number(req.params.id);
  ContactInfo.deleteOne({ contactId: contactID });

  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const newID = Math.floor(Math.random() * 10001);
  // eslint-disable-next-line prefer-destructuring
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing',
    });
  }

  const newContact = new ContactInfo({
    contactId: newID,
    name: body.name,
    number: body.number,
  });

  if ((ContactInfo.find({ name: newContact.name }).size()) >= 1) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }

  newContact.save();

  return res.json(newContact);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
