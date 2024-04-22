import Author from '../models/author.js'
import { GraphQLError } from 'graphql'
export const typeDef = `
    type Author {
        name: String!
        born: Int
        id: ID!
        bookCount: Int
    }

    extend type Query {
        allAuthors: [Author]!
        authorCount: Int
    }
    extend type Mutation {
        editAuthor(name: String!,setBornTo: Int!): Author
    }
`

export const resolvers = {
  // Author: {
  //   bookCount: async (root, args) => {
  //     const count = await Book.find({ author: root.id })
  //     return count.length
  //   },
  // },
  Query: {
    allAuthors: async () => {
      const authors = await Author.find({})
      console.log(authors)
      return authors
    },
    authorCount: async () => await Author.collection.countDocuments(),
  },
  Mutation: {
    editAuthor: async (_, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not autenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      const toEdit = await Author.findOne({ name: args.name })
      if (toEdit) {
        toEdit.born = Number(args.setBornTo)
      }
      try {
        await toEdit.save()
      } catch (error) {
        throw new GraphQLError('Invalid author', {
          extensions: {
            code: 'NOT_FOUND_DATA',
            invalidArgs: args.name,
            error,
          },
        })
      }
      return toEdit
    },
  },
}
