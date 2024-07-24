const express = require('express');
const app = express();

// Adding JSON parser
app.use(express.json());

// Phonebook default
const persons = [
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

// Listen
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
