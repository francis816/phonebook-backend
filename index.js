const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
// I prefer the self-made middleware > morgan
const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
};


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
// requestLogger must be used after json parser
app.use(requestLogger);

morgan.token("body", request => JSON.stringify(request.body));

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> ${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => {
        return person.id === id
    })
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => {
        return person.id !== id
    })
    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: "name missing"
        })
    }
    const personExists = name => {
        return persons.find(person => {
            return person.name === name
        })
    }

    if (personExists(body.name)) {
        return response.status(400).json({
            error: "name already exists"
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: "number missing"
        })
    }
    const person = {
        "id": Math.floor(Math.random() * 1000000000),
        "name": body.name,
        "number": body.number
    }
    persons = persons.concat(person)
    response.json(person)
})


// e.g. if someone tries to go to localhost:3001/akjkajg
// we will send him an error in JSON on the page 
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})