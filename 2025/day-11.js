const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true })
    .map((line) => {
      const [deviceName, ...outputs] = line.split(" ");
      return { name: deviceName.replace(/:$/, ""), outputs };
    })
    .reduce((graph, device) => ({ ...graph, [device.name]: device }), {});
};

const part1 = (items) => {
  const cache = new Map(); // <string, number>
  const countOptions = (deviceID) => {
    if (cache.has(deviceID)) {
      return cache.get(deviceID);
    }

    if (deviceID === "out") {
      return 1;
    }

    return items[deviceID].outputs.reduce(
      (acc, id) => acc + countOptions(id),
      0
    );
  };

  return countOptions("you");
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
