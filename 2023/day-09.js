const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((line) =>
    line.split(/\s+/).map((v) => +v)
  );
};

const createTriangle = (lines) =>
  lines
    .map((readings) => {
      const triangle = [readings];
      while (!triangle[triangle.length - 1].every((item) => item === 0)) {
        const bottom = triangle[triangle.length - 1];
        const next = bottom.reduce((acc, v, i, row) => {
          if (i === row.length - 1) {
            return acc;
          }
          const delta = row[i + 1] - v;
          return [...acc, delta];
        }, []);
        triangle.push(next);
      }
      return triangle;
    })
    .map((triangle) => {
      for (let i = triangle.length - 1; i >= 0; i -= 1) {
        if (i === triangle.length - 1) {
          triangle[i].push(0);
          continue;
        }

        const below = triangle[i + 1];
        const current = triangle[i];

        const belowLast = below[below.length - 1];
        const currentLast = current[current.length - 1];

        const belowFirst = below[0];
        const currentFirst = current[0];

        current.unshift(currentFirst - belowFirst);
        current.push(currentLast + belowLast);
      }
      return triangle;
    });

const part1 = (lines) => {
  return createTriangle(lines)
    .map((triangle) => triangle[0].pop())
    .reduce((acc, v) => acc + v);
};

const part2 = (lines) => {
  return createTriangle(lines)
    .map((triangle) => triangle[0][0])
    .reduce((acc, v) => acc + v);
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
