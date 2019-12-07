const readLines = require("../read-input");

const split = input => {
  const [body, moon] = input.split(")");
  return { body, moon };
};

const TEST = false && [
  "COM)B",
  "B)C",
  "C)D",
  "D)E",
  "E)F",
  "B)G",
  "G)H",
  "D)I",
  "E)J",
  "J)K",
  "K)L"
];

const countMoons = ({ moons }) => {
  if (!moons) {
    throw new Error("Bad input (missing moons)");
  }

  if (Object.keys(moons).length === 0) {
    return 0;
  }

  return Object.keys(moons)
    .map(key => moons[key])
    .reduce((total, moon) => {
      return total + 1 + countMoons(moon);
    }, 0);
};

readLines("./day-6/input", TEST)
  .then(lines => {
    const system = {};
    lines.forEach(line => {
      const { body, moon } = split(line);
      if (!system[body]) {
        // This body doesn't exist; we need to create it.
        system[body] = {
          name: body,
          moons: {}
        };
      }

      if (!system[moon]) {
        // The moon doesn't exist; initialize it.
        system[moon] = {
          name: moon,
          moons: {}
        };
      }

      // Now link them up
      system[body].moons[moon] = system[moon];
    });
    return system;
  })
  // .then(system => {
  //   console.log(JSON.stringify(system, null, 2));
  //   return system;
  // })
  .then(system => {
    return Object.keys(system)
      .map(key => system[key])
      .reduce((total, body) => {
        return total + countMoons(body);
      }, 0);
  })
  .then(output => {
    if (output !== undefined) {
      console.log(output);
    }
    process.exit(0);
  })
  .catch(ex => {
    console.error(ex);
    process.exit(1);
  });
