// this file cannot be named with .cjs extension
module.exports = {
  client: {
    service: {
      name: 'Contacts',
      includes: ['./src/graphql/documents/api/**/*.graphql'],
      localSchemaFile: './src/graphql/schema.graphql',
    },
  },
}
