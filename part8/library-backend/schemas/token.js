import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
export const typeDef = `
    type Token {
        value: String!
        user: User!
    }

    extend type Mutation {
        login(
            username: String!
            password: String!
        ): Token
    }
`

export const resolvers = {
  Mutation: {
    login: async (root, args, context) => {
      const { username, password } = args
      const user = await User.findOne({ username })
      if (!user || password !== 'root') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      const userForToken = {
        username,
        id: user._id,
      }
      const token = {
        value: jwt.sign(userForToken, process.env.JWT_SECRET),
        user,
      }
      return token
    },
  },
}
