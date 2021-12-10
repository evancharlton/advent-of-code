const fs = require("fs");
const http = require("https");
const path = require("path");

if (process.env.AOC_COOKIE === undefined) {
  throw new Error(`Missing $AOC_COOKIE`);
}

const now = new Date();

const { leaderboardId, year, sort } = (() => {
  switch (process.argv.length) {
    case 5: // ID, sort, year
      return {
        leaderboardId: process.argv[2],
        sort: process.argv[3],
        year: process.argv[4],
      };
    case 4: // ID, sort
      return {
        leaderboardId: process.argv[2],
        sort: process.argv[3],
        year: String(now.getFullYear()),
      };
    case 3: // ID
      return {
        leaderboardId: process.argv[2],
        sort: 1,
        year: String(now.getFullYear()),
      };
    default: {
      throw new Error("Unknown usage pattern");
    }
  }
})();

const inputFile = path.join(year, "leaderboards", `${leaderboardId}.json`);

const CACHE_MILLIS = 1000 * 60 * 15; // Fifteen minutes

const getLeaderboard = async () => {
  // See if it exists already
  if (fs.existsSync(inputFile)) {
    try {
      const contents = fs.readFileSync(inputFile);
      const leaderboard = JSON.parse(contents);
      const fetchedMillis = leaderboard.fetchedMillis ?? 0;
      const ago = Date.now() - fetchedMillis;
      if (ago < CACHE_MILLIS) {
        return leaderboard;
      }
    } catch (ex) {
      console.warn(ex);
      console.warn("Failed to read cached leaderboard; fetching a new one");
    }
  } else {
    fs.mkdirSync(path.dirname(inputFile), { recursive: true });
    fs.writeFileSync(inputFile, "");
  }

  return new Promise((resolve, reject) => {
    const url = `https://adventofcode.com/${year}/leaderboard/private/view/${leaderboardId}.json`;

    http
      .get(
        url,
        { headers: { cookie: `session=${process.env.AOC_COOKIE}` } },
        (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}`));
            return;
          }
          let contents = "";
          res.on("data", (chunk) => {
            contents += chunk;
          });
          res.on("end", () => {
            resolve(JSON.parse(contents));
          });
        }
      )
      .on("error", (e) => reject(e));
  })
    .then((jsonObj) => {
      jsonObj.fetchedMillis = Date.now();
      return jsonObj;
    })
    .then((jsonObj) => {
      fs.writeFileSync(inputFile, JSON.stringify(jsonObj, null, 2));
      return jsonObj;
    });
};

const ONE_MINUTE = 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_WEEK = ONE_DAY * 7;
const ONE_MONTH = ONE_DAY * 30;
const ONE_YEAR = ONE_DAY * 365;

const readable = (time) => {
  const years = Math.floor(time / ONE_YEAR);
  const months = Math.floor((time % ONE_YEAR) / ONE_MONTH);
  const weeks = Math.floor((time % ONE_MONTH) / ONE_WEEK);
  const days = Math.floor((time % ONE_WEEK) / ONE_DAY);
  const hours = Math.floor((time % ONE_DAY) / ONE_HOUR);
  const minutes = Math.floor((time % ONE_HOUR) / ONE_MINUTE);
  const seconds = time % 60;

  return [
    years ? `${years}y` : "",
    months ? `${months}m` : "",
    weeks ? `${weeks}w` : "",
    days ? `${days}d` : "",
    hours ? `${hours}h` : "",
    minutes ? `${minutes}m` : "",
    seconds ? `${seconds}s` : "",
  ]
    .filter(Boolean)
    .join(" ");
};

getLeaderboard().then(({ members }) => {
  for (let day = 1; day <= 25; day += 1) {
    const dayByDay = Object.values(members)
      .reduce((acc, { name, id, completion_day_level }) => {
        const dayRecord = completion_day_level[String(day)];
        if (!dayRecord) {
          return acc;
        }

        const dayStart = Math.floor(
          new Date(+year, 11, day, 6, 0, 0, 0) / 1000
        );
        const [part1, part2] = ["1", "2"].map((n) => {
          const record = dayRecord[n];
          if (!record) {
            return { human: "TBD", machine: Number.MAX_SAFE_INTEGER };
          }
          const { get_star_ts: ts } = record;
          const diff = ts - dayStart;
          return { human: readable(diff), machine: diff };
        });

        return [
          ...acc,
          {
            name: name ?? `(anonymous user #${id})`,
            "Part 1": part1,
            "Part 2": part2,
            Delta: {
              human:
                part2.machine === Number.MAX_SAFE_INTEGER
                  ? "TBD"
                  : readable(part2.machine - part1.machine),
              machine: part2.machine - part1.machine,
            },
          },
        ];
      }, [])
      .sort(
        (
          {
            ["Part 1"]: { machine: a1 },
            ["Part 2"]: { machine: a2 },
            ["Delta"]: { machine: a2p },
          },
          {
            ["Part 1"]: { machine: b1 },
            ["Part 2"]: { machine: b2 },
            ["Delta"]: { machine: b2p },
          }
        ) => {
          switch (sort) {
            case 1:
            case "1":
              return a1 - b1;
            case 2:
            case "2":
              return a2 - b2;
            case "2+":
            case "delta":
            case "diff":
            case "d":
              return a2p - b2p;
            default:
              throw new Error("Unrecognized sorting: " + sort);
          }
        }
      )
      .map((entry) => ({
        ...entry,
        "Part 1": entry["Part 1"].human,
        "Part 2": entry["Part 2"].human,
        Delta: entry["Delta"].human,
      }));

    if (dayByDay.length > 0) {
      console.log(`Day ${day}:`);
      console.table(dayByDay);
    }
  }
});
