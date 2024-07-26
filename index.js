const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

// CORS
app.use(cors());

// Adding JSON parser
app.use(express.json());
// Logger
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// Phonebook default
let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

// GET
app.get('/api/persons', (request, response) => {
  response.json(persons);
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
  const existingPerson = persons.find(p => p.name === body.name);
  if (existingPerson) {
    return response.status(409).json({
      error: 'name must be unique'
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = persons.concat(person);
  response.json(person);
});

// Listen
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
