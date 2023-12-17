const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const fetch = require('node-fetch');

const app = express();

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

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
