const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/person');

// CORS
app.use(cors());
// For static website
app.use(express.static('dist'));
// Adding JSON parser
app.use(express.json());
// Logger
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// GET
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  })
});

app.get('/api/info', (request, response) => {
  const numberOfPersons = persons.length;
  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 2);
  const currentTimeGMTPlus2 = currentTime.toISOString().replace(/T/, ' ').replace(/\..+/, '') + " GMT+2";
  const htmlContent = `
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${currentTimeGMTPlus2} (Eastern European Standard Time)</p>
  `;
  response.send(htmlContent);
});

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find(p => p.id === request.params.id);
  if (!person) {
    response.status(404).end();
  }
  response.json(person);
});

// DELETE
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter(p => p.id !== id);
  response.status(204).end();
});


const generateId = () => {
  const newId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  return newId;
};

// POST
app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  };
  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then(savedPerson => {
    response.json(savedPerson);
  });
});

// Listen
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
