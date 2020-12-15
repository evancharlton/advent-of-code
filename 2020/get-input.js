const fs = require("fs");
const http = require("https");
const path = require("path");

if (process.env.AOC_COOKIE === undefined) {
  throw new Error(`Missing $AOC_COOKIE`);
}

const date =
  process.argv[2] ||
  (() => {
    const d = new Date();
    const date = d.getDate();
    if (date < 10) {
      return `0${date}`;
    }
    return String(date);
  })();

const name = `input/day-${date}.txt`;
const out = fs.createWriteStream(path.resolve(path.join(__dirname, name)));

console.log(`Fetching input into ${name}`);

http.get(
  "https://adventofcode.com/2020/day/13/input",
  {
    headers: {
      cookie: `session=${process.env.AOC_COOKIE}`,
    },
  },
  (res) => res.pipe(out)
);
