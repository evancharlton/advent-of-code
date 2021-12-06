const data = (type = "") => {
  return require("./input")(__filename, ",", type).map((v) => +v);
};

const part1 = (data, days = 80) => {
  let fish = [...data];
  for (let day = 0; day < days; day += 1) {
    const next = [...fish];
    for (let i = 0; i < fish.length; i += 1) {
      if (fish[i] === 0) {
        next[i] = 6;
        next.push(8);
      } else {
        next[i] = fish[i] - 1;
      }
    }
    fish = next;
  }
  return fish.length;
};

const census = (population) =>
  population.reduce((acc, curr) => {
    acc[curr] += 1;
    return acc;
  }, new Array(9).fill(0));

const reproduce = (population) => {
  const next = [...population];
  next[7] += next[0];
  const zero = next.shift();
  next.push(zero);
  return next;
};

const part2 = (data, days = 256) => {
  let population = census(data);
  for (let day = 0; day < days; day += 1) {
    population = reproduce(population);
  }

  return population.reduce((total, v) => total + v, 0);
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
  census,
  reproduce,
};
