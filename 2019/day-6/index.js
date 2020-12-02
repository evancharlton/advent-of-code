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
  "K)L",
  "K)YOU",
  "I)SAN"
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

const isRelevant = ({ name, moons }) => {
  if (name === "YOU" || name === "SAN") {
    return true;
  }
  if (moons.YOU || moons.SAN) {
    return true;
  }
  return Object.keys(moons)
    .map(k => moons[k])
    .some(moon => isRelevant(moon));
};

const bodyExists = (bodyId, system) => {
  return !!system[bodyId];
};

const cleanedBody = (bodyId, system) => {
  const body = system[bodyId];
  if (!body) {
    throw new Error(`${bodyId} does not exist`);
  }
  return {
    name: body.name,
    moons: Object.keys(body.moons).reduce((acc, moonId) => {
      if (!bodyExists(moonId, system)) {
        return acc;
      }
      return {
        ...acc,
        [moonId]: cleanedBody(moonId, system)
      };
    }, {})
  };
};

const flatten = ({ moons }) => {
  if (Object.keys(moons).length === 0) {
    return {};
  }
  return Object.keys(moons).reduce((acc, moonId) => {
    return {
      ...acc,
      [moonId]: true,
      ...flatten(moons[moonId])
    };
  }, {});
};

const containsBoth = body => {
  const flat = flatten(body);
  return flat.YOU && flat.SAN;
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
  .then(system => {
    // Prune the irrelevant bodies (ones which don't have YOU or SAN downstream)
    return Object.keys(system).reduce((pruned, bodyId) => {
      if (!isRelevant(system[bodyId])) {
        return pruned;
      }
      return {
        ...pruned,
        [bodyId]: system[bodyId]
      };
    }, {});
  })
  .then(system => {
    // Now do a second pass to remove the broken links
    return Object.keys(system).reduce((cleaned, bodyId) => {
      return {
        ...cleaned,
        [bodyId]: cleanedBody(bodyId, system)
      };
    }, {});
  })
  .then(system => {
    // Now find the sub-trees which contains both YOU and SAN
    return Object.keys(system).reduce((cleaned, bodyId) => {
      if (!containsBoth(system[bodyId])) {
        return cleaned;
      }
      return {
        ...cleaned,
        [bodyId]: system[bodyId]
      };
    }, {});
  })
  .then(system => {
    // Find the smallest subtree
    return Object.keys(system).reduce(
      (acc, bodyId) => {
        const { count } = acc;
        const flat = flatten(system[bodyId]);
        const num = Object.keys(flat).length;
        if (num < count) {
          return {
            count: num,
            smallest: system[bodyId]
          };
        }
        return acc;
      },
      { count: Number.MAX_SAFE_INTEGER }
    ).smallest;
  })
  .then(smallestBody => {
    return Object.keys(flatten(smallestBody)).filter(
      k => k !== "YOU" && k !== "SAN"
    ).length;
  })
  .then(output => {
    if (output !== undefined) {
      if (Array.isArray(output) || typeof output === "object") {
        console.log(JSON.stringify(output, null, 2));
      } else {
        console.log(output);
      }
    }
    process.exit(0);
  })
  .catch(ex => {
    console.error(ex);
    process.exit(1);
  });
