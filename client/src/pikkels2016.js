/* eslint-disable no-labels, no-use-before-define */

import React, { Component, PropTypes } from 'react';

import _ from 'lodash';
import moment from 'moment';
import cx from 'classnames';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

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
  1: {name: "Providence Kickball", nick: 'PKL', year: 2017,
      schedule: 22, divisions: [2,3]},

  2: {name: "R2-D2", teams: [ 4, 5, 6, 7, 8, 9,10,11,12]},
  3: {name: "BB-8", teams:  [13,14,15,16,17,18,19,20,21]},

  4: {name: "The Wolfpack", nick: "Wolfpack"},
  5: {name: "Muscle Cobra, Inc.", nick: "Muscle Cobra"},
  6: {name: "Ball is Life"},
  7: {name: "99 Problems", nick: "99 Probz"},
  8: {name: "Olympic Team of Kochmenistan", nick: "Olympic"},
  9: {name: "Glamazons"},
  10: {name: "Fully Equipped", nick: "Equipped"},
  11: {name: "Kicky McBallface", nick: "McBallface"},
  12: {name: "See You Next Tuesday", nick: "Next Tues"},

  13: {name: "Meat Sweats"},
  14: {name: "Narragansett Baywatch", nick: "Baywatch"},
  15: {name: "Unstoppaballs", exclude: ["4PM", "5PM"]},
  16: {name: "Ball 12 For Action", nick: "Ball 12"},
  17: {name: "GFY"},
  18: {name: "Trippin' Marios", nick: "Marios"},
  19: {name: "Los Chilangos", nick: "Chilangos"},
  20: {name: "The Stilettos", nick: "Stilettos"},
  21: {name: "Jedi Mind Kicks"},

  22: {
    leftover: [],
    calendar:
       {"May 27, 2017":
        { "10AM": 0, "11AM": 0, "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0, "6PM": 0},
        "Jun  3, 2017": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Jun 10, 2017": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Jun 17, 2017": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Jun 24, 2017": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Jul 1, 2017": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Jul 15, 2017": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Jul 22, 2017": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Jul 29, 2017": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Aug  5, 2017": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Aug 12, 2017": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Aug 19, 2017": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Aug 26, 2017": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
//        "Sep 2, 2017": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
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

  static of(matchup, pool) {
    const i = pool.findIndex(game => game.matches(matchup));
    console.log("of", i, pool);
    if (i >= 0) {
      const existing = pool[i];
      pool.splice(i,1);   // remove it
      return existing;
    }
    return new Game(matchup);
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

  // Move the game at d1,t1 to d2,t2, and pin it.
  move([d1, t1], [d2, t2]) {
    const tmp = this.calendar[d1][t1];
    this.calendar[d1][t1] = this.calendar[d2][t2]
    this.calendar[d2][t2] = tmp;
    tmp.pinned = true;
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
    for (const [date, time, game] of this.games()) {
      if (game)
        continue;
      if (this.canPlace(matchup, date, time)) {
        this.calendar[date][time] = Game.of(matchup, []);
        return true;
      }
    }
    return false;
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
  openingDay() {
    return _.minBy(Object.keys(this.calendar), Date.parse);
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
  
  fillFrom(matchups, games) {
    const opening = this.openingDay();
    const unused = [];
    // In this pass, just look for first viable matchup, and put it in.
    // If nothing viable, note the problematic slot in 'unused'.
    for (const [date, time, game, slots] of this.games()) {
      if (!game) {            // games may already be there. (pinned)
        var matchup = this.extractBest(matchups, date, time, 100);
        if (matchup) {
          slots[time] = Game.of(matchup, games);
        } else {
          if (opening === date) {
            // Bail early, we can't fix it if we don't fill opening day.
            return;
          }
          unused.push([date, time]);
        }
      }
    }

    this.fixFrom(matchups, unused, games);
    const onefix = matchups.length;
    this.fixFrom(matchups, unused); // Would fixing again ever help?
    const twofix = matchups.length;
    if (onefix > twofix) {
      alert(onefix + " > " + twofix);
    }
    return matchups;
  }

  fixFrom(matchups, unused, games) {
    // Now run through again, and swap unpinned candidate games out of
    // their existing slot if one of our leftovers can take their
    // spot, and the candidate itself can be used to fill an 'unused'
    // slot.
    for (const [date, slots] of Object.entries(this.calendar)) {
      CANDIDATE:
      for (const [time, candidate] of Object.entries(slots)) {
        if (!candidate || candidate.pinned)
          continue;             // Next candidate for moving
        for (let li = 0; li < matchups.length; li++) {
          const leftover = matchups[li];
          if (this.canPlace(leftover, date, time)) {
            for (let i = 0; i < unused.length; i++) {
              const [uud, uut] = unused[i];
              if (this.canPlace(candidate.matchup, uud, uut)) {
                this.calendar[uud][uut] = candidate;
                this.calendar[date][time] = Game.of(leftover, games);
                matchups.splice(li, 1); // remove the leftover
                unused.splice(i, 1);    // remove the unused
                if (unused.length === 0)
                  return;
                continue CANDIDATE;
              }
            }
          }
        }
      }
    }
    return matchups;
  }

  demerits(matchup, date, time) {
    let badness = 0;
    
    // Skip if either team hates the spot, otherwise contribute the
    // number of games the teams have played so far as "badness",
    // which will lead to balanced in the schedule when filling in
    // order.
    for (const team of matchup) {
      if (team.hates(date, time))
        badness += 100;
      badness += team.games.length;
    }

    // Skip if either team already plays in a game that day.
    const others = this.calendar[date];
    const twoaday = !!_.find(others, (game, othertime) => {
      if (game && time !== othertime) {
        for (const team of matchup)
          if (game.involves(team))
            return true;
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
  
  
  // Look through matchups for something that works for the date and
  // slot (time).  If found, remove it from matchups and return it.
  extractViable(matchups, date, slot) {
    for (let m = 0; m < matchups.length; m++) {
      const matchup = matchups[m];
      if (this.canPlace(matchup, date, slot)) {
        matchups.splice(m,1);
        return matchup;
      }
    }
    return null;
  }

  // Like extractViable, but checks all matchups and takes the best
  // one.  But will not accept anything that scores about cutoff (if
  // specified, and positive).
  
  extractBest(matchups, date, slot, cutoff=0) {
    const scores = matchups.map((matchup, i) =>
                                [this.demerits(matchup, date, slot), i]);
    console.log(scores);
    const best = _.minBy(scores, s => s[0]);
    if (cutoff > 0 && best[0] >= cutoff)
      return null;
    const matchup = matchups[best[1]];
    matchups.splice(best[1], 1);
    return matchup;
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
      teams: this.teams.map(team => team.dehydrate(db, mark)),
    }
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

  matchups() {
    return _.flatten(_.shuffle(roundRobin(this.teams)));
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
      if (this.year === 2016 && this.nick === 'PKL') {
        return _.shuffle([
          this.vs('Equipped','Stilettos'),
          this.vs('Unstoppaballs', 'Olympic'),
          this.vs('Ball is Life', 'Chilangos'),
          this.vs('Meat Sweats', 'McBallface'),
          this.vs('Muscle Cobra', 'Marios'),
          this.vs('Next Tues', 'Baywatch'),
          this.vs('Jedi Mind Kicks', 'Glamazons'),
          this.vs('Wolfpack','GFY'),
          this.vs('99 Probz','Ball 12')
        ]);
      }
      return _.shuffle(_.zip.apply(null, (this.divisions.map(d => d.teams))));
    }
    return [];
  }

  reschedule() {
    var games = this.clearGames();          // removes unpinned games
    const unscheduled = this.unscheduled();
    this.schedule.fillFrom(unscheduled, games);
    this.schedule.leftover = unscheduled.map(m => Game.of(m, games));
    return unscheduled.length === 0;
  }


  // Tries to schedule a matchup, but only if it fits somewhere available
  trySchedule(matchup) {
    return this.schedule.add(matchup);
  }

  deschedule(matchup) {
    this.schedule.remove(matchup);
  }

  unscheduled() {
    // As written iterates through calendar and removes matchups if
    // they are on the schedule.  Perhaps clearer to filter the
    // matchups with a test to see if the game is on the schedule
    // already?
    const unsatisfied = this.allMatchups();
    for (const [ , , game] of this.schedule.games()) {
      if (!game)
        continue;
      // Remove first matchup that game satisfies.
      const i = unsatisfied.findIndex(m => game.satisfies(m));
      if (i >= 0) {
        unsatisfied.splice(i,1);   // remove it
        continue;
      }
    }
    return unsatisfied;
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
  constructor(id) {
    this.id = id;
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

class LeaguePager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Start with builtin data
      db: DB,
      league: hydrate(League, DB.leagues[0], DB),
      mode: 'Schedule',
      dbref: firebase.database().ref(props.root)
    }
    this.watch(this.state.dbref);
  }

  componentWillReceiveProps(props) {
    this.state.dbref.off();
    const dbref = firebase.database().ref(props.root);
    this.setState({dbref});
    this.watch(dbref);
  }

  watch(ref) {
    ref.on('value', db => {
      db = db.val();
      //console.log('value', db);
      if (db) {           // Avoid overwriting local info on first login.
        // TODO, find a way for existing objects to maintain references
        for (const id of Object.keys(db)) {
          flush(id);
        }
        this.setState({
          db: db,
          league: hydrate(League, db.leagues[0], db, new Set()),
        });
      }
    });
  }


  handleModeChange = (event, index, value) => {
    console.log(event,index,value);
    this.setState({mode: value});
  }

  handleRandomize(hatreds) {
    const keep = this.state.league.schedule;
    for (const div of this.state.league.divisions) {
      for (const team of div.teams) {
        let hate = keep;
        while (hate === keep)
          hate = _.sample(hatreds);
        team.exclude = [hate];
        console.log(team.exclude);
      }
    }
    this.forceUpdate();
  }
  
  handleReschedule() {
    const start = performance.now();
    let now = start;
    let attempts = 0;
    do {
      var done = this.state.league.reschedule();
      attempts++;
      if (done)
        break;
      now = performance.now();
    } while (now - start < 100.0); // Work for up to 100ms
    // TODO: If we fail to fully reschedule, it would be nice to use
    // the "best" schedule we found.  Either with empty slots, or with
    // bad games marked up.
    if (attempts > 1)
      console.log(`${attempts} attempts, in ${Math.round(now-start)}ms.`)
    this.state.league.dehydrate(this.state.db, new Set());
    const leagues = [this.state.league.id];
    this.setState({leagues});
    console.log("Save", this.state.db);
    this.state.dbref.set(this.state.db);
  }

  onUpdate(reschedule = false) {
    if (reschedule)
      this.handleReschedule();  // which will also cause update
    else
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
            <Unsatisfied league={league}/>
            <RaisedButton primary={true} label="Reschedule"
                          onClick={() => this.handleReschedule()} />
            <RaisedButton primary={true} label="Randomize"
                          onClick={() => this.handleRandomize(factors)} />
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
    league.trySchedule(matchup);
    onUpdate();
  }
  const extras = league.extra.map((m, i) =>
                                  <li key={i}>
                                  <ExtraMatchup matchup={m}
                                                teams={league.teams()}
                                                onUpdate={onUpdate}/>
                                  <Delete onClick={() => remove(i)}/>
                                  </li>)
  return <div className="extra">
    <ol>
    {extras}
    <a onClick={add}> Add an interdivision game. </a>
    </ol>
    </div>;
}

class ExtraMatchup extends Component {
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


class TeamList extends Component {
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
  renderTeam(team, mode, factors) {
    if (this.state.editing === team.id) {
      return <div className="row" key={team.id}>
              <div className="col-6">
                <input type="text" autoFocus
                       size="42"
                       onKeyDown={(e) => this.handleKeyDown(e, team)}
                       onBlur={() => this.edit(0)}
                       defaultValue={team.editName()}/>
              </div>
             </div>;
    } else {
      return <TeamLine onClick={() => this.edit(team.id)}
               key={team.id} team={team} mode={mode} factors={factors}
               onUpdate={this.props.onUpdate}/>;
    }
  }
  
  render() {
    const { division, mode, factors } = this.props;
    const lines = division.teams
      .sort((a, b) => b.rank() - a.rank())
          .map(team => this.renderTeam(team, mode, factors));

    const record = mode === 'Schedule' ? "" :
      <div className="row">
        <div className="col-6"></div>
        <div className="col">Wins</div>
        <div className="col">Losses</div>
      </div>

    const teams = division.teams.length;
    const rrCount = (teams*(teams-1))/2;
    const summary =  mode !== 'Schedule' ? "" :
      <span className="summary">Requires {rrCount} games.</span>
    return (<div className={slug(division.nickname()) + " division col-md"}>
            <h2>{this.renderHead()}</h2>
            {record}
            {lines}
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

class TeamLine extends Component {
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
  
  handleTouchTap(event) {
    event.preventDefault();     // This prevents ghost click.
    this.setState({
      adding: true,
      anchor: event.currentTarget,
    });
  }

  render() {
    const {team, mode, factors, onClick} = this.props;
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
      return <div className="row team">
        <div className="col-6" onClick={onClick}>{team.name}</div>
        <div className="col">
            <ThumbDown color={red500}
                       onTouchTap={ev => this.handleTouchTap(ev)}/>
            <MenuItems values={factors}
                       open={this.state.adding}
                       anchor={this.state.anchor}
                       onChange={(e,v) => this.add(team, v)}
                       onRequestClose={() => this.setState({adding: false})}/>
            <div style={styles.hates}>{chips}</div>
        </div>
        </div>
    }
    return <div className="row team">
      <div className="col-6">{team.name}</div>
      <div className="col wins">{team.wins()}</div>
      <div className="col losses">{team.losses()}</div>
      </div>
  }
}

const Unsatisfied = ({league}) => {
  var i = 0;
  var unscheduled = league.unscheduled().map(matchup =>
    <li key={slug(i++, matchup[0].id, matchup[1].id)}>
      {matchup[0].nickname()} <i> vs </i> {matchup[1].nickname()}
    </li>);
  if (unscheduled.length === 0)
    return <div/>;
  return (<div className="unsatisfied">
          There are {unscheduled.length} unscheduled matchups.
          </div>);
}

class Calendar extends Component {
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
               <div className="col"></div>
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
             {moment(date, "MMM DD, YYYY").format("MMM D")}
           </div>
           {boxes}
         </div>;
}

class Slot extends Component {
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

    const moving = _.isEqual([date, time], target);
    return <div className={slotClass + " game col-md-2 col-xl"}>
           <GameControl game={game} time={time} moving={moving}
                        moveClick={() => this.moveClick()}/>
           {bill}
           </div>;
  }
}

class GameControl extends Component {
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

class Authenticate extends Component {
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

class Pikkels extends Component {
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
  key() {
    if (this.state.user) {
      return `/user/${this.state.user.uid}/db`;
    } else {
      return '/public/pkl';
    }
  }

  handleNextYear() {

  }
  
  render() {
    return <div>
           <Authenticate user={this.state.user}/>
           <LeaguePager user={this.state.user} root={this.key()}/>
           <RaisedButton primary={true} label="Next Year"
                         onClick={() => this.handleNextYear()} />
           </div>;
  }
}

export default Pikkels;
