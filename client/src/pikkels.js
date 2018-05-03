/* eslint-disable no-labels, no-use-before-define */

import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import moment from 'moment';
//import cx from 'classnames';

import Chip from 'material-ui/Chip';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import {red500} from 'material-ui/styles/colors';

import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import Delete from 'material-ui/svg-icons/action/delete';

import * as firebase from 'firebase';

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyD7XCiSz3toIGudX9eKJ2b2UIEkLvB-n_A",
  authDomain: "pikkels-eec0c.firebaseapp.com",
  databaseURL: "https://pikkels-eec0c.firebaseio.com",
  storageBucket: "pikkels-eec0c.appspot.com",
  messagingSenderId: "45401401652"
});


import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css';
const uiConfig = {
  signInSuccessUrl: '?success',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  tosUrl: '?tos'
};

const DB = {
  leagues: [1],
  1: {name: "Providence Kickball", nick: 'PKL', year: 2018,
      schedule: 22, divisions: [2]},

  2: {name: "United", gpt: 10, ensure: [[5,16],[3,4],[5,6],[7,8],[20,21],[18,19]], avoid: [[3,9],[3,20],[3,21],[4,20],[4,21],[5,21]],
      teams: [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]},

  3: {name: "Muscle Cobra, Inc.", nick: "Muscle Cobra",
      exclude: ["11AM", "12PM", "1PM",
                "Jul 7", "Jul 14", "Jul 22", "Jul 28"]},
  4: {name: "The Wolfpack", nick: "Wolfpack"},
  5: {name: "Meat Sweats", exclude: ["Aug 11"]},
  6: {name: "Ball is Life"},
  // For unstoppaballs, Jun 2 and Sep 25 is ok if 12pm or 1pm game
  7: {name: "Unstoppaballs", exclude: ["May 26", "Jun 2", "Aug 21", "Sep 25"]},
  8: {name: "Ball 12 For Action", nick: "Ball 12", exclude: ["Jul 29"] },
  9: {name: "Narragansett Baywatch", nick: "Baywatch"},
  10: {name: "Dexter Park Rangers", nick: "Rangers"},
  11: {name: "Trailer Park Problems", nick: "TPP"},
  12: {name: "Trippin' Marios", nick: "Marios"},
  13: {name: "GFY"},
  14: {name: "Glamazons"},
  15: {name: "Los Equipped", nick: "Equipped"},
  16: {name: "The Stilettos", nick: "Stilettos"},
  17: {name: "Fox Point Booters", nick: "Fox Point"},
  18: {name: "Bad Taste"},
  19: {name: "Lazy Progressives"},
  20: {name: "Jedi Mind Kicks"},
  21: {name: "Clams Casino", nick: "Clams"},

  22: {
    leftover: [],
    calendar: {
      "May 26": {"11AM": 0, "12PM": 0, "1PM": 0, "2PM": 0,
                 "3PM": 0, "4PM": 0, "5PM": 0, "6PM": 0},
      "Jun 2":  {"11AM": 0, "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
      "Jun 9": {"11AM": 0, "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
      "Jun 16": {"11AM": 0, "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
      "Jun 23": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
      "Jun 30": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
      "Jul 7": {"11AM": 0, "12PM": 0, "1PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
      "Jul 14": {"11AM": 0, "12PM": 0, "1PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
      "Jul 21": {"11AM": 0, "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
      "Jul 28": {"11AM": 0, "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
      "Aug 4":  {"11AM": 0, "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
      "Aug 11": {"11AM": 0, "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
      "Aug 18": {"11AM": 0, "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
      "Aug 25": {"11AM": 0, "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
      "Sep 1":  {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
    }},
};

function slug(...strings) {
  var s = strings.join().toLowerCase();
  s = s.replace(/[^A-Za-z0-9]+/g,"=");
  s = s.replace(/=+/g,"-");
  return s;
}

function extractParenthetical(str) {
  const hasParens = /\s*\((.*)\)\s*$/;
  const found = str.match(hasParens);
  if (found) {
    const inside = found[1];
    return [str.replace(hasParens, ""), inside];
  } else {
    return [str, false];
  }
}

function matches(m1, m2) {
  return _.isEqual(m1, m2) || _.isEqual([m1[1],m1[0]], m2);
}

class Game {
  constructor(arg) {
    if (typeof arg === "number") {
      this.id = arg;
    } else {
      this.matchup = arg;
      this.id = hydrate.ID++;
      this.tellTeams(true);
    }
    this.pinned = false;
  }

  hydrate (id, db) {
    const json = db[id];
    this.matchup = json.matchup.map(t => hydrate(Team, t, db));
    this.tellTeams(true);
    if ('winner' in json)
      this.winner = hydrate(Team, json.winner, db);
    else
      this.winner = null;
    if ('score' in json) {
      this.score = json.score;
      if (this.score[0] > this.score[1])
        this.winner = this.matchup[0];
      else if (this.score[1] > this.score[0]) {
        this.winner = this.matchup[1];
      }
    }
    this.pinned = !!json.pinned;
  }

  dehydrate(db, mark) {
    const id = this.id;
    if (mark.has(id))
      return id;
    mark.add(id);

    db[id] = {
      matchup: this.matchup.map(team => team.dehydrate(db, mark)),
      winner: this.winner ? this.winner.dehydrate(db, mark) : null,
      pinned: this.pinned,
    }
    if ('score' in this)
      db[id].score = this.score;
    return id;
  }


  tellTeams(add) {
    if (add)
      this.matchup.forEach(team => team.addGame(this));
    else
      this.matchup.forEach(team => team.removeGame(this));
  }

  matches(matchup) {
    return _.isEqual(this.matchup, matchup)
  }
  satisfies(matchup) {
    return this.involves(matchup[0]) && this.involves(matchup[1]);
  }

  involves(team) {
    return this.matchup[0] === team || this.matchup[1] === team;
  }
}

class Schedule {
  constructor(id, db) {
    this.id = id;
    const json = db[id];
    this.leftover = [];
    if ('leftover' in json)
      this.leftover = json.leftover.map(game => hydrate(Game, game, db));
    this.calendar = _.mapValues(json.calendar, (slots, date) => {
      return _.mapValues(slots, game => {
        if (!game)
          return null
        return hydrate(Game, game, db);
      });
    });
  }

  dehydrate(db, mark) {
    const id = this.id;
    if (mark.has(id))
      return id;
    mark.add(id);

    const calendar = _.mapValues(this.calendar, (slots, date) => {
      return _.mapValues(slots, (game, slot) => {
        return game ? game.dehydrate(db, mark) : 0;
      })
    });
    const leftover = this.leftover.map(game => game.dehydrate(db, mark));

    db[id] = { calendar, leftover };
    return id;
  }

  usage() {
    let count = 0;
    let filled = 0;
    for (const [, , game] of this.games()) {
      count++;
      if (game)
        filled++;
    }
    return [count, filled];
  }

  swap(...positions) {
    const games = positions.map(p => this.calendar[p[0]][p[1]]);
    const expected = games.length;
    const dedupped = new Set(games);
    if (dedupped.size !== expected)
      return;                        // refuse
    games.splice(0, 0, games.pop()); // rotate
    positions.forEach((p,i) => this.calendar[p[0]][p[1]] = games[i]);
  }
  
  // Move the game at d1,t1 to d2,t2, and pin it.
  move([d1, t1], [d2, t2]) {
    this.swap([d1, t1], [d2, t2]);
    const moved = this.calendar[d2][t2];
    if (moved)
      moved.pinned = true;
  }
  
  trySwap(...positions) {
    this.swap(...positions);
    if (this.allGood(...positions))
      return true;
    this.swap(...positions.reverse());
    return false;
  }

  canSwap(...positions) {
    this.swap(...positions);
    const ok = this.allGood(...positions)
    this.swap(...positions.reverse());
    return ok;
  }

  allGood(...positions) {
    return positions.every(p => this.good(p));
  }
  good([d, t]) {
    const game = this.calendar[d][t];
    if (!game)
      return true;
    return this.canPlace(game.matchup, d, t);
  }
  
  
  find(matchup) {
    for (const [date, time, game] of this.games()) {
      if (game && game.satisfies(matchup))
        return [date, time, game];
    }
    console.log("Can't find", matchup);
    return [undefined, undefined, undefined];
  }

  add(matchup) {
    const game = new Game(matchup);
    for (const [date, time, existing] of this.games()) {
      if (existing)
        continue;
      this.calendar[date][time] = game
      return;
    }
    this.calendar.leftover.push(game);
  }

  remove(matchup) {
    const [date, time, game] = this.find(matchup);
    if (date && time && game) {
      this.calendar[date][time] = null;
      game.tellTeams(false);
    }
  }

  clear() {
    const games = this.leftover;
    this.leftover = [];
    this.calendar = _.mapValues(this.calendar, (slots, date) => {
      return _.mapValues(slots, (game, slot) => {
        if (game) {
          if (game.pinned) {
            return game;
          }
          games.push(game);
        }
        return 0;
      })
    });
    return games;
  }

  dates() {
    // Gives all the dates used by this Schedule, sorted chronologically.
    return _.sortBy(Object.keys(this.calendar), Date.parse);
  }
  nextDate() {
    // Returns next week after the last date used
    const last = moment(Date.parse(this.dates().pop()))
    const next = last.add(7, "days");
    return next.format("MMM D");
  }
  nextTime() {
    // Returns next time after the last time used
    const last = moment(`June 14, 1974 ${this.times().pop()}`, "MMM DD, YYYY hha");
    const next = last.add(1, "hour");
    return next.format("ha").toUpperCase();
  }

  dayMoment(str) {
    moment(str, "MMM DD, YYYY")
  }

  times() {
    // Gives all the times used by the Schedule, sorted chronologically.
    const allTimes = _.uniq(_.flatMap(this.calendar,
                                      slots => Object.keys(slots)));
    return _.sortBy(allTimes, time => moment(`June 14, 1974 ${time}`,
                                             "MMM DD, YYYY hha"));
  }

  *games() {
    for (const date of this.dates()) {
      const slots = this.calendar[date];
      for (const [time, game] of Object.entries(slots)) {
        yield [date, time, game, slots]; // slots last because rarely needed
      }
    }
  }

  fix() {
    for (const [hdate, htime, hgame] of this.games()) {
      if (!hgame || hgame.pinned || this.canPlace(hgame.matchup, hdate, htime))
        continue;
      // we have a hater!
      CANDIDATES:
      for (const [c1date, c1time, c1game] of this.games()) {
        if (c1game === hgame || (c1game && c1game.pinned))
          continue;
        if (this.trySwap([hdate, htime], [c1date, c1time])) {
          break;
        }
        if (!c1game)
          continue;
        for (const [c2date, c2time, c2game] of this.games()) {
          if (c2game === hgame || c2game === c1game || (c2game && c2game.pinned))
            continue;
          const slots = [[hdate, htime], [c1date, c1time], [c2date, c2time]];
          if (this.trySwap(...slots)) {
            break CANDIDATES;
          }
          if (this.trySwap(...slots.reverse())) {
            break CANDIDATES;
          }
        }
      }
    }
  }

  demerits(matchup, date, time) {
    let badness = 0;
    
    // Skip if either team hates the spot.
    for (const team of matchup) {
      if (team.hates(date, time))
        badness += 100;
    }

    // Skip if either team already plays in a game that day.
    const others = this.calendar[date];
    const twoaday = !!_.find(others, (game, othertime) => {
      if (game && time !== othertime && game.matchup !== matchup) {
        for (const team of matchup) {
          if (game.involves(team))
            return true;
        }
      }
      return false;
    });
    if (twoaday)
      badness += 100;

    return badness;
  }

  canPlace(matchup, date, time) {
    return this.demerits(matchup, date, time) < 100;
  }
  
  // Tries to find the best game for date & time, but will not
  // accept anything that scores about cutoff (if specified, and
  // positive).
  extractBest(games, date, slot, cutoff=0) {
    if (games.length === 0)
      return null;
    const scores = games.map((g, i) =>
                             [this.demerits(g.matchup, date, slot), i]);
    const best = _.minBy(scores, s => s[0]);
    if (cutoff > 0 && best[0] >= cutoff)
      return null;
    const game = games[best[1]];
    games.splice(best[1], 1);
    return game;
  }

}


class Division {
  constructor(id) {
    this.id = id;
  }

  hydrate(id, db) {
    const json = db[id];
    this.name = json.name;
    this.nick = false;
    if ('nick' in json) this.nick = json.nick;
    this.gpt = json.gpt;

    this.avoid = json.avoid.map(pair => {
      return pair.map(id => hydrate(Team, id, db))
    });
    this.ensure = json.ensure.map(pair => {
      return pair.map(id => hydrate(Team, id, db))
    });

    this.teams = json.teams.map(id => {
      const team = hydrate(Team, id, db);
      team.division = this;
      return team;
    });
  }

  dehydrate(db, mark) {
    const id = this.id;
    if (mark.has(id))
      return id;
    mark.add(id);

    db[id] = {
      name: this.name,
      nick: this.nick,
      gpt: this.gpt,
      avoid: this.avoid.map(a => a.map(team => team.dehydrate(db, mark))),
      ensure: this.ensure.map(e => e.map(team => team.dehydrate(db, mark))),
      teams: this.teams.map(team => team.dehydrate(db, mark)),
    }
    return id;
  }

  nickname() {
    if (this.nick)
      return this.nick;
    return this.name;
  }

  addTeam(team) {
    if (team.division)
      team.division.removeTeam(team);

    const oldlen = this.teams.length
    this.teams.push(team);
    if (this.gpt % (oldlen-1) === 0)    // Was round-robin? Maintain.
      this.gpt++;
    else if (oldlen % 2 === 0 && this.gpt % 2 === 1)
      this.gpt--;               // Can't have odd # of games in odd sized div.
    team.division = this;
  }

  removeTeam(team) {
    const oldlen = this.teams.length
    console.log(this.teams, team);
    const i = this.teams.findIndex(t => t === team);
    if (i === -1)
      return;
    this.teams.splice(i, 1);
    if (this.gpt % (oldlen-1) === 0)    // Was round-robin? Maintain.
      this.gpt--;
    else if (oldlen % 2 === 0 && this.gpt % 2 === 1)
      this.gpt++;               // Can't have odd # of games in odd sized div.
    team.division = null;
  }

  editName() {
    if (this.nick)
      return `${this.name} (${this.nick})`;
    return this.name;
  }

  fairness(matchup) {
    const r1 = this.teams.indexOf(matchup[0]);
    const r2 = this.teams.indexOf(matchup[1]);
    return 1/Math.abs(r1-r2);
  }

  gameCount() {
    return (this.teams.length * this.gpt)/2;
  }

  avoids(matchup) {
    for (const a of this.avoid) {
      if (matches(matchup, a))
        return true;
    }
    return false;
  }

  matchups() {
    if (this.gpt === this.teams.length-1)
      return _.flatten(_.shuffle(roundRobin(this.teams)));

    let possible = _.flatten(roundRobin(this.teams));

    let used;
    for (let round = 0; round < 50; round++) {
      const counts = {}
      used = new Set();
      possible = _.shuffle(possible);
      for (const team of this.teams) {
        counts[team.id] = 0;
      }
      for (const matchup of this.ensure) {
        const m = possible.find(p => matches(matchup, p));
        used.add(m);
        counts[m[0].id]++;
        counts[m[1].id]++;
      }
      for (const matchup of possible) {
        if (used.has(matchup) || this.avoids(matchup) ||
            counts[matchup[0].id] === this.gpt ||
            counts[matchup[1].id] === this.gpt) {
          continue;
        }
        // const f = this.fairness(matchup);

        used.add(matchup);
        counts[matchup[0].id]++;
        counts[matchup[1].id]++;
      }
      if (Object.values(counts).every(c => c === this.gpt))
        break;
      console.log(round, counts);
    }
    return _.shuffle(Array.from(used));
  }
}

// Returns a list of rounds.  Each round is a list of pairs (matchups).
function roundRobin(teams) {
  // Rotates lst[1..n] by 1, but leaves lst[0] alone!
  // It's pretty specific to round robin scheduling.
  function advance(lst) {
    lst.splice(1, 0, lst.pop());       // Put last element *second*
  }

  teams = [...teams]            // Copy
  
  if (teams.length % 2 === 1) {
    teams.push(undefined);       // Whoever plays 'undefined' has a bye.
  }

  const matchups = [];
  for (let r = 0; r < teams.length-1; r++) {
    const round = [];
    for (let i = 0; i < teams.length/2; i++) {
      const a = teams[i];
      if (a === undefined)
        continue;
      const b = teams[teams.length-1-i];
      if (b === undefined)
        continue;
      round.push(r % 2 ? [a, b] : [b, a]);
    }
    matchups.push(_.shuffle(round));
    advance(teams);
  }
  return matchups;
}


// Flatten the given lists, but do so by "fairly" pulling items from
// each list, according to its relative size until they are empty.
// Does not modify the supplied lists. (Currently copies the lists
// internally, but could maintain positions.)
function fairMerge(...lists) {
  var copies = lists.map(l => [...l].reverse());
  var total = lists.reduce((n, lst) => n + lst.length, 0);

  var merged = [];
  while (total > 0) {
    for (const list of copies) {
      const p = list.length / total;
      if (Math.random() < p) {
        merged.push(list.pop());
        total--;
      }
    }
  }
  return merged;
}

class League {
  constructor(id) {
    this.id = id;
    this.extra = [];
  }

  hydrate(id, db) {
    const json = db[id];
    this.name = json.name;
    this.nick = false;
    if ('nick' in json) this.nick = json.nick;
    this.year = json.year;

    this.divisions = json.divisions.map(id => hydrate(Division, id, db));
    if ('extra' in json) {
      this.extra = json.extra.map(m => m.map(id => hydrate(Team, id, db)));
    } else {
      this.extra = this.pklDefault();
    }
    this.schedule = new Schedule(json.schedule, db);
  }

  dehydrate(db, mark) {
    const id = this.id;
    if (mark.has(id))
      return id;
    mark.add(id);

    db[id] = {
      name: this.name,
      nick: this.nick,
      year: this.year,
    }
    db[id].divisions = this.divisions.map(div => div.dehydrate(db, mark));
    db[id].schedule = this.schedule.dehydrate(db, mark);
    db[id].extra = this.extra.map(m => m.map(t => t.dehydrate(db, mark)));
    return id;
  }

  nickname() {
    if (this.nick)
      return this.nick;
    return this.name;
  }
  
  editName() {
    if (this.nick)
      return `${this.name} (${this.nick})`;
    return this.name;
  }

  gameCount() {
    return this.divisions.reduce((count, div) => count + div.gameCount(), 0);
  }

  teams() {
    return _.flatten(this.divisions.map(d => d.teams));
  }
  
  allMatchups() {
    return fairMerge(_.shuffle([...this.extra]),
                     ...this.divisions.map(d => d.matchups()));
  }

  find(name) {
    for (const div of this.divisions)
      for (const team of div.teams) {
        if (team.name === name || team.nick === name)
          return team;
      }
    console.log("Can't find", name);
    return null;
  }
  vs(name1, name2) {
    return [this.find(name1), this.find(name2)];
  }

  pklDefault() {
    // If divisions have an odd number of teams, add interleague games
    // so that we can schedule everyone on opening day.
    const divsize = this.divisions[0].teams.length;
    if (this.divisions.length === 2 && divsize % 2 === 1) {
      return _.shuffle(_.zip.apply(null, (this.divisions.map(d => d.teams))));
    }
    return [];
  }

  deschedule(matchup) {
    this.schedule.remove(matchup);
  }

  clearGames() {
    for (const div of this.divisions) {
      for (const team of div.teams) {
        team.games = team.games.filter(game => game.pinned);
      }
    }
    return this.schedule.clear();
  }
}


function hydrate(cls, id, db) {
  if (id === null || id === 0)
    return null;
  if (id in hydrate.CATALOG) {
    return hydrate.CATALOG[id];
  }

  if (!(id in db)) {
    console.log(cls, id, " not in database.");
  }
  const obj = new cls(id);
  hydrate.CATALOG[id] = obj;
  obj.hydrate(id, db);
  return obj;
}
function flush(id) {
  delete hydrate.CATALOG[id];
}
hydrate.CATALOG = {};
hydrate.ID = _.max(_.keys(DB).map(_.parseInt))+1;

class Team {
  constructor(arg1, arg2) {
    if (typeof arg === "number") {
      this.id = arg1;
    } else {
      this.name = arg1;
      if (arg2)
        this.nick = arg2;
      this.id = hydrate.ID++;
    }
    this.games = [];
    this.exclude = [];
  }

  hydrate(id, db) {
    const json = db[id];
    this.name = json.name;
    this.nick = false;
    if ('nick' in json) this.nick = json.nick;

    this.games = [];
    if ('games' in json)
      this.games = json.games.map(id => hydrate(Game, id, db));

    this.exclude = [];
    if ('exclude' in json) this.exclude = json.exclude;
  }

  dehydrate(db, mark) {
    const id = this.id;
    if (mark.has(id))
      return id;
    mark.add(id);

    db[id] = {
      name: this.name,
      nick: this.nick,
      exclude: this.exclude,
    }
    db[id].games = this.games.map(game => game.dehydrate(db, mark));
    return id;
  }

  nickname() {
    if (this.nick)
      return this.nick;
    return this.name;
  }

  editName() {
    if (this.nick)
      return `${this.name} (${this.nick})`;
    return this.name;
  }

  wins() {
    return this.games.filter(game => game.winner && game.winner === this).length;
  }

  losses() {
    return this.games.filter(game => game.winner && game.winner !== this).length;
  }

  rank() {
    const w = this.wins();
    const l = this.losses();
    const pct =  (w + l === 0) ? 0.5 : w / (w + l);
    return  (w-l) + pct;
  }

  hates(date, slot) {
    return this.exclude.includes(date) ||
      this.exclude.includes(slot) || this.exclude.includes(slot+" "+date);
  }

  involvedInMatchup(m) {
    return this === m[0] || this === m[1];
  }
  
  addGame(game) {
    if (this.games.includes(game))
      return;
    this.games.push(game);
  }
  removeGame(game) {
    this.games = this.games.filter(g => g !== game);
  }
}

const MODES = ["Schedule", "Play", "Display"];

class LeaguePager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Start with builtin data
      db: DB,
      league: hydrate(League, DB.leagues[0], DB),
      mode: 'Schedule',
    }
  }

  handleModeChange = (event, index, value) => {
    console.log(event,index,value);
    this.setState({mode: value});
  }

  handleRandomize() {
    var games = this.state.league.clearGames();          // removes unpinned games
    if (games.length === 0) {
      // Either all pinned, or none scheduled.  Assume latter for now - new board.
      const matchups = _.shuffle(this.state.league.allMatchups());
      games = matchups.map(m => new Game(m));
    }
    
    // TODO: Consider a first pass that tries to find viable games.

    // Just fill
    for (const [, time, game, slots] of this.state.league.schedule.games()) {
      if (!game)
        slots[time] = games.pop();
    }
    this.state.league.schedule.leftover = games;

    this.state.league.dehydrate(this.state.db, new Set());
    const leagues = [this.state.league.id];
    this.setState({leagues});
    console.log("Save", this.state.db);
  }
  
  handleFix() {
    this.state.league.schedule.fix();

    this.state.league.dehydrate(this.state.db, new Set());
    const leagues = [this.state.league.id];
    this.setState({leagues});
    console.log("Save", this.state.db);
  }

  onUpdate() {
    this.forceUpdate();
  }

  render() {
    const {league, mode} = this.state;
    console.log(this.state);
    const factors = [...league.schedule.times(), ...league.schedule.dates()];
    return (<div className="league">
            <h1>{league.name} {league.year}</h1>
            <Picker value={mode} onChange={this.handleModeChange}
                    choices={MODES}/>
            <Divisions league={league} mode={mode} factors={factors}
                       onUpdate={(r) => this.onUpdate(r)}/>
            <ExtraMatchups league={league} onUpdate={(r) => this.onUpdate(r)}/>
            <RaisedButton primary={true} label="Randomize"
                          onClick={() => this.handleRandomize()} />
            <RaisedButton primary={true} label="Fix"
                          onClick={() => this.handleFix()} />
            <Calendar schedule={league.schedule}
                      onUpdate={(r) => this.onUpdate(r)}/>
            </div>
           );
  }
}

const Divisions = ({league, mode, factors, onUpdate}) => {
  const divisions = league.divisions
        .map(division => <TeamList key={division.id}
                                   division={division}
                                   mode={mode} factors={factors}
                                   onUpdate={onUpdate}/>);
  return <div className="standings row"> {divisions} </div>;
}

Divisions.propTypes = {
  mode: PropTypes.oneOf(MODES)
}

const ExtraMatchups = ({league, onUpdate}) => {
  function remove(i) {
    league.deschedule(league.extra[i]);
    league.extra.splice(i,1);
    onUpdate();
  }
  function add() {
    let team0;
    let count = league.extra.length+1; // Bigger than possible
    for (const t0 of league.divisions[0].teams) {
      const c = league.extra.filter(m => t0.involvedInMatchup(m)).length;
      if (c < count) {
        count = c;
        team0 = t0;
      }
    }
    let team1;
    count = league.extra.length+1; // Bigger than possible
    for (const t1 of league.divisions[1].teams) {
      const c = league.extra.filter(m => t1.involvedInMatchup(m)).length;
      if (c < count) {
        count = c;
        team1 = t1;
      }
    }
    const matchup = [team0, team1];
    league.extra.push(matchup);
    league.schedule.add(matchup);
    onUpdate();
  }
  const extras = league.extra.map((m, i) =>
                                  <li key={i}>
                                  <ExtraMatchup matchup={m}
                                                teams={league.teams()}
                                                onUpdate={onUpdate}/>
                                  <Delete onClick={() => remove(i)}/>
                                  </li>)
  if (league.divisions.length < 2)
    return <div></div>
  return <div className="extra">
    <ol>
    {extras}
    <a onClick={add}> Add an interdivision game. </a>
    </ol>
    </div>;
}

class ExtraMatchup extends React.Component {
  handleTeamChange(m, event, index, value) {
    var {matchup, teams, onUpdate} = this.props;
    matchup[m] = teams[index];
    onUpdate();
  }
  render() {
    var {matchup, teams} = this.props;
    return <span>
      <Picker value={matchup[0]} choices={teams} labeler={t => t.name}
              onChange={(e,i,v) => this.handleTeamChange(0,e,i,v)}/>
      <Picker value={matchup[1]} choices={teams} labeler={t => t.name}
              onChange={(e,i,v) => this.handleTeamChange(1,e,i,v)}/>
      </span>
  }
}


class TeamList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: 0
    };
  }
  edit(id) {
    this.setState({editing: id});
  }
  handleKeyDown(event, named) {
    if (event.keyCode === 13) {
      [named.name, named.nick] = extractParenthetical(event.target.value);
      this.props.onUpdate();
      event.target.blur();
    }
    if (event.keyCode === 27) {
      event.target.blur();
    }
  }
  handleGamesChange(value) {
    this.props.division.gpt = value;
    this.props.onUpdate();
  }
  addTeam() {
    const num = this.props.division.teams.length;
    const team = new Team("Team "+num);
    this.props.division.addTeam(team);
    this.props.onUpdate();
  }


  renderHead() {
    const division = this.props.division;
    if (this.state.editing === this.props.division.id) {
      return <input type="text" autoFocus
                    size="30"
                    onKeyDown={(e) => this.handleKeyDown(e, division)}
                    onBlur={() => this.edit(0)}
                    defaultValue={division.editName()}/>;
    } else {
      return <div onClick={() => this.edit(division.id)}>{division.name} Division</div>
    }
  }

  render() {
    const { division, mode, factors } = this.props;
    // _.sortBy is used for stability, so ties broken by the orignal lexical sort
    const lines = _.sortBy(division.teams
                           .sort((a, b) => a.name.localeCompare(b.name)),
                           t => t.rank())
          .map(team =>
               <TeamLine editing={this.state.editing === team.id}
                         onEdit={(id) => this.edit(id)}
                         key={team.id} team={team} mode={mode} factors={factors}
                         onUpdate={this.props.onUpdate}/>)

    const record = mode === 'Schedule' ? "" :
      <div className="row">
        <div className="col-6"></div>
        <div className="col">Wins</div>
        <div className="col">Losses</div>
      </div>


    let gpts = division.teams.map((t,i) => i+1);
    if (division.teams.length % 2 === 1)
      gpts = gpts.filter(g => g % 2 === 0);
    const games = <Picker value={division.gpt} choices={gpts}
                          onChange={(e,i,v) => this.handleGamesChange(v)}/>;
    const summary = mode !== 'Schedule' ? "" :
      <span className="summary">Requires {division.gameCount()} games.</span>
    return (<div className={slug(division.nickname()) + " division col-md"}>
            <h2>{this.renderHead()}</h2>
            {record}
            {lines}
            {mode !== 'Schedule' ? '' :
             <div className='add' onClick={() => this.addTeam()}>+</div>}
            {games}<br/>
            {summary}
            </div>
    );
  }
}

function identity(x) { return x; }
const Picker = ({value, choices, labeler=identity, onChange}) => {
  const items = [];
  let k = 0;
  for (const v of choices) {
    k++;
    items.push(<MenuItem key={k} value={v} primaryText={labeler(v)}/>);
  }
  return <SelectField value={value} onChange={onChange}>
    {items}
  </SelectField>
}

const MenuItems = ({values, labels, open, anchor, onChange, onRequestClose}) => {
  var items = [];
  for (const value of values) {
    items.push(<MenuItem key={value} value={value} primaryText={value}/>);
  }
  return <Popover open={open} anchorEl={anchor} onRequestClose={onRequestClose}>
           <Menu value="" onChange={onChange} onEscKeyDown={onRequestClose}>
            {items}
           </Menu>
         </Popover>
}

class TeamLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
    }
  }
  
  remove(team, hatred) {
    team.exclude = team.exclude.filter(val => val !== hatred);
    this.setState({team});
    this.props.onUpdate();
  }

  add(team, hatred) {
    if (!team.exclude.includes(hatred)) {
      team.exclude.push(hatred);
      team.exclude.sort();
    }
    this.setState({adding: false});
    this.props.onUpdate();
  }
  
  handleClick(event) {
    this.setState({
      adding: true,
      anchor: event.currentTarget,
    });
  }

  handleKeyDown(event, named) {
    if (event.keyCode === 13) {
      [named.name, named.nick] = extractParenthetical(event.target.value);
      if (named.name === '') {
        console.log(named.division);
        named.division.removeTeam(named);
        console.log(named.division);
      }
      this.props.onUpdate();
      event.target.blur();
    }
    if (event.keyCode === 27) {
      event.target.blur();
    }
  }

  render() {
    const {team, mode, factors, editing, onEdit} = this.props;
    if (mode === 'Schedule') {
      const styles = {
        chip: {
          margin: 2,
        },
        hates: {
          display: 'inline-flex',
          flexWrap: 'nowrap',
        },
      };
      var chips = team.exclude.map(hatred =>
      <Chip key={hatred} labelColor={red500}
            onRequestDelete={() => this.remove(team, hatred)}
            style={styles.chip}>{hatred}</Chip>);
      let label = <div className="col-6" onClick={() => onEdit(team.id)}>{team.name}</div>;

      if (editing) {
        label = <div className="col-6">
                  <input type="text" autoFocus size="42"
                         onKeyDown={(e) => this.handleKeyDown(e, team)}
                         onBlur={() => onEdit(0)}
                         defaultValue={team.editName()}/>
                </div>
      }
      return <div className="row team" key={team.id}>
               {label}
               <div className="col">
                 <ThumbDown color={red500} onClick={ev => this.handleClick(ev)}/>
                 <MenuItems values={factors}
                            open={this.state.adding}
                            anchor={this.state.anchor}
                            onChange={(e,v) => this.add(team, v)}
                            onRequestClose={() => this.setState({adding: false})}/>
                 <div style={styles.hates}>{chips}</div>
               </div>
             </div>;
    }
    return <div className="row team">
      <div className="col-6">{team.name}</div>
      <div className="col wins">{team.wins()}</div>
      <div className="col losses">{team.losses()}</div>
      </div>
  }
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      target: null,
    }
  }

  toggleAvailability(date, time) {
    const {schedule, onUpdate} = this.props;
    if (time in schedule.calendar[date]) {
      const game = schedule.calendar[date][time];
      delete schedule.calendar[date][time];
      if (game !== null)
        game.tellTeams(false);
    } else {
      schedule.calendar[date][time] = null
    }
    onUpdate();
  }
  setTarget([date, time]) {
    if (!this.state.target) {
      this.setState({target: [date, time]});
      return;
    }

    if (!_.isEqual(this.state.target, [date, time])) {
      // Swap the game at target with the game at [date, time]
      this.props.schedule.move(this.state.target, [date, time]);
    }

    this.setState({target: null});
  }

  addDate() {
    const {schedule, onUpdate} = this.props;
    const date = schedule.nextDate();
    schedule.calendar[date] = {};
    for (const time of schedule.times()) {
      schedule.calendar[date][time] = null
    }
    onUpdate();
  }

  addTime() {
    const {schedule, onUpdate} = this.props;
    const time = schedule.nextTime();
    for (const date of schedule.dates()) {
      schedule.calendar[date][time] = null;
    }
    onUpdate();
  }

  render() {
    const {schedule, onUpdate} = this.props;
    var headings = schedule.times();
    var [slots, filled] = schedule.usage();
    var days = schedule.dates()
      .map(date =>
           <Day key={date} date={date} schedule={schedule} headings={headings}
                onEmptyClick={(date, time) => this.toggleAvailability(date, time)}
                setTarget={t => this.setTarget(t)}
                target={this.state.target}
                onUpdate={onUpdate}/>);

    return <div className="schedule">
             <h2>Schedule</h2>
             <div className="row hidden-lg-down">
               <div className="col">
                 <span className='add' onClick={() => this.addDate()}>+day</span>
                 &nbsp;&nbsp;
                 <span className='add' onClick={() => this.addTime()}>+time</span>
               </div>
               {headings.map(h => <div key={h} className="col time">{h}</div>)}
             </div>
             {days}
             {slots} slots. {filled} filled.
           </div>;
  }
}

const Day = ({date, headings, schedule, onEmptyClick, target, setTarget, onUpdate}) => {
  const slots = schedule.calendar[date];
  var boxes = headings.map(heading => {
    if (! (heading in slots))
      return <div className="game hidden-lg-down col-xl" key={date + heading}
                  onClick={() => onEmptyClick(date,heading)}> &nbsp; </div>;
    const game = slots[heading];
    return <Slot key={date + heading} game={game} schedule={schedule} 
                 date={date} time={heading}
                 target={target} setTarget={setTarget} onEmptyClick={onEmptyClick}
                 onUpdate={onUpdate}/>;
  });
  return <div className="row day">
           <div className="col-xl">
            {date}
           </div>
           {boxes}
         </div>;
}

class Slot extends React.Component {
  moveClick() {
    const {date, time, setTarget} = this.props;
    setTarget([date, time]);
  }

  teamClick(i) {
    var {game, onUpdate} = this.props;
    if (game.winner === game.matchup[i])
      game.winner = null
    else
      game.winner = game.matchup[i];
    onUpdate();
  }

  render() {
    const {game, date, time, target, schedule, onEmptyClick} = this.props;
    let slotClass = "available";
    let bill = <div className="full" onClick={() => onEmptyClick(date,time)}>
        Available
    </div>;
    if (game) {
      slotClass = slug(game.matchup[0].division.nickname());
      if (game.matchup[0].division !== game.matchup[1].division) {
        slotClass = "inter";
      }

      let awayClass = "normal";
      let homeClass = "normal";
      if (!schedule.canPlace([game.matchup[0]], date, time)) {
        awayClass = "hates";
      }
      if (!schedule.canPlace([game.matchup[1]], date, time)) {
        homeClass = "hates";
      }
      if (game.winner) {
        awayClass = game.matchup[0] === game.winner ? "winner" : "loser";
        homeClass = game.matchup[1] === game.winner ? "winner" : "loser";
      }
      bill = <div>
        <span className={awayClass} onClick={() => this.teamClick(0)}>{game.matchup[0].nickname()}</span>
        <i> vs </i>
        <span className={homeClass} onClick={() => this.teamClick(1)}>{game.matchup[1].nickname()}</span>
        </div>
    }

    let moving = _.isEqual([date, time], target);
    if (!moving && target) {
      moving = schedule.canSwap(target, [date, time]);
      // Don't mark something as possible if it's a swap between empty slots
      moving = moving && (schedule.calendar[target[0]][target[1]] ||
                          schedule.calendar[date][time]);
    }
    return <div className={slotClass + " game col-md-2 col-xl"}>
           <GameControl game={game} time={time} moving={moving}
                        moveClick={() => this.moveClick()}/>
           {bill}
           </div>;
  }
}

class GameControl extends React.Component {
  togglePin(game) {
    game.pinned = !game.pinned;
    this.forceUpdate();
  }

  render() {
    var {game, time, moving, moveClick} = this.props;
    var timeOrScore = (game && game.score) ? game.score[0]+"-"+game.score[1] : time;
    return <div>
      <span className={moving ? "moving" : "prepmove"}
            onClick={moveClick}>
        <img width="20" alt="move" src="image/move.png"/>
      </span>
      {game &&
      <span className={game.pinned ? "pinned" : "unpinned"}
            onClick={() => this.togglePin(game)}>
        <img width="20" alt="pin" src="image/pin.png"/>
      </span>}
      <span className="float-right text-muted hidden-xl-up">{timeOrScore}</span>
      </div>
  }
}

class Authenticate extends React.Component {
  logout() {
    firebase.auth().signOut().then(() => console.log("Sign-out successful."),
                                   (error) => console.log("Sign-out error.",
                                                          error));
  }
  render() {
    var {user} = this.props;
    var account = "";
    if (user !== null) {
      account = <span>
        You are {user.uid}. <a href="#" onClick={() => this.logout()}>Logout</a>
        </span>
    }
    return <div>
             <div id="firebaseui-auth-container"></div>
             {account}
           </div>
  }
}

class Pikkels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // Immediately set the user
        this.setState({user});
      } else {
        // Initialize the FirebaseUI Widget using Firebase.
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig);
        this.setState({
          user: null,
        });
      }
    });
  }

  render() {
    return <div>
           <Authenticate user={this.state.user}/>
           <LeaguePager user={this.state.user}/>
           </div>;
  }
}

export default Pikkels;
