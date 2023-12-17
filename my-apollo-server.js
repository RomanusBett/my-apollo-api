const { ApolloServer, gql } = require('apollo-server-micro');
const microCors = require('micro-cors');
const fetch = require('node-fetch');

const cors = microCors();

const typeDefs = gql`
  type Query {
    categories: [String]
    randomJoke(category: String!): Joke
  }

  type Joke {
    value: String
  }
`;

const resolvers = {
  Query: {
    categories: async () => {
      try {
        const response = await fetch('https://api.chucknorris.io/jokes/categories');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Failed to fetch categories');
      }
    },
    randomJoke: async (_, { category }) => {
      try {
        const response = await fetch(`https://api.chucknorris.io/jokes/random?category=${category}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching random joke:', error);
        throw new Error('Failed to fetch random joke');
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

module.exports = cors((req, res) => server.createHandler()(req, res));
