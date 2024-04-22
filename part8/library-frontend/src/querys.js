import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query AllAuthors {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
      user {
        favoriteGenre
        id
        username
      }
    }
  }
`

export const ALL_BOOKS = gql`
  query AllBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      title
      published
      author {
        name
      }
      genres
      id
    }
  }
`
export const NEW_BOOK = gql`
  mutation AddBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`
export const NEW_BIRTH_YEAR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
    }
  }
`

export const BOOKS_ADDED = gql`
  subscription BookAdded {
    bookAdded {
      title
      published
      author {
        name
        bookCount
        id
        born
      }
      genres
      id
    }
  }
`
