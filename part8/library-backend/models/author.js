import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
  },
  bookCount: {
    type: Number,
    default: 0,
  },
})

schema.plugin(uniqueValidator)

const Author = mongoose.model('Author', schema)
export default Author
