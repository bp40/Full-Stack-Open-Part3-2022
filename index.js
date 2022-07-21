const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

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

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/info', (req, res) => {
  res.send(
    `
    <p>Phonebook has info for ${persons.length} people</p>
    <p> ${new Date()}</p>
    `,
  );
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  res.json(persons.filter((person) => person.id === id));
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  persons = persons.filter((person) => person.id !== id);
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

  const newPerson = {
    id: newID,
    name: body.name,
    number: body.number,
  };

  if (persons.map((person) => person.name).includes(newPerson.name)) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }
  persons = persons.concat(newPerson);
  return res.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
