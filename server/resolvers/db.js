const LATE = ["3PM", "4PM", "5PM", "6PM"];

const DB = {
  leagues: [1],
  1: {
    name: "Providence Kickball",
    nick: "PKL",
    year: 2018,
    schedule: 21,
    divisions: [2],
  },

  2: {
    name: "United",
    gpt: 10,
    ensure: [
      [3, 4],
      [5, 6],
      [7, 8], // good teams play each other
      [18, 19],
      [16, 17], // bad teams play each other
      [4, 16], // wanted matchups
    ],
    avoid: [
      [3, 17],
      [3, 18],
      [3, 19], // best don't play worst 3
      [4, 18],
      [4, 19], // 2nd best don't play worst 2
      [5, 17], // 3rd don't play worst
      [10, 12],
      [3, 8],
      [8, 17],
      [3, 17], // unwanted matchups (new, corey, several)
      [7, 18], // dexter / jedi (middle vs edge)
    ],
    teams: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  },
  3: { name: "Muscle Cobra, Inc.", nick: "Muscle Cobra", exclude: ["Jun 1", "Jul 13"] },
  4: { name: "Black Sheep", exclude: ["Jun 8", "Jul 20"] },
  5: { name: "Trippin' Marios", nick: "Marios", exclude: ["Jun 22", "Jul 27"] },
  6: { name: "The Wolfpack", nick: "Wolfpack", exclude: ["Jun 1"] },
  7: {
    name: "Dexter Park Dads",
    nick: "Dads",
    exclude: ["Jul 6", "Jul 13", "11AM", "12PM", "4PM", "5PM", "6PM"],
  },
  8: {
    name: "Narragansett Baywatch",
    nick: "Baywatch",
    exclude: ["Jun 22", "Jul 20", "Aug 31", "11AM", "12PM"],
  },
  9: { name: "Unstoppaballs", exclude: ["May 25", "Jun 8", "Jun 29", "Jul 13"] },
  10: { name: "OPR", exclude: ["May 25", "Jun 15", "Jul 13", "Aug 31"] },
  11: {
    name: "Fox Point Booters",
    nick: "Fox Point",
    exclude: ["May 25", "Jun 29", "Jul 6"],
  },
  12: { name: "Schwetty Balls", nick: "Schwetty" },
  13: { name: "Menace II Sobriety", nick: "Menaces", exclude: [...LATE] },
  14: { name: "Meat Sweats", exclude: ["Jun 15", "Jul 13"] },
  15: { name: "Suck My Kick", nick: "Suck", exclude: ["Jun 15", "Aug 31", ...LATE] },
  16: { name: "Bad Taste", exclude: ["Jun 1", "Jun 8", "Jun 15"] },
  17: {
    name: "Glamazons",
    exclude: ["Jun 22", "Jul 27", "Aug 24", "11AM", "12PM", "1PM"],
  },
  18: {
    name: "Jedi Mind Kicks",
    exclude: ["1PM", "2PM", "3PM", "4PM", "Jun 22", "Jun 29"],
  },
  19: { name: "C U Next Tuesday", nick: "Clams" },

  21: {
    leftover: [],
    calendar: {
      "May 25": {
        "11AM": 0,
        "12PM": 0,
        "1PM": 0,
        "2PM": 0,
        "3PM": 0,
        "4PM": 0,
        "5PM": 0,
      },
      "Jun 1": { "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0 },
      "Jun 8": { "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0 },
      "Jun 15": {
        "12PM": 0,
        "1PM": 0,
        "2PM": 0,
        "3PM": 0,
        "4PM": 0,
        "5PM": 0,
      },
      "Jun 22": { "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0 },
      "Jun 29": { "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0 },
      "Jul 13": {
        "12PM": 0,
        "1PM": 0,
        "2PM": 0,
        "3PM": 0,
        "4PM": 0,
        "5PM": 0,
      },
      "Jul 20": {
        "11AM": 0,
        "12PM": 0,
        "1PM": 0,
        "2PM": 0,
        "3PM": 0,
        "4PM": 0,
        "5PM": 0,
      },
      "Jul 27": {
        "11AM": 0,
        "12PM": 0,
        "1PM": 0,
        "2PM": 0,
        "3PM": 0,
        "4PM": 0,
        "5PM": 0,
      },
      "Aug 3": {
        "11AM": 0,
        "12PM": 0,
        "1PM": 0,
        "2PM": 0,
        "3PM": 0,
        "4PM": 0,
        "5PM": 0,
      },
      "Aug 10": { "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0, "5PM": 0 },
      "Aug 17": { "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0 },
      "Aug 24": { "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0 },
      "Aug 31": { "12PM": 0, "1PM": 0, "2PM": 0, "3PM": 0, "4PM": 0 },
    },
  },
};
export default DB;
