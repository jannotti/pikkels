import uuidv4 from "uuid/v4";

import db from "./db";

export const users = {
  1: {
    id: "1",
    username: "John Jannotti",
  },
  2: {
    id: "2",
    username: "Genevieve Patterson",
  },
};

const leagues = {
  1: {
    id: "1",
    text: JSON.stringify(db),
    userId: "2",
  },
};

const me = users["1"];

const resolvers = {
  Query: {
    me: () => {
      return me;
    },
    user: (parent, { id }) => {
      return users[id];
    },
    users: () => {
      return Object.values(users);
    },
    league: (parent, { id }) => {
      return leagues[id];
    },
    leagues: () => {
      return Object.values(leagues);
    },
  },

  Mutation: {
    createLeague: (parent, { text }, { me }) => {
      const id = uuidv4();
      const league = {
        id,
        text,
        userId: me.id,
      };

      leagues[id] = league;
      // users[me.id].leagueIds.push(id);
      return league;
    },
    deleteLeague: (parent, { id }) => {
      delete leagues[id];
      return true;
    },
  },

  User: {
    leagues: user => {
      return Object.values(leagues).filter(league => league.userId === user.id);
    },
  },

  League: {
    user: league => {
      return users[league.userId];
    },
  },
};

export default resolvers;
