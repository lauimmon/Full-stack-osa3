const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})  

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if ( person ) {
        res.json(person)
      } else {
        res.status(404).end()
      }
})

app.get('/info', (req, res) => {
    res.send(
        '<p>puhelinluettelossa ' + persons.length + ' henkilön tiedot</p>' + 
        '<p> ' + new Date() + '</p>'
    )
}) 

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
  
    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 10000000)
}

const existingName = (name) => {
    return persons.find(person => person.name === name)
}
  
app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({error: 'name or number missing'})
    } 
    if (existingName(body.name)) {
        return res.status(400).json({error: 'name must be unique'})
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId()
    }
  
    persons = persons.concat(person)
  
    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})