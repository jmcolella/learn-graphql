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
  GraphQLNonNull,
  GraphQLInputObjectType
} = require( 'graphql' );
const { getVideoById, getVideos, createVideo } = require( './src/data' );
const nodeInterface = require('./src/node');

const PORT = process.env.PORT || 3000;
const server = express();

const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'A video that exists',
  fields: {
    id: {
      type: new GraphQLNonNull( GraphQLID ),
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
  },
  interfaces: [
    nodeInterface
  ]
});

module.exports = videoType;

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

const videoInputType = new GraphQLInputObjectType({
  name: 'VideoInput',
  fields: {
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


const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root mutation type',
  fields: {
    createVideo: {
      type: videoType,
      args: {
        video: {
          type: new GraphQLNonNull( videoInputType )
        }
      },
      resolve: ( _, args ) => createVideo( args.video )
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
