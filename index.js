'use strict'

const express = require( 'express' );
const graphqlHTTP = require( 'express-graphql' );
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull
} = require( 'graphql' );
const { getVideoById, getVideos, createVideo } = require( './src/data' );

const PORT = process.env.PORT || 3000;
const server = express();

const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'A video that exists',
  fields: {
    id: {
      type: GraphQLID,
      description: 'The id of the video'
    },
    title: {
      type: GraphQLString,
      description: 'The title of the video'
    },
    duration: {
      type: GraphQLInt,
      description: 'The length of the video in minutes'
    },
    watched: {
      type: GraphQLBoolean,
      description: 'Whether or not the user has watched the video'
    }
  }
});

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type',
  fields: {
    video: {
      type: videoType,
      args: {
        id: {
          type: new GraphQLNonNull( GraphQLID ),
          description: 'The id of the video'
        }
      },
      resolve: ( _, args ) => getVideoById( args.id )
    },
    videos: {
      type: new GraphQLList( videoType ),
      resolve: getVideos
    }
  }
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root mutation type',
  fields: {
    createVideo: {
      type: videoType,
      args: {
        title: {
          type: new GraphQLNonNull( GraphQLString ),
          description: 'The title of the video'
        },
        duration: {
          type: new GraphQLNonNull( GraphQLInt ),
          description: 'The length of the video in minutes'
        },
        watched: {
          type: new GraphQLNonNull( GraphQLBoolean ),
          description: 'Whether or not the user has watched the video'
        }
      },
      resolve: ( _, args ) => createVideo( args )
    }
  }
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

server.use( '/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

server.listen( PORT, () => (
  console.log( `Listening on http://localhost:${PORT}` )
));
