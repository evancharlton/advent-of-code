const { astar } = require("../library/astar");

const data = (type = "") => {
  const REGEX =
    /^Valve (.{2}) has flow rate=(.+); tunnels? leads? to valves? (.+)$/;

  return require("./input")(__filename, "\n", type)
    .filter((line) => REGEX.test(line))
    .map((line) => line.match(REGEX))
    .reduce((acc, [_, valveId, flowRate, valves]) => {
      const nextActions = valves.split(", ");

      // But we can also open this valve, so we want to add a second node to
      // represent that option.
      const openId = `${valveId}+open`;

      const room = {
        id: valveId,
        delta: 0,
        next: [...nextActions],
        isValve: false,
      };

      if (+flowRate > 0) {
        acc.push({
          ...room,
          id: openId,
          delta: +flowRate,
          next: [...nextActions],
          isValve: true,
        });
        room.next.push(openId);
      }

      acc.push(room);

      return acc;
    }, []);
};

const indent = (depth) => {
  return new Array(depth).fill("").join(" ");
};

const part1 = (valves, limit = 30) => {
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
