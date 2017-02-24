const DB = {
  1: {name: "Providence Kickball", nick: 'PKL', year: 2016,
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

  22: {calendar:
       {"May 14, 2016":
        { "10AM": 0, "11AM": 0, "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0, "6PM": 0},
        "May 21, 2016": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Jun  4, 2016": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Jun 11, 2016": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Jun 18, 2016": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Jun 25, 2016": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Jul 16, 2016": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Jul 23, 2016": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Jul 30, 2016": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Aug  6, 2016": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Aug 13, 2016": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Aug 20, 2016": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
        "Aug 27, 2016": {"12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0},
       }},
};


class League {
  constructor(id) {
    this.id = id;
    this.unsatisfied = [];
  }

  hydrate(id, db) {
    const json = db[id];
    this.name = json.name;
    this.nick = this.name;
    if ('nick' in json) this.nick = json.nick;
    this.year = json.year;

    this.divisions = json.divisions.map(id => hydrate(Division, id, db));
    this.schedule = new Schedule(json.schedule, db);
    this.matchups = this.allMatchups();
  }

  dehydrate(db) {
    const id = this.id;
    if (db[id])
      return id;
    db[id] = {
      name: this.name
    }
    if (this.nick != this.name)
      db[id].nick = this.nick;
    db[id].year = this.year;
    db[id].divisions = this.divisions.map(div => div.dehydrate(db));
    db[id].schedule = this.schedule.dehydrate(db);
    return id;
  }

  allMatchups() {
    // Alternate among the divisions' matchups.
    // TODO: What happens if divisions not same size?
    var matchups = _.flatten(_.zip.apply(undefined,
                                         (_.map(this.divisions, 'matchups'))));
    this.addInterdivisional(matchups);
    return matchups;
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

  addInterdivisional(matchups) {
    // PKL specific: If divisions have an odd number of teams, we need
    // to add interleague games so that we can schedule everyone on
    // opening day.
    const divsize = this.divisions[0].teams.length;
    if (this.divisions.length == 2 && divsize % 2 == 1) {
      let interleague = _.zip.apply(undefined, (_.map(this.divisions, 'teams')));
      if (this.year == 2016 && this.nick == 'PKL') {
        interleague = [
          this.vs('Equipped','Stilettos'),
          this.vs('Unstoppaballs', 'Olympic'),
          this.vs('Ball is Life', 'Chilangos'),
          this.vs('Meat Sweats', 'McBallface'),
          this.vs('Muscle Cobra', 'Marios'),
          this.vs('Next Tues', 'Baywatch'),
          this.vs('Jedi Mind Kicks', 'Glamazons'),
          this.vs('Wolfpack','GFY'),
          this.vs('99 Probz','Ball 12')
        ];
      }
      for (let i = 0; i < interleague.length; i++) {
        matchups.splice(6+i*divsize, 0, interleague[i]);
      }
    }
  }


  reschedule() {
    this.clearGames();
    const unsatisfied = this.unscheduled(this.matchups);
    this.matchups = _.shuffle(this.matchups); // For next reschedule
    this.schedule.fillFrom(unsatisfied);
    this.unsatisfied = unsatisfied;
    return unsatisfied.length == 0;
  }

  unscheduled(matchups) {
    // As written, clones the matchups, then iterates through calendar
    // and removes games from the clone if they are on the schedule.
    // Perhaps clearer to filter the matchups with a test to see if
    // the game is on the schedule already?
    const unsatisfied = _.clone(matchups);
    // CHANGE
    _.each(this.schedule.calendar, (slots, date) => {
      _.each(slots, (game, time) => {
        if (!game)
          return;
        for (const i in unsatisfied) {
          if (game.satisfies(unsatisfied[i])) {
            unsatisfied.splice(i,1);   // remove it
            return;
          }
        }
      });
    });
    return unsatisfied;
  }

  clearGames() {
    for (const div of this.divisions) {
      for (const team of div.teams) {
        team.games =  _.filter(team.games, game => game.pinned);
      }
    }
    this.schedule.clear();
  }
}

class Division {
  constructor(id) {
    this.id = id;
  }

  hydrate(id, db) {
    const json = db[id];
    this.name = json.name;
    this.nick = this.name;
    if ('nick' in json) this.nick = json.nick;

    this.teams = json.teams.map(id => {
      const team = hydrate(Team, id, db);
      team.division = this;
      return team;
    });

    this.matchups = roundRobin(this.teams);
  }

  dehydrate(db) {
    const id = this.id;
    if (db[id])
      return id;
    db[id] = {
      name: this.name
    }
    if (this.nick != this.name)
      db[id].nick = this.nick;
    db[id].teams = this.teams.map(team => team.dehydrate(db));
    return id;
  }
}


function roundRobin(teams) {
  var copy = teams.slice();

  function rotate() {
    var end = copy[copy.length-1];
    copy.splice(1, 0, end);       // Put last element first
    copy.splice(copy.length-1, 1); // Then remove it from the end
  }

  if (copy.length % 2 == 1) {
    copy.push(undefined);       // Whoever plays 'undefined' has a bye.
  }

  const matchups = [];
  for (let round = 0; round < copy.length-1; round++) {
    for (let i = 0; i < copy.length/2; i++) {
      const a = copy[i];
      if (a === undefined)
        continue;
      const b = copy[copy.length-1-i];
      if (b === undefined)
        continue;
      matchups.push(round % 2 ? [a, b] : [b, a]);
    }
    rotate();
  }
  return matchups;
}

function hydrate(cls, id, db) {
  if (id == null || id == 0)
    return null;
  if (id in hydrate.CATALOG)
    return hydrate.CATALOG[id];

  if (! id in db) {
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
    this.nick = this.name;
    if ('nick' in json) this.nick = json.nick;

    this.games = [];
    if ('games' in json)
      this.games = json.games.map(id => hydrate(Game, id, db));

    this.exclude = [];
    if ('exclude' in json) this.exclude = json.exclude;
  }

  dehydrate(db) {
    const id = this.id;
    if (db[id])
      return id;
    db[id] = {
      name: this.name
    }
    if (this.nick != this.name)
      db[id].nick = this.nick;
    db[id].games = this.games.map(game => game.dehydrate(db));
    return id;
  }


  wins() {
    return _.filter(this.games, game => game.winner && game.winner === this).length;
  }

  losses() {
    return _.filter(this.games, game => game.winner && game.winner !== this).length;
  }

  rank() {
    const w = this.wins();
    const l = this.losses();
    const pct =  (w + l == 0) ? 0.5 : w / (w + l);
    return  (w-l) + pct;
  }

  hates(date, slot) {
    return this.exclude.includes(date) ||  this.exclude.includes(slot);
  }

  noteGame(game) {
    if (this.games.includes(game))
      return;
    this.games.push(game);
  }
}

class Schedule {
  constructor(id, db) {
    this.id = id;
    const json = db[id];

    this.calendar = _.mapValues(json.calendar, (slots, date) => {
      return _.mapValues(slots, game => {
        return game ? hydrate(Game, game, db) : null;
      });
    });
  }

  dehydrate(db) {
    const id = this.id;
    if (db[id])
      return id;

    const calendar = _.mapValues(this.calendar, (slots, date) => {
      return _.mapValues(slots, (game, slot) => {
        return game ? game.dehydrate(db) : 0;
      })
    });

    db[id] = {
      calendar: calendar
    };
    return id;
  }

  swap(g1, g2) {
    const [d1, t1] = this.find(g1);
    const [d2, t2] = this.find(g2);
    // CHANGE
    this.calendar[d1][t1] = g2
    this.calendar[d2][t2] = g1;
  }

  find(game) {
    for (const date of Object.keys(this.calendar)) {
      const times = this.calendar[date];
      for (const time of Object.keys(times)) {
        if (game === times[time])
          return [date, time];
      };
    }
    console.log("Can't find", game);
    return undefined;
  }


  clear() {
    this.calendar = _.mapValues(this.calendar, (slots, date) => {
      return _.mapValues(slots, (game, slot) => {
        return game && game.pinned ? game : 0;
      })
    });
  }

  fillFrom(matchups) {
    var unused = [];
    // CHANGE
    _.each(this.calendar, (slots, date) => {
      _.each(slots, (game, time) => {
        if (!game && matchups.length > 0) {
          var matchup = this.extractViable(matchups, date, time, slots);
          if (!matchup) {
            console.log("Unable to schedule "+date+" "+time);
            unused.push([date, time]);
            return;
          }
          slots[time] = new Game(matchup);
        }
      });
    });
    if (matchups.length > 0) {
      console.log("Unable to schedule", _.clone(matchups));
    }
  
    // CHANGE
    _.each(this.calendar, (slots, date) => {
      if (matchups.length == 0) return false;
      _.each(slots, (game, slot) => {
        if (matchups.length == 0) return false;
        var candidate = this.calendar[date][slot];
        if (!candidate || candidate.pinned) return false;
        _.each(matchups, (leftover, li) => {
          if (this.isViable(leftover, date, slot, slots)) {
            for (let i = 0; i < unused.length; i++) {
              const [uud, uut] = unused[i];
              const others = this.calendar[uud]
              if (this.isViable(candidate.matchup, uud, uut, others)) {
                this.calendar[uud][uut] = candidate;
                this.calendar[date][slot] = new Game(leftover);
                matchups.splice(li, 1); // remove
                unused.splice(i, 1);    // remove
                return false;           // Move on through calendar
              }
            }
          }
        });
      });
    });
    return matchups;
  }

  isViable(matchup, date, slot, scheduled) {
    // Skip if either team hates the date or time.
    if (matchup[0].hates(date, slot) || matchup[1].hates(date, slot)) {
      return false;
    }
    // Skip if either team already plays in a game that day.
    return _.every(scheduled, (game, slot) => {
      if (game) {
        if (game.involves(matchup[0]) || game.involves(matchup[1])) {
          return false;
        }
      }
      return true;
    });
  }

  extractViable(matchups, date, slot, scheduled) {
    for (let m = 0; m < matchups.length; m++) {
      const matchup = matchups[m];
      if (this.isViable(matchup, date, slot, scheduled)) {
        matchups.splice(m,1);
        return matchup;
      }
    }
    return null;
  }
}

class Game {
  constructor(arg) {
    if (typeof arg == "number") {
      this.id = arg;
    } else {
      this.matchup = arg;
      this.id = hydrate.ID++;
      this.tellTeams();
    }
    this.pinned = false;
  }

  hydrate (id, db) {
    const json = db[id];
    this.matchup = _.map(json.matchup, t => hydrate(Team, t, db));
    this.tellTeams();
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

  dehydrate(db) {
    const id = this.id;
    if (db[id])
      return id;
    db[id] = {
      matchup: this.matchup.map(team => team.dehydrate(db)),
      winner: this.winner ? this.winner.dehydrate(db) : null,
      pinned: this.pinned,
    }
    if ('score' in this)
      db[id].score = this.score;

    return id;
  }


  tellTeams() {
    this.matchup.forEach(team => team.noteGame(this));
  }

  satisfies(matchup) {
    return this.matchup[0] === matchup[0] && this.matchup[1] === matchup[1] ||
      this.matchup[0] === matchup[1] && this.matchup[1] === matchup[0];
  }

  involves(team) {
    return this.matchup[0] === team || this.matchup[1] === team;
  }
}


class LeaguePage extends React.Component {
  constructor(props) {
    super(props);
    var user = this.props.user;
    this.state = {
      db: DB,
      league: hydrate(League, this.props.id, DB),
    };
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // Load user's league from FireBase
        var key = '/user/' + user.uid +'/db';
        firebase.database().ref('/user/' + user.uid +'/db')
          .on('value', db => {
            db = db.val();
            if (db) {           // Avoid overwriting local info on first login.
              // TODO, find safe way for existing objects to maintain references
              for (const id of Object.keys(db)) {
                flush(id);
              }
              this.setState({
                db: db,
                league: hydrate(League, this.props.id, db),
              });
            }
          });
      }
    });
  }

  handleReschedule(e) {
    e.preventDefault();
    var start = performance.now();
    var now = start;
    do {
      var done = this.state.league.reschedule();
      if (done)
        break;
      now = performance.now();
      console.log("Failed attempt. Used ",now-start,"ms so far.");
    } while (now - start < 100.0); // Work for up to 100ms
    var newDB = {}
    this.state.league.dehydrate(newDB);
    console.log(newDB);
    this.forceUpdate();
    var user = firebase.auth().currentUser;
    if (user) {
      var key = '/user/' + user.uid +'/db';
      firebase.database().ref(key).set(newDB);
    }
    // TODO: If we fail, it would be nice to use the "best" schedule we found.
  }

  render() {
    const league = this.state.league;
    
    return (<div className="league">
              <h1>{league.name} {league.year}</h1>
              <Divisions league={league}/>
              <Unsatisfied league={league}/>
              <form onSubmit={(e) => this.handleReschedule(e)}>
                <input type="submit" value="Reschedule" />
              </form>
              <Calendar schedule={league.schedule} onUpdate={this.forceUpdate.bind(this)}/>
            </div>
           );
  }
}

const Divisions = ({league}) => {
  const divisions = league.divisions
    .map(division => <TeamList key={division.id} division={division}/>);

  return <div className="standings row"> {divisions} </div>;
}

const TeamList = React.createClass({
  getInitialState: function() {
    return {
      editing: 0
    };
  },
  edit: function(id) {
    this.setState({editing: id});
  },
  handleKeyDown: function(event, named) {
    if (event.keyCode === 13) {
      named.name = event.target.value;
      event.target.blur();
    }
    if (event.keyCode === 27) {
      event.target.blur();
    }
  },
  renderHead: function() {
    const division = this.props.division;
    if (this.state.editing === this.props.division.id) {
      return <input type="text" autoFocus
                    size="30"
                    onKeyDown={(e) => this.handleKeyDown(e, division)}
                    onBlur={() => this.edit(0)}
                    defaultValue={division.name}/>;
    } else {
      return <div onClick={() => this.edit(division.id)}>{division.name} Division</div>
    }
  },
  renderTeam: function(team) {
    if (this.state.editing === team.id) {
      return <div className="row" key={team.id}>
              <div className="col-8">
                <input type="text" autoFocus
                       size="42"
                       onKeyDown={(e) => this.handleKeyDown(e, team)}
                       onBlur={() => this.edit(0)}
                       defaultValue={team.name}/>
              </div>
             </div>;
    } else {
      return <TeamLine onClick={() => this.edit(team.id)} key={team.id} team={team}/>;
    }
  },
  render: function() {
    const division = this.props.division;
    const lines = division.teams
      .sort((a, b) => b.rank() - a.rank())
      .map(team => this.renderTeam(team));

    return (<div className={division.nick + " division col-md"}>
              <h2>{this.renderHead()}</h2>
              <div className="row">
                <div className="col-8"></div>
                <div className="col">Wins</div>
                <div className="col">Losses</div>
              </div>
              {lines}
            </div>
    );
  }
});

const TeamLine = ({team, onClick}) =>
  <div className="row team">
    <div className="col-8" onClick={onClick}>{team.name}</div>
    <div className="col wins">{team.wins()}</div>
    <div className="col losses">{team.losses()}</div>
  </div>

const Unsatisfied = ({league}) => {
    var unscheduled = league.unsatisfied
      .map(matchup =>
           <li key={matchup[0].id+"-"+matchup[1].id}>{matchup[0].nick} <i>vs</i> {matchup[1].nick}</li>);
    if (unscheduled.length == 0)
      return <div></div>;
    return (<div className="unsatisfied">
            There are {unscheduled.length} unscheduled matchups.
            <ol className="unscheduled">
              {unscheduled}
            </ol>
            </div>);
}

var Calendar = React.createClass({
  getInitialState: function() {
    return {
      target: null
    };
  },

  setTarget: function(game) {
    if (!this.state.target) {
      this.setState({target: game});
      return;
    }

    if (this.state.target != game) {
      this.props.schedule.swap(this.state.target, game);
      this.state.target.pinned = true;
    }

    this.setState({target: null});
  },

  render: function() {
    var calendar = this.props.schedule.calendar;
    var dates = _.sortBy(Object.keys(calendar), Date.parse);
    var firstDate = dates[0];
    var allTimes = _.uniq(_.flatMap(calendar, slots => Object.keys(slots)));
    var headings = _.sortBy(allTimes, time => moment(dates[0] + " " + time,
                                                     "MMM DD, YYYY hha"));
    var days = dates
      .map(date =>
           <Day key={date} date={date} slots={calendar[date]} headings={headings}
                setTarget={this.setTarget}
                target={this.state.target}
                onUpdate={this.props.onUpdate}/>);

    return (<div className="schedule">
              <h2>Schedule</h2>
                <div className="row hidden-lg-down">
                    <div className="col"></div>
                    {headings.map(h => <div key={h} className="col time">{h}</div>)}
                </div>
                {days}
            </div>
           );
  }
});

const Day = ({date, slots, headings, target, setTarget, onUpdate}) => {
  var boxes = [];
  for (var heading of headings) {
    if (heading in slots && slots[heading]) {
      boxes.push(<GameBox key={slots[heading].id}
                          game={slots[heading]}
                          time={heading}
                          target={target}
                          setTarget={setTarget}
                          onUpdate={onUpdate}/>);
    } else {
      boxes.push(<div className="game hidden-lg-down col-xl" key={date + heading}>&nbsp;</div>);
    }
  }
  return (<div className="row day">
            <div className="col-xl">
              {moment(date, "MMM DD, YYYY").format("MMM D")}
            </div>
            {boxes}
          </div>);
}

var GameBox = React.createClass({
  moveClick: function () {
    this.props.setTarget(this.props.game);
  },

  teamClick: function(i) {
    var game = this.props.game;
    if (game.winner == game.matchup[i])
      game.winner = null
    else
      game.winner = game.matchup[i];
    this.props.onUpdate();
  },
  render: function() {
    var {game, time} = this.props;
    var gameClass = game.matchup[0].division.nick;
    if (game.matchup[0].division !== game.matchup[1].division) {
      gameClass = "inter";
    }
    var awayClass = "normal";
    var homeClass = "normal";
    if (game.winner) {
      awayClass = game.matchup[0] == game.winner ? "winner" : "loser";
      homeClass = game.matchup[1] == game.winner ? "winner" : "loser";
    }

    return (<div className={gameClass + " game col-md-2 col-xl"}>
            <GameControl game={game} time={time}
                         target={this.props.target} moveClick={this.moveClick}/>
            <span className={awayClass} onClick={_.partial(this.teamClick,0)}>{game.matchup[0].nick}</span>
            <i> vs </i>
            <span className={homeClass} onClick={_.partial(this.teamClick,1)}>{game.matchup[1].nick}</span>
            </div>
    );
  }
});

class GameControl extends React.Component {
  togglePin(game) {
    game.pinned = !game.pinned;
    this.forceUpdate();
  }

  render() {
    var {game, time, target, moveClick} = this.props;
    var timeOrScore = game.score ? game.score[0]+"-"+game.score[1] : time;
    return <div>
      <span className={game == target ? "moving" : "prepmove"}
            onClick={moveClick}>
        <img width="20" src="image/move.png"/>
      </span>
      <span className={game.pinned ? "pinned" : "unpinned"}
            onClick={() => this.togglePin(game)}>
        <img width="20" src="image/pin.png"/>
      </span>
      <span className="float-right text-muted hidden-xl-up">{timeOrScore}</span>
      </div>
  }
}

var reactDiv = document.getElementById('react');
ReactDOM.render(<LeaguePage id={1}/>, reactDiv);
