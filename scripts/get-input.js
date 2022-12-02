const fs = require("fs");
const http = require("https");
const path = require("path");

if (process.env.AOC_COOKIE === undefined) {
  throw new Error(`Missing $AOC_COOKIE`);
}

const now = new Date();

const date = `0${process.argv[2] ?? now.getDate()}`.substr(-2);
const month = now.getMonth();
const year = process.argv[3] ?? String(now.getFullYear());

const inputFile = path.join(year, "input", `day-${date}.txt`);
const testFile = path.join(year, "input", `day-${date}.test.txt`);

if (!process.argv[3] && month !== 11) {
  console.error(
    "Unable to fetch outside of December. Please specify both the date and the year."
  );
  console.info(" $ yarn fetch <date> <year>");
  process.exit(1);
}

const url = `https://adventofcode.com/${year}/day/${date.replace(
  /^0/,
  ""
)}/input`;
const out = fs.createWriteStream(
  path.resolve(path.join(__dirname, "..", inputFile))
);

console.log(`Fetching ${url} into ${inputFile}`);

http.get(
  url,
  {
    headers: {
      cookie: `session=${process.env.AOC_COOKIE}`,
      "User-Agent":
        "github.com/evancharlton/advent-of-code by evancharlton@gmail.com",
    },
  },
  (res) => res.pipe(out)
);

if (!fs.existsSync(testFile)) {
  fs.writeFileSync(testFile, "");
}
