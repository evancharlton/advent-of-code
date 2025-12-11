const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true })
    .map((line) => {
      const [deviceName, ...outputs] = line.split(" ");
      return [deviceName.replace(/:$/, ""), outputs];
    })
    .reduce((graph, [name, outputs]) => ({ ...graph, [name]: outputs }), {});
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

    return items[deviceID].reduce((acc, id) => {
      const res = countOptions(id);
      cache.set(id, res);
      return acc + res;
    }, 0);
  };

  return countOptions("you");
};

const part2 = (items) => {
  const countOptions = (node, end, cache) => {
    if (cache.has(node)) {
      return cache.get(node);
    }

    if (node === end) {
      return 1;
    }

    if (!items[node]) {
      return 0;
    }

    return items[node].reduce((acc, id) => {
      const res = countOptions(id, end, cache);
      cache.set(id, res);
      return acc + res;
    }, 0);
  };

  return Math.max(
    countOptions("svr", "fft", new Map()) *
      countOptions("fft", "dac", new Map()) *
      countOptions("dac", "out", new Map()),
    countOptions("svr", "dac", new Map()) *
      countOptions("dac", "fft", new Map()) *
      countOptions("fft", "out", new Map())
  );
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
