import { GraphQLError } from 'graphql'
import User from '../models/user.js'
export const typeDef = `
    type User {
        username: String!
        favoriteGenre: String!
        id: ID!
    }

    extend type Query {
        me: User
    }

    extend type Mutation {
        createUser(
            username: String!
            favoriteGenre: String!
        ): User
    }
`

export const resolvers = {
  Query: {
    me: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError()
      }
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const { username, favoriteGenre } = args
      try {
        const user = new User({ username, favoriteGenre })
        await user.save()
        return user
      } catch (error) {
        throw new GraphQLError('invalid user', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      }
    },
  },
}
