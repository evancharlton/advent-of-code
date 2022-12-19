const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .filter((line) => !!line)
    .map((line) => {
      const [, id, robotsText] = line.match(/Blueprint (.+): (.+)$/);
      const robotsInfo = robotsText.split(". ");
      return {
        id,
        ...robotsInfo.reduce((acc, robotInfo) => {
          const [, kind, costsText] = robotInfo.match(
            /Each (.+) robot costs (.+)$/
          );
          const costs = costsText.split(" and ");
          return {
            ...acc,
            [kind]: costs.reduce((costsAcc, cost) => {
              const [amount, resource] = cost.split(" ");
              return { ...costsAcc, [resource]: +amount };
            }, {}),
          };
        }, {}),
      };
    });
};

const chooseProject = (blueprint, inventory, robots) => {};

const execute = (blueprint, timeLimit = 24) => {
  const {
    ore: oreRobot,
    clay: clayRobot,
    obsidian: obsidianRobot,
    geode: geodeRobot,
  } = blueprint;
  const inventory = {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geodes: 0,
  };

  const robots = {
    ore: 1,
    clay: 0,
    obsidian: 0,
    geode: 0,
  };

  for (let minute = 1; minute <= timeLimit; minute += 1) {
    console.log(`== Minute ${minute} ==`);
    const startInventory = { ...inventory };
    const startRobots = { ...robots };

    // The factory makes new robots
    const project = chooseProject(blueprint, inventory, robots);
    switch (project) {
      case "geode": {
        console.log(
          `Spend ${obsidianRobot.ore} ore and ${obsidianRobot.obsidian} obsidian to start building an geode-cracking robot.`
        );
        inventory.ore -= geodeRobot.ore;
        inventory.obsidian -= geodeRobot.obsidian;
        robots.geode += 1;
        break;
      }
      case "obsidian": {
        console.log(
          `Spend ${obsidianRobot.ore} ore and ${obsidianRobot.clay} clay to start building an obsidian-collecting robot.`
        );
        inventory.ore -= obsidianRobot.ore;
        inventory.clay -= obsidianRobot.clay;
        robots.obsidian += 1;
        break;
      }
      case "clay": {
        console.log(
          `Spend ${clayRobot.ore} ore to start building a clay-collecting robot.`
        );
        inventory.ore -= clayRobot.ore;
        robots.clay += 1;
        break;
      }
      case "ore": {
        console.log(
          `Spend ${clayRobot.ore} ore to start building an ore-collecting robot.`
        );
        inventory.ore -= clayRobot.ore;
        robots.ore += 1;
        break;
      }
      default: {
        // Do nothing
      }
    }

    // All of the robots do their thing.
    inventory.ore += startRobots.ore;
    inventory.clay += startRobots.clay;
    inventory.obsidian += startRobots.obsidian;
    inventory.geodes += startRobots.geode;

    // Print a status
    console.log(
      `${startRobots.ore} ore-collecting robot${
        startRobots.ore > 1 ? "s" : ""
      } collect${startRobots.ore > 1 ? "" : "s"} ${
        startRobots.ore
      } ore; you now have ${inventory.ore} ore.`
    );
    startRobots.clay &&
      console.log(
        `${startRobots.clay} clay-collecting robot${
          startRobots.clay > 1 ? "s" : ""
        } collect${startRobots.clay > 1 ? "" : "s"} ${
          startRobots.clay
        } clay; you now have ${inventory.clay} clay.`
      );
    startRobots.obsidian &&
      console.log(
        `${startRobots.obsidian} obsidian-collecting robot${
          startRobots.obsidian > 1 ? "s" : ""
        } collect${startRobots.obsidian > 1 ? "" : "s"} ${
          startRobots.obsidian
        } obsidian; you now have ${inventory.obsidian} obsidian.`
      );
    startRobots.geode &&
      console.log(
        `${startRobots.geode} geode-cracking robot${
          startRobots.geode > 1 ? "s" : ""
        } crack${startRobots.geode > 1 ? "" : "s"} ${
          startRobots.geode
        } geodes; you now have ${inventory.geodes} open geodes.`
      );

    if (robots.clay !== startRobots.clay) {
      // We were building a new one
      console.log(
        `The new clay-collecting robot is ready; you now have ${robots.clay} of them.`
      );
    }

    console.log("");
  }

  return inventory.geodes;
};

const part1 = (blueprints) => {
  return execute(blueprints[0]);
  return blueprints.map((blueprint) => execute(blueprint));
};

const part2 = (lines) => {
  return undefined;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
};
