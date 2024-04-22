import Book from '../models/book.js'
import Author from '../models/author.js'
import { GraphQLError } from 'graphql'
import { pubsub } from '../index.js'
export const typeDef = `
    type Book {
        title: String! 
        published: Int!
        author: Author!
        genres: [String!]!
        id: ID!
    }

    extend type Query {
        allBooks(author: String,genre: String): [Book]!
        bookCount: Int
    }

    extend type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genres: [String!]!
        ): Book!
    }

`

export const resolvers = {
  Query: {
    allBooks: async (_, args) => {
      let books = args.genre
        ? await Book.find({ genres: args.genre }).populate('author')
        : await Book.find({}).populate('author')
      if (args.author) {
        books = books.filter((b) => b.author.name === args.author)
      }
      console.log(books)
      return books
    },
    bookCount: async () => await Book.collection.countDocuments(),
  },
  Mutation: {
    addBook: async (_, args, context) => {
      const currentUser = context.currentUser
      const authorName = args.author

      if (!currentUser) {
        throw new GraphQLError('not autenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      if (authorName.length < 4) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: authorName,
          },
        })
      }

      let author = await Author.findOne({ name: authorName })
      if (!author && authorName.length > 3) {
        author = new Author({ name: authorName })
      }
      const book = new Book({ ...args, author: author._id })
      console.log('Libro:', book)
      try {
        await book.save()
        author.bookCount = author.bookCount + 1
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            error,
          },
        })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      const response = { ...book._doc, author }
      console.log(response)
      return response
    },
  },
}
