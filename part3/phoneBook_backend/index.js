require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/Person');

const app = express();

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

// const getRandomId = () => {
//   return Math.floor(Math.random() * 10000000);
// };

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.get('/info', (request, response, next) => {
  const date = new Date().toString();
  Person.find({})
    .then((persons) => {
      response.send(
        `<p>Phonebook has info for ${persons.length} people<br/>${date}</p>`
      );
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => {
      next(error);
      // response.status(404).send({ error: 'person not found' });
    });
});

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;

  Person.findByIdAndDelete(id)
    .then((deletedPerson) => {
      response.json(deletedPerson);
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { body } = request;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'invalid content' });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });
  return Person.find({})
    .then((result) => {
      console.log('Buscando...');
      const names = result.map((person) => person.name);
      if (names.includes(body.name)) {
        response.status(400).send({ error: 'name exist' });
        return false;
      }
      return true;
    })
    .then(
      (result) =>
        result &&
        newPerson
          .save()
          .then((savedPerson) => {
            response.json(savedPerson);
          })
          .catch((error) => next(error))
    );
});

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request;

  const newPerson = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, newPerson, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const errorMiddleware = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }
  return next(error);
};

app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Api connected in port ${PORT}`);
});
