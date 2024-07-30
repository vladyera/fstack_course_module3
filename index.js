const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

// CORS
app.use(cors())
// For static website
app.use(express.static('dist'))
// Adding JSON parser
app.use(express.json())
// Logger
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// GET
app.get('/api/persons', (request, response, next) => { // Added next
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(error => next(error))
})

app.get('/api/info', (request, response, next) => { // Added next
  Person.find({}).then(persons => {
    const numberOfPersons = persons.length
    const currentTime = new Date()
    currentTime.setHours(currentTime.getHours() + 2)
    const currentTimeGMTPlus2 = currentTime.toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' GMT+2'
    const htmlContent = `
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${currentTimeGMTPlus2} (Eastern European Standard Time)</p>
  `
    response.send(htmlContent)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => { // Added next
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// DELETE
app.delete('/api/persons/:id', (request, response, next) => { // Added next
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// POST
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// PUT
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Error handlers in middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error('Error handler triggered')
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

// Listen
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
