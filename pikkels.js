var DB = {
  1: {name: "Providence Kickball", schedule: 22,
      divisions: [2,3]},

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
        { "10AM": null, "11AM": null, "12PM": null, "1PM": null, "2PM": null, "3PM": null, "4PM": null, "5PM": null, "6PM": null},
        "May 21, 2016": {"12PM": null, "1PM": null, "2PM": null, "3PM": null, "4PM": null, "5PM": null},
        "Jun  4, 2016": {"12PM": null, "1PM": null, "2PM": null, "3PM": null, "4PM": null, "5PM": null},
        "Jun 11, 2016": {"12PM": null, "1PM": null, "2PM": null, "3PM": null, "4PM": null, "5PM": null},
        "Jun 18, 2016": {"12PM": null, "1PM": null, "2PM": null, "3PM": null, "4PM": null, "5PM": null},
        "Jun 25, 2016": {"12PM": null, "1PM": null, "2PM": null, "3PM": null, "4PM": null, "5PM": null},
        "Jul 16, 2016": {"12PM": null, "1PM": null, "2PM": null, "3PM": null, "4PM": null, "5PM": null},
        "Jul 23, 2016": {"12PM": null, "1PM": null, "2PM": null, "3PM": null, "4PM": null, "5PM": null},
        "Jul 30, 2016": {"12PM": null, "1PM": null, "2PM": null, "3PM": null, "4PM": null, "5PM": null},
        "Aug  6, 2016": {"12PM": null, "1PM": null, "2PM": null, "3PM": null, "4PM": null, "5PM": null},
        "Aug 13, 2016": {"12PM": null, "1PM": null, "2PM": null, "3PM": null, "4PM": null, "5PM": null},
        "Aug 20, 2016": {"12PM": null, "1PM": null, "2PM": null, "3PM": null, "4PM": null, "5PM": null},
        "Aug 27, 2016": {"12PM": null, "1PM": null, "2PM": null, "3PM": null, "4PM": null, "5PM": null},
       }},
};


function League(id, db) {
  this.id = id;
}
League.prototype.hydrate = function(id, db) {
  var json = db[id];
  this.name = json.name;
  this.nick = this.name;
  if ('nick' in json) this.nick = json.nick;

  this.divisions = json.divisions.map(function(id) {
    return hydrate(Division, id, db);
  });

  var matchups = this.allMatchups();

  this.schedule = new Schedule(json.schedule, db);
  _.each(this.schedule.calendar, function (slots, date) {
    _.each(slots, function (game, slot) {
      if (!game)
        return;
      for (var i in matchups) {
        if (game.satisfies(matchups[i])) {
          matchups.splice(i,1);   // remove it
          return;
        }
      }
    });
  });

  this.matchups = matchups;
  this.unsatisfied = this.schedule.fill(_.clone(matchups));
}

League.prototype.allMatchups = function() {
  // Alternate among the divisions' matchups.
  // TODO: What happens if divisions not same size?
  var matchups = _.flatten(_.zip.apply(undefined,
                                       (_.map(this.divisions, 'matchups'))));

  // PKL specific: If divisions have an odd number, we need to add
  // interleague games so that we can schedule everyone on opening day.
  var divsize = this.divisions[0].teams.length;
  if (this.divisions.length == 2 && divsize % 2 == 1) {
    var interleague = _.zip.apply(undefined, (_.map(this.divisions, 'teams')));
    for (var i = 0; i < interleague.length; i++) {
      matchups.splice(6+i*divsize, 0, interleague[i]);
    }
  }
  return matchups;
}

function Division(id) {
  this.id = id;
}
Division.prototype.hydrate = function(id, db) {
  var json = db[id];
  this.name = json.name;
  this.nick = this.name;
  if ('nick' in json) this.nick = json.nick;

  var self = this;
  this.teams = json.teams.map(function(id) {
    var team = hydrate(Team, id, db);
    team.division = self;
    return team;
  });

  this.matchups = roundRobin(this.teams);
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

  var matchups = [];
  for (var round = 0; round < copy.length-1; round++) {
    for (var i = 0; i < copy.length/2; i++) {
      var a = copy[i];
      if (a === undefined)
        continue;
      var b = copy[copy.length-1-i];
      if (b === undefined)
        continue;
      matchups.push(round % 2 ? [a, b] : [b, a]);
    }
    rotate();
  }
  return matchups;
}

function hydrate(cls, id, db) {
  if (! cls.catalog) {
    cls.catalog = {};
  }
  if (id in cls.catalog) {
    return cls.catalog[id];
  }
  if (! id in db) {
    console.log(cls, id, " not in DB");
  }
  var obj = new cls(id);
  cls.catalog[id] = obj;
  obj.hydrate(id, db);
  return obj;
}
hydrate.ID = _.max(_.keys(DB).map(_.parseInt))+1;

function Team(id) {
  this.id = id;
}
Team.prototype.hydrate = function(id, db) {
  var json = db[id];
  this.name = json.name;
  this.nick = this.name;
  if ('nick' in json) this.nick = json.nick;

  this.games = [];
  if ('games' in json)
    this.games = json.games.map(function(id) {
      return hydrate(Game, id, db);
    });

  this.exclude = [];
  if ('exclude' in json) this.exclude = json.exclude;
}
Team.prototype.wins = function() {
  var self = this;
  return _.filter(this.games, function(game) { return game.winner === self; }).length;
}
Team.prototype.losses = function() {
  var self = this;
  return _.filter(this.games, function(game) { return game.winner && game.winner !== self; }).length;
}
Team.prototype.rank = function() {
  var w = this.wins();
  var l = this.losses();
  var pct =  (w + l == 0) ? 0.5 : w / (w + l);
  return  (w-l) + pct;
}
Team.prototype.hates = function(date, slot) {
  return this.exclude.includes(date) ||  this.exclude.includes(slot);
}
Team.prototype.noteGame = function(game) {
  if (this.games.includes(game))
    return;
  this.games.push(game);
}

function Schedule(id, db) {
  this.id = id;
  var json = db[id];

  var calendar = {};
  _.each(json.calendar, function (slots, date) {
    calendar[date] = _.mapValues(slots, function(game) {
      return game ? hydrate(Game, game, db) : null;
    });
  });
  this.calendar = calendar;
}
Schedule.prototype.clear = function(matchups) {
  var calendar = {};
  _.each(this.calendar, function (slots, date) {
    calendar[date] = _.mapValues(slots, function(game) {
      return null;
    });
  });
  this.calendar = calendar;
}
Schedule.prototype.refill = function(matchups) {
  this.clear();
  return this.fill(matchups);
}
Schedule.prototype.fill = function(matchups) {
  var self = this;
  var unused = [];
  _.each(this.calendar, function (slots, date) {
    _.each(slots, function (game, slot) {
      if (!game && matchups.length > 0) {
        var matchup = self.extractViable(matchups, date, slot, slots);
        if (!matchup) {
          console.log("Unable to schedule "+date+" "+slot);
          unused.push([date, slot]);
          return;
        }
        slots[slot] = new Game(matchup);
      }
    });
  });
  if (matchups.length > 0) {
    console.log("Unable to schedule", _.clone(matchups));
  }
  
  var fixed = [];
  _.each(this.calendar, function (slots, date) {
    if (matchups.length == 0) return false;
    _.each(slots, function (game, slot) {
      if (matchups.length == 0) return false;
      _.each(matchups, function(leftover, li) {
        if (self.isViable(leftover, date, slot, slots)) {
          console.log("Exchange?", leftover, date, slot);
          var candidate = self.calendar[date][slot];
          for (var i = 0; i < unused.length; i++) {
            var u = unused[i];
            var others = self.calendar[u[0]]
            console.log(others);
            if (self.isViable(candidate.matchup, u[0], u[1], others)) {
              self.calendar[u[0]][u[1]] = self.calendar[date][slot];
              self.calendar[date][slot] = new Game(leftover);
              fixed.push(leftover);
              console.log("SWAP");
              matchups.splice(li, 1); // remove
              unused.splice(i, 1); // remove
              return false;         // Move on through calendar
            }
          }
        }
      });
    });
  });
  return matchups;
}
Schedule.prototype.isViable = function(matchup, date, slot, scheduled) {
  // Skip if either team hates the date or time.
  if (matchup[0].hates(date, slot) || matchup[1].hates(date, slot)) {
    return false;
  }
  // Skip if either team already plays in a game that day.
  return _.every(scheduled, function(game, slot) {
    if (game) {
      if (game.involves(matchup[0]) || game.involves(matchup[1])) {
        return false;
      }
    }
    return true;
  });

}
Schedule.prototype.extractViable = function(matchups, date, slot, scheduled) {
  for (var m = 0; m < matchups.length; m++) {
    var matchup = matchups[m];
    if (this.isViable(matchup, date, slot, scheduled)) {
      matchups.splice(m,1);
      return matchup;
    }
  }
  return null;
}

function Game(id) {
  if (typeof id == "number") {
    this.id = id;
  } else {
    var matchup = id;
    this.id = hydrate.ID++;
    this.matchup = matchup;
    this.tellTeams();
  }
}

Game.prototype.hydrate = function (id, db) {
  var json = db[id];
  var self = this;
  this.matchup = _.map(json.matchup, function(t) {
    return hydrate(Team, t, db);
  });
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
  this.score = json.score;
}
Game.prototype.tellTeams = function () {
  var self = this;
  _.each(this.matchup, function(team) { team.noteGame(self); });
}
Game.prototype.satisfies = function(matchup) {
  return this.matchup[0] === matchup[0] && this.matchup[1] === matchup[1] ||
    this.matchup[0] === matchup[1] && this.matchup[1] === matchup[0];
}
Game.prototype.involves = function(team) {
  return this.matchup[0] === team || this.matchup[1] === team;
}


var LeaguePage = React.createClass({
  getInitialState() {
    return {
      league: hydrate(League, this.props.id, DB),
    };
  },
  handleReschedule(e) {
    e.preventDefault();
    var unsatisfied;
    for (var attempt = 0; attempt < 15; attempt++) {
      unsatisfied = _.shuffle(this.state.league.matchups);
      this.state.league.schedule.refill(unsatisfied);
      if (unsatisfied.length == 0)
        break;
    }
    this.state.league.unsatisfied = unsatisfied;
    this.forceUpdate();
  },
  render() {
    var league = this.state.league;

    return (<div className="league">
              <h1>{league.name}</h1>
              <Divisions league={league}/>

              <Unsatisfied league={league}/>
              <form onSubmit={this.handleReschedule}>
                <input type="submit" value="Reschedule" />
              </form>
              <Calendar calendar={league.schedule.calendar} onUpdate={this.forceUpdate.bind(this)}/>
            </div>
           );
  }
});

var Divisions = React.createClass({
  render: function() {
    var league = this.props.league;
    var divisions = league.divisions.map(function(division) {
      return <TeamList key={division.id} division={division}/>;
    });

    return (<div className="standings">
              {divisions}
            </div>
           );
  }
});

var TeamList = React.createClass({
  getInitialState: function() {
    return {
      editing: 0
    };
  },
  edit: function(id) {
    this.setState({editing: id});
  },
  handleKeyDown: function(event) {
    if (event.keyCode === 13) {
      DB[this.state.editing].name = event.target.value;
      Team.catalog[this.state.editing].name = event.target.value;
      event.target.blur();
    }
    if (event.keyCode === 27) {
      event.target.blur();
    }
  },
  renderTeam: function(team) {
    if ( this.state.editing === team.id ) {
      return <tr key={team.id}>
              <td colSpan="3">
                <input type="text" autoFocus
                       size="42"
                       onKeyDown={this.handleKeyDown}
                       onBlur={_.partial(this.edit,0)}
                       defaultValue={team.name}/>
              </td>
             </tr>;
    } else {
      return <TeamLine onClick={_.partial(this.edit,team.id)} key={team.id} team={team}/>;
    }
  },
  render: function() {
    var division = this.props.division;
    var lines = division.teams.sort(function(a, b) {
      return b.rank() - a.rank();
    }).map(function(team) {
      return this.renderTeam(team);
    }, this);
    var divClass = division.nick;

    return (<div className={divClass + " division"}>
              <h2>{division.name} Division</h2>
              <table>
                <tbody>
                  <tr><th>&nbsp;</th><th>Wins</th><th>Losses</th></tr>
                  {lines}
                </tbody>
              </table>
            </div>
    );
  }
});

var TeamLine = React.createClass({
  render: function() {
    var team = this.props.team
    return (<tr className="team">
              <td onClick={this.props.onClick}>{team.name}</td>
              <td className="wins">{team.wins()}</td>
              <td className="losses">{team.losses()}</td>
            </tr>
    );
  }
});

var Unsatisfied = React.createClass({
  render: function() {
    var league = this.props.league;
    var unscheduled = league.unsatisfied.map(function(matchup) {
      return <li key={matchup[0].id+"-"+matchup[1].id}>{matchup[0].nick} <i>vs</i> {matchup[1].nick}</li>
    });
    if (unscheduled.length == 0)
      return <div></div>;
    return (<div className="unsatisfied">
            There are {unscheduled.length} unscheduled matchups.
            <ol className="unscheduled">
              {unscheduled}
            </ol>
            </div>);
  }
});

var Calendar = React.createClass({
  render: function() {
    var calendar = this.props.calendar;
    var dates = _.sortBy(Object.keys(calendar), Date.parse);
    var headings = _.sortBy(Object.keys(calendar[dates[0]]), function(slot) {
      return moment(dates[0] + " " + slot, "MMM DD, YYYY hha");
    });
    var self = this;
    var days = _.map(dates, function (date) {
      var slots = calendar[date];
      return (<Day key={date} date={date} slots={slots} headings={headings} onUpdate={self.props.onUpdate}/>);
    });
    var heading = _.map(headings, function (h) {
      return (<th key={h}>{h}</th>);
    });

    return (<div className="schedule">
              <h2>Schedule</h2>
              <table>
                <tbody>
                  <tr><th>Saturday</th>{heading}</tr>
                  {days}
                </tbody>
              </table>
            </div>
           );
  }
});

var Day = React.createClass({
  render: function() {
    var date = this.props.date;
    var slots = this.props.slots;
    var headings = this.props.headings;
    var boxes = [];
    var self = this;
    _.each(headings, function(heading) {
      if (heading in slots && slots[heading]) {
        boxes.push(<GameBox key={slots[heading].id} game={slots[heading]} onUpdate={self.props.onUpdate}/>);
      } else {
        boxes.push(<td key={date + heading}>&nbsp;</td>);
      }
    });
    return (<tr className="day">
              <th>{moment(this.props.date, "MMM DD, YYYY").format("MMM D")}</th>
              {boxes}
            </tr>
    );
  }
});

var GameBox = React.createClass({
  handleClick: function(i, e) {
    var game = this.props.game;
    if (game.winner == game.matchup[i])
      game.winner = null
    else
      game.winner = game.matchup[i];
    this.props.onUpdate();
  },
  render: function() {
    var game = this.props.game;
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
    return (<td className={gameClass + " game"}>
            <span className={awayClass} onClick={_.partial(this.handleClick,0)}>{game.matchup[0].nick}</span>
            <i> vs </i>
            <span className={homeClass} onClick={_.partial(this.handleClick,1)}>{game.matchup[1].nick}</span>
            </td>
    );
  }
});

ReactDOM.render(<LeaguePage id={1}/>,
                document.getElementById('react'));

