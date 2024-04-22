import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 4,
    required: true,
  },
  favoriteGenre: {
    type: String,
    minlength: 4,
  },
})

schema.plugin(uniqueValidator)

const User = mongoose.model('User', schema)
export default User
