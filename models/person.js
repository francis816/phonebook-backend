const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

console.log(`connecting to ${url}`)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: function (num) {
        if (num.includes('-')) {
          return /\d{2}-\d{7}/.test(num) || /\d{3}-\d{8}/.test(num) || /\d{3}-\d{3}-\d{4}/.test(num) //US phonenumber style
        }
      },
      message: props => `${props.value} is not a valid phone number!eg. 09-1234556, 040-22334455, 937-222-3332 are valid phone numbers`
    },
  }

})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)