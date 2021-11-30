const fs = require("fs");
const http = require("https");
const path = require("path");

if (process.env.AOC_COOKIE === undefined) {
  throw new Error(`Missing $AOC_COOKIE`);
}

const now = new Date();

const date = process.argv[2] || (() => `0${now.getDate()}`.substr(-2))();
const month = now.getMonth();
const year = process.argv[3] || (() => String(now.getFullYear()))();

const inputFile = path.join(year, "input", `day-${date}.txt`);
const testFile = path.join(year, "input", `day-${date}.test.txt`);

if (!process.argv[3] && month !== 12) {
  console.error(
    "Unable to fetch outside of December. Please specify both the date and the year."
  );
  console.info(" $ yarn fetch <date> <year>");
  process.exit(1);
}

const out = fs.createWriteStream(path.resolve(path.join(__dirname, inputFile)));

console.log(`Fetching input into ${inputFile}`);

http.get(
  `https://adventofcode.com/${year}/day/${date}/input`,
  { headers: { cookie: `session=${process.env.AOC_COOKIE}` } },
  (res) => res.pipe(out)
);

if (!fs.existsSync(testFile)) {
  fs.writeFileSync(testFile, "");
}
