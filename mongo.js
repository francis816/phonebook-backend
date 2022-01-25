const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}


const password = process.argv[2]
const inputName = process.argv[3]
const inputNumber = process.argv[4]

const url =
    `mongodb+srv://cph816:${password}@cluster0.grodr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: inputName,
  number: inputNumber
})

if (inputName && inputNumber) {
  person.save().then(result => {
    console.log(`added ${inputName} ${inputNumber} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.nubmer}`)
    })
    mongoose.connection.close()
  })
}