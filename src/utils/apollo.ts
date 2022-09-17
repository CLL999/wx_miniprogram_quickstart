import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from, split } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition, relayStylePagination } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

import { WebSocketImpl, fetch } from './network'

function getAuthHeader() {
  const token: string = uni.getStorageSync('token')
  return { authorization: token ? `Bearer ${token}` : '' }
}

const loggerLink = new ApolloLink((operation, forward) => {
  const startTime = Date.now()

  return forward(operation).map(result => {
    const definition = getMainDefinition(operation.query)

    if (definition.kind === 'OperationDefinition') {
      const duration = Date.now() - startTime

      const parts = [
        '%capollo',
        `%c${definition.operation}`,
        `%c${operation.operationName}`,
        `%c(${result.errors ? 'err' : 'ok'}${
          definition.operation !== 'subscription' ? ` in ${duration}ms` : ''
        })`,
      ]

      const styles = [
        'color: gray; font-weight: lighter;',
        `color: ${
          { query: '#0AD6FF', mutation: '#D64292', subscription: '#FFC30A' }[definition.operation]
        };`,
        'color: inherit;',
        `color: ${result.errors ? 'red' : 'gray'}; font-weight: lighter;`,
      ]

      console.groupCollapsed(parts.join(' '), ...styles)
      const output = result.errors ? console.error : console.log
      output({ operation, result })
      console.groupEnd()
    }

    return result
  })
})

const httpLink = from([
  setContext((_, { headers }) => ({ headers: { ...headers, ...getAuthHeader() } })),
  new HttpLink({ uri: import.meta.env.VITE_API_URL, fetch }),
])

const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_API_WS_URL,
    connectionParams: () => ({ headers: getAuthHeader() }),
    webSocketImpl: WebSocketImpl,
  }),
)

export const apolloClient = new ApolloClient({
  link: from([
    loggerLink,
    split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
      },
      wsLink,
      httpLink,
    ),
  ]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // itemsWithRelay: relayStylePagination(['']),
        },
      },
    },
  }),
})
