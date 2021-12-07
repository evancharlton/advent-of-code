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
        sort: +process.argv[3],
        year: process.argv[4],
      };
    case 4: // ID, sort
      return {
        leaderboardId: process.argv[2],
        sort: +process.argv[3],
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
    // Is it too soon to fetch again?
    const leaderboard = JSON.parse(fs.readFileSync(inputFile));
    const fetchedMillis = leaderboard.fetchedMillis ?? 0;
    const ago = Date.now() - fetchedMillis;
    if (ago < CACHE_MILLIS) {
      return leaderboard;
    }
  }

  fs.mkdirSync(path.dirname(inputFile), { recursive: true });
  fs.writeFileSync(inputFile, "");

  return new Promise((resolve, reject) => {
    const url = `https://adventofcode.com/${year}/leaderboard/private/view/${leaderboardId}.json`;

    http.get(
      url,
      { headers: { cookie: `session=${process.env.AOC_COOKIE}` } },
      (res) => {
        let contents = "";
        res.on("data", (chunk) => (contents += chunk));
        res.on("end", () => resolve(JSON.parse(contents)));
      }
    );
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

const readable = (time) => {
  const [years, months, weeks, days, hours, minutes, seconds] = [
    Math.floor(time / (60 * 60 * 24 * 30 * 12)),
    Math.floor(time / (60 * 60 * 24 * 30)),
    Math.floor(time / (60 * 60 * 24 * 7)),
    Math.floor(time / (60 * 60 * 24)),
    Math.floor(time / (60 * 60)),
    Math.floor(time / 60),
    Math.floor(time % 60),
  ];

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
          },
        ];
      }, [])
      .sort(
        (
          { ["Part 1"]: { machine: a1 }, ["Part 2"]: { machine: a2 } },
          { ["Part 1"]: { machine: b1 }, ["Part 2"]: { machine: b2 } }
        ) => {
          switch (sort) {
            case 1:
              return a1 - b1;
            case 2:
              return a2 - b2;
            default:
              throw new Error("Unrecognized sorting: " + sort);
          }
        }
      )
      .map((entry) => ({
        ...entry,
        "Part 1": entry["Part 1"].human,
        "Part 2": entry["Part 2"].human,
      }));

    if (dayByDay.length > 0) {
      console.log(`Day ${day}:`);
      console.table(dayByDay);
    }
  }
});
