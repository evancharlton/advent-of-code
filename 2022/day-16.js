const { astar } = require("../library/astar");

const data = (type = "") => {
  const REGEX =
    /^Valve (.{2}) has flow rate=(.+); tunnels? leads? to valves? (.+)$/;

  return require("./input")(__filename, "\n", type)
    .filter((line) => REGEX.test(line))
    .map((line) => line.match(REGEX))
    .reduce((acc, [_, valveId, flowRate, valves]) => {
      const nextActions = valves.split(", ");

      const room = {
        id: valveId,
        delta: +flowRate,
        next: nextActions.reduce((acc, id) => ({ ...acc, [id]: 1 }), {}),
      };

      return [...acc, room];
    }, []);
};

const indent = (depth) => {
  return new Array(depth).fill("").join(" ");
};

const createMap = (valves) => {
  const lookup = new Map();
  valves.forEach((valve) => {
    lookup.set(valve.id, valve);
  });

  // Now we want to squash it down and remove the useless nodes.
  lookup.forEach((valve, valveId) => {
    if (valveId === "AA") {
      return;
    }

    if (valve.delta === 0) {
      // This node is useless.
      // Let's remove ourselves from the equation by linking our peers directly.
      const neighborIds = Object.keys(valve.next);
      neighborIds.forEach((neighborId) => {
        const node = lookup.get(neighborId);
        const distance = valve.next[neighborId];
        neighborIds
          .filter((id) => id !== neighborId)
          .forEach((otherNeighborId) => {
            node.next[otherNeighborId] = distance + valve.next[otherNeighborId];
            delete node.next[valveId];
          });
      });

      lookup.delete(valveId);
    }
  });

  return lookup;
};

const part1 = (valves, limit) => {
  return valves;
  for (let minute = 0; minute <= limit; minute += 1) {}
};

const part1blah = (valves, limit = 30) => {
  const VERBOSE = false;

  const lookup = createMap(valves);
  let i = 0;

  const sum = (openedValves) => {
    return Object.keys(openedValves)
      .map((valveId) => lookup.get(valveId).delta)
      .reduce((acc, v) => acc + v, 0);
  };

  const integrate = (openedValves, currentMinute) => {
    return Object.entries(openedValves)
      .map(([valveId, minuteOpened]) => ({
        delta: lookup.get(valveId).delta,
        minutesOpen: currentMinute - 1 - minuteOpened,
      }))
      .map(({ delta, minutesOpen }) => delta * minutesOpen)
      .reduce((acc, v) => acc + v, 0);
  };

  const step = (currentValveId, previousValveId, elapsedTime, openValveIds) => {
    // if (++i > 1_000_000) {
    //   throw new Error("Overflow");
    // }

    ++i % 1_000_000 === 0 && console.debug(`Step # ${i} ... \t ${elapsedTime}`);

    VERBOSE &&
      console.debug(
        indent(elapsedTime),
        `Minute ${elapsedTime}: --> ${currentValveId} with open valves: ${Object.entries(
          openValveIds
        )
          .map(([key, value]) => `${key}=${value}`)
          .sort()
          .join(", ")}`,
        `(= ${sum(openValveIds)})`
      );

    if (elapsedTime >= limit) {
      return integrate(openValveIds, limit);
    }

    const currentValve = lookup.get(currentValveId);
    if (!currentValve) {
      throw new Error(`Missing ${currentValveId}`);
    }

    const canOpenValve =
      !openValveIds[currentValveId] && currentValve.delta > 0;
    const options = Object.entries(currentValve.next)
      .filter(([newValveId], _, ids) => {
        if (ids.length === 1) {
          return true;
        }

        // Don't backtrack if we can avoid it.
        if (newValveId === previousValveId) {
          return false;
        }

        return true;
      })
      .map(([newValveId, distance]) => {
        const paths = [];

        if (canOpenValve) {
          VERBOSE &&
            console.debug(
              indent(elapsedTime + 1),
              `Minute ${elapsedTime + 1}: Opened valve ${currentValveId}`,
              `(=${sum(openValveIds)})`
            );
          paths.push(
            step(
              newValveId,
              currentValveId,
              elapsedTime + distance + 1 /* time spent opening the valve */,
              {
                ...openValveIds,
                [currentValveId]: elapsedTime,
              }
            )
          );
        }
        // Also test not opening the valve
        paths.push(
          step(newValveId, currentValveId, elapsedTime + distance, openValveIds)
        );

        return paths;
      })
      .flat();
    return Math.max(...options);
  };

  try {
    return step("AA", "", 0, {});
  } finally {
    console.log(`Used ${i} steps`);
  }
};

Array.prototype.power = function () {
  const powerset = [];
  for (let n = 0; n < Math.pow(this.length, 2); n += 1) {
    powerset.push(
      this.filter((item, i) => {
        return (n >> i) & 1;
      })
    );
  }
  return powerset;
};

Array.prototype.combinations = function () {
  const out = this.flatMap((v, i, a) => {
    return a.slice(i + 1).map((w) => [v, w]);
  });

  // Don't forget the duplicates, in case the elephant and I go the same way for
  // one turn.
  this.forEach((item) => {
    out.push([item, item]);
  });

  return out;
};

const part2 = (valves) => {
  return undefined;
};

const part2blah = (valves, limit = 26) => {
  const VERBOSE = false;

  const lookup = createMap(valves);
  let i = 0;

  const sum = (openedValves) => {
    return Object.keys(openedValves)
      .map((valveId) => lookup.get(valveId).delta)
      .reduce((acc, v) => acc + v, 0);
  };

  const integrate = (openedValves, currentMinute) => {
    return Object.entries(openedValves)
      .map(([valveId, minuteOpened]) => ({
        delta: lookup.get(valveId).delta,
        minutesOpen: currentMinute - 1 - minuteOpened,
      }))
      .map(({ delta, minutesOpen }) => delta * minutesOpen)
      .reduce((acc, v) => acc + v, 0);
  };

  const step = (
    [currentValveId, previousValveId],
    elapsedTime,
    openValveIds
  ) => {
    // if (++i > 1_000_000) {
    //   throw new Error("Overflow");
    // }

    ++i % 1_000_000 === 0 && console.debug(`Step # ${i} ... \t ${elapsedTime}`);

    VERBOSE &&
      console.debug(
        indent(elapsedTime),
        `Minute ${elapsedTime}: --> ${currentValveId} with open valves: ${Object.entries(
          openValveIds
        )
          .map(([key, value]) => `${key}=${value}`)
          .sort()
          .join(", ")}`,
        `(= ${sum(openValveIds)})`
      );

    if (elapsedTime >= limit) {
      return integrate(openValveIds, limit);
    }

    const currentValve = lookup.get(currentValveId);
    if (!currentValve) {
      throw new Error(`Missing ${currentValveId}`);
    }

    const canOpenValve =
      !openValveIds[currentValveId] && currentValve.delta > 0;
    const options = Object.entries(currentValve.next)
      .filter(([newValveId], _, ids) => {
        if (ids.length === 1) {
          return true;
        }

        // Don't backtrack if we can avoid it.
        if (newValveId === previousValveId) {
          return false;
        }

        return true;
      })
      .combinations()
      .map(
        ([
          [myNewValveId, myDistance],
          [elephantNewValveId, elephantDistance],
        ]) => {
          const paths = [
            // I take a step
            step(
              [myNewValveId, currentValveId],
              elapsedTime + myDistance,
              openValveIds
            ),
            // Elephant takes a step
            step([elephantNewValveId, ele]),
          ];

          if (canOpenValve) {
            VERBOSE &&
              console.debug(
                indent(elapsedTime + 1),
                `Minute ${elapsedTime + 1}: Opened valve ${currentValveId}`,
                `(=${sum(openValveIds)})`
              );
            paths.push(
              step(
                [newValveId, currentValveId],
                elapsedTime + distance + 1 /* time spent opening the valve */,
                {
                  ...openValveIds,
                  [currentValveId]: elapsedTime,
                }
              )
            );
          }
          // Also test not opening the valve
          paths.push(
            step(
              [newValveId, currentValveId],
              elapsedTime + distance,
              openValveIds
            )
          );

          return paths;
        }
      )
      .flat();
    return Math.max(...options);
  };

  try {
    return step(["AA", ""], 0, {});
  } finally {
    console.log(`Used ${i} steps`);
  }
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  let [_, __, file, limit] = process.argv;
  if (!limit) {
    if (!Number.isNaN(+file)) {
      limit = +file;
      file = "";
    }
  }

  console.log(`Part 1:`, part1(data(file), limit));
  console.log(`Part 2:`, part2(data(file), limit));
}

module.exports = {
  data,
  part1,
  part2,
};
