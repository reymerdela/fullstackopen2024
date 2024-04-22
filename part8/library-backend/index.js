import mongoose from 'mongoose'
import User from './models/user.js'
import { PubSub } from 'graphql-subscriptions'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import cors from 'cors'
import express from 'express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import http from 'http'
import 'dotenv/config'
export const pubsub = new PubSub()

import {
  typeDef as authorType,
  resolvers as authorResolvers,
} from './schemas/author.js'
import {
  typeDef as bookType,
  resolvers as bookResolvers,
} from './schemas/book.js'
import {
  typeDef as tokenType,
  resolvers as tokenResolvers,
} from './schemas/token.js'
import {
  typeDef as userType,
  resolvers as userResolvers,
} from './schemas/user.js'
const MongoDB_URI = process.env.MONGODB_URI

mongoose
  .connect(MongoDB_URI)
  .then(() => {
    console.log('Connected to', MongoDB_URI)
  })
  .catch((error) => {
    console.log('Error connecting to MongoDb', error.message)
  })
mongoose.set('debug', true)

const query = `
type Query {
  dummy: Int
}
`
const mutation = `
type Mutation {
  _empty: String
}
`
const subscripctions = `
type Subscription {
  bookAdded : Book!
}
`
const subscripctionsResolver = {
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
}

const schema = makeExecutableSchema({
  typeDefs: [
    query,
    mutation,
    subscripctions,
    authorType,
    bookType,
    tokenType,
    userType,
  ],
  resolvers: _.merge(
    subscripctionsResolver,
    authorResolvers,
    bookResolvers,
    tokenResolvers,
    userResolvers
  ),
})
const app = express()
const httpServer = http.createServer(app)
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/',
})
const serverCleanup = useServer({ schema }, wsServer)

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup()
          },
        }
      },
    },
  ],
})

await server.start()

app.use(
  '/',
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.startsWith('Bearer ')) {
        const decodedToken = jwt.verify(
          auth.substring(7),
          process.env.JWT_SECRET
        )
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      }
    },
  })
)

const PORT = 4000
httpServer.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`)
})

// const typeDefs = `
//   type User {
//     username: String!
//     favoriteGenre: String!
//     id: ID!
//   }

//   type Token {
//     value: String!
//     user: User!
//   }

//   type Book {
//    title: String!
//     published: Int!
//     author: Author!
//     genres: [String!]!
//     id: ID!
//   }

//   type Author {
//     name: String!
//     born: Int
//     id: ID!
//     bookCount: Int
//   }

//   type Query {
//     dummy: Int
//     bookCount: Int
//     authorCount: Int
//     allBooks(author: String,genre: String): [Book]!
//     allAuthors: [Author]!
//     me: User
//   }

//   type Mutation {
//     addBook(
//       title: String!
//       author: String!
//       published: Int!
//       genres: [String!]!
//     ): Book!
//     editAuthor(name: String!,setBornTo: Int!): Author
//     createUser(
//       username: String!
//       favoriteGenre: String!
//     ): User
//     login(
//       username: String!
//       password: String!
//     ): Token
//   }
// `
// const resolvers = {
//   Author: {
//     bookCount: async (root, args) => {
//       const count = await Book.find({ author: root.id })
//       return count.length
//     },
//   },
//   Query: {
//     dummy: () => 0,
//     bookCount: async () => await Book.collection.countDocuments(),
//     authorCount: async () => await Author.collection.countDocuments(),
//     allBooks: async (_, args) => {
//       let books = args.genre
//         ? await Book.find({ genres: args.genre }).populate('author')
//         : await Book.find({}).populate('author')
//       if (args.author) {
//         books = books.filter((b) => b.author.name === args.author)
//       }
//       return books
//     },
//     allAuthors: async () => {
//       const authors = await Author.find({})
//       console.log(authors)
//       return authors
//     },
//     me: async (root, args, context) => {
//       if (!context.currentUser) {
//         throw new GraphQLError('not authenticated', {
//           context: { code: 'BAD_USER_INPUT' },
//         })
//       }
//       return context.currentUser
//     },
//   },
//   Mutation: {
//     addBook: async (_, args, context) => {
//       const currentUser = context.currentUser
//       if (!currentUser) {
//         throw new GraphQLError('not autenticated', {
//           extensions: {
//             code: 'BAD_USER_INPUT',
//           },
//         })
//       }
//       const authorName = args.author
//       let author = await Author.findOne({ name: authorName })
//       if (!author) {
//         author = new Author({ name: authorName })
//         try {
//           await author.save()
//         } catch (error) {
//           throw new GraphQLError('Saving author failed', {
//             extensions: {
//               code: 'BAD_USER_INPUT',
//               invalidArgs: args.author,
//               error,
//             },
//           })
//         }
//       }
//       const book = new Book({ ...args, author })
//       try {
//         await book.save()
//       } catch (error) {
//         throw new GraphQLError('Saving book failed', {
//           extensions: {
//             error,
//           },
//         })
//       }
//       return book
//     },
//     editAuthor: async (_, args, context) => {
//       const currentUser = context.currentUser
//       if (!currentUser) {
//         throw new GraphQLError('not autenticated', {
//           extensions: {
//             code: 'BAD_USER_INPUT',
//           },
//         })
//       }
//       const toEdit = await Author.findOne({ name: args.name })
//       if (toEdit) {
//         toEdit.born = Number(args.setBornTo)
//       }
//       try {
//         await toEdit.save()
//       } catch (error) {
//         throw new GraphQLError('Invalid author', {
//           extensions: {
//             code: 'NOT_FOUND_DATA',
//             invalidArgs: args.name,
//             error,
//           },
//         })
//       }
//       return toEdit
//     },
//     login: async (root, args, context) => {
//       const { username, password } = args
//       const user = await User.findOne({ username })
//       if (!user || password !== 'root') {
//         throw new GraphQLError('wrong credentials', {
//           extensions: {
//             code: 'BAD_USER_INPUT',
//           },
//         })
//       }
//       const userForToken = {
//         username,
//         id: user._id,
//       }
//       const token = {
//         value: jwt.sign(userForToken, process.env.JWT_SECRET),
//         user,
//       }
//       return token
//     },
//     createUser: async (root, args) => {
//       const { username, favoriteGenre } = args
//       try {
//         const user = new User({ username, favoriteGenre })
//         await user.save()
//         return user
//       } catch (error) {
//         throw new GraphQLError('invalid user', {
//           extensions: {
//             code: 'BAD_USER_INPUT',
//             invalidArgs: args.username,
//             error,
//           },
//         })
//       }
//     },
//   },
// }

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// })

// startStandaloneServer(server, {
//   listen: { port: 4000 },
//   context: async ({ req, res }) => {
//     const auth = req ? req.headers.authorization : null
//     if (auth && auth.startsWith('Bearer ')) {
//       const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
//       const currentUser = await User.findById(decodedToken.id)
//       return { currentUser }
//     }
//   },
// }).then(({ url }) => {
//   console.log(`Server ready at ${url}`)
// })
