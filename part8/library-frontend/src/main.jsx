import ReactDOM from 'react-dom/client'
import React from 'react'
import App from './App.jsx'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
const authLink = setContext((_, { headers }) => {
  const token = JSON.parse(localStorage.getItem('login_jwt_token'))
  console.log('AuthTOken', token)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token.value}` : null,
    },
  }
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
  })
)

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
)
