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

const part1 = (valves, limit = 30) => {
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

    ++i % 100_000 === 0 && console.debug(`Step # ${i} ... \t ${elapsedTime}`);

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

const part1old = (valves, limit = 30) => {
  const VERBOSE = limit < 20;

  const lookup = new Map();
  valves.forEach((valve) => {
    lookup.set(valve.id, valve);
  });

  const numValves = valves.filter(({ delta }) => delta > 0).length;

  lookup.forEach((valve, valveId) => {
    valve.next = valve.next.map((id) => lookup.get(id));
    lookup.set(valveId, valve);
  });

  const sum = (openedValves) => {
    return Object.keys(openedValves)
      .map((valveId) => lookup.get(valveId).delta)
      .reduce((acc, v) => acc + v, 0);
  };

  const integrate = (openedValves, currentMinute) => {
    return Object.entries(openedValves)
      .map(([valveId, minuteOpened]) => ({
        delta: lookup.get(valveId).delta,
        minutesOpen: currentMinute - minuteOpened,
      }))
      .map(({ delta, minutesOpen }) => delta * minutesOpen)
      .reduce((acc, v) => acc + v, 0);
  };

  let totalSteps = 0;

  const step = (currentNode, previousNodeId, stepsTaken, openedValves) => {
    ++totalSteps % 100000 === 0 && console.debug(`Step # ${totalSteps} ...`);

    VERBOSE &&
      console.debug(
        indent(stepsTaken),
        `Minute ${stepsTaken}: --> ${
          currentNode.id
        } with open valves: ${Object.entries(openedValves)
          .map(([key, value]) => `${key}=${value}`)
          .sort()
          .join(", ")}`,
        `(= ${sum(openedValves)})`
      );

    if (Object.keys(openedValves).length === numValves) {
      const tot = integrate(openedValves, limit);
      VERBOSE &&
        console.debug(
          indent(stepsTaken + 1),
          `Opened all the valves => ${tot}`
        );
      return tot;
    }

    if (stepsTaken >= limit) {
      const tot = integrate(openedValves, stepsTaken);
      VERBOSE &&
        console.debug(
          indent(stepsTaken + 1),
          `=> ${tot} (${Object.keys(openedValves).length})`
        );
      return tot;
    }

    const options = currentNode.next
      .filter((node) => node.id !== previousNodeId)
      .filter((node) => !openedValves[node.id]);

    const newOpenedValves = { ...openedValves };

    if (currentNode.isValve) {
      VERBOSE &&
        console.debug(
          indent(stepsTaken),
          `Open valve, releasing ${currentNode.delta} pressure`
        );
      newOpenedValves[currentNode.id] = stepsTaken;
    }

    return options
      .map((nextNode) =>
        step(nextNode, currentNode.id, stepsTaken + 1, newOpenedValves)
      )
      .reduce((acc, sum) => Math.max(acc, sum), 0);
  };

  return step(lookup.get("AA"), "", 0, {});
};

const part2 = (lines) => {
  return undefined;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(
    `Part 1:`,
    part1(data(process.argv[2] || ""), +(process.argv[3] ?? 30))
  );
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
};
