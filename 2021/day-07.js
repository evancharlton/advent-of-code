const data = (type = "") => {
  return require("./input")(__filename, ",", type).map((p) => +p);
};

const part1 = (positions) => {
  const min = Math.min(...positions);
  const max = Math.max(...positions);

  let minimumFuelCost = Number.MAX_SAFE_INTEGER;
  for (let i = min; i <= max; i += 1) {
    const fuelSpent = positions.reduce((acc, p) => {
      return acc + Math.abs(p - i);
    }, 0);
    if (fuelSpent <= minimumFuelCost) {
      minimumFuelCost = fuelSpent;
    }
  }

  return minimumFuelCost;
};

const costs = {};

const fuelCost = (x, y) => {
  const distance = Math.abs(x - y);
  if (!(distance in costs)) {
    let sum = 0;
    for (let i = 0; i <= Math.abs(x - y); i += 1) {
      sum += i;
    }
    costs[distance] = sum;
  }
  return costs[distance];
};

const part2 = (positions) => {
  const min = Math.min(...positions);
  const max = Math.max(...positions);

  let minimumFuelCost = Number.MAX_SAFE_INTEGER;
  for (let i = min; i <= max; i += 1) {
    const fuelSpent = positions.reduce((acc, p) => {
      return acc + fuelCost(p, i);
    }, 0);
    if (fuelSpent <= minimumFuelCost) {
      minimumFuelCost = fuelSpent;
    }
  }

  return minimumFuelCost;
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
  fuelCost,
};
