const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

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

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

const getRandomId = () => {
  return Math.floor(Math.random() * 10000000);
};

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const date = new Date().toString();
  response.send(
    `<p>Phonebook has info for ${persons.length} people<br/>${date}</p>`
  );
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) {
    return response.status(404).end();
  }
  response.status(200).json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find((person) => person.id === id);
  if (!person) {
    return response.status(400).json({ error: 'Id not exist' });
  }
  response.json(person);
  persons = persons.filter((person) => person.id !== id);
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'invalid content' });
  }
  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  const newPerson = {
    id: getRandomId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(newPerson);
  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Api connected in port ${PORT}`);
});
