const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true }).map((line) =>
    line.split(/\s+/).map((v) => +v)
  );
};

const validate = (report) => {
  const direction = report[0] - report[1] > 0;
  for (let i = 1; i < report.length; i += 1) {
    const prev = report[i - 1];
    const curr = report[i];
    const diff = prev - curr;
    const absDiff = Math.abs(diff);
    if (absDiff <= 0 || absDiff > 3) {
      return false;
    }

    if (diff > 0 !== direction) {
      return false;
    }
  }
  return true;
};

const part1 = (lines) => {
  return lines.filter(validate).length;
};

const part2 = (lines) => {
  return lines.filter((report) => {
    for (let i = 0; i < report.length; i += 1) {
      const copy = [...report];
      copy.splice(i, 1);
      if (validate(copy)) {
        return true;
      }
    }
    return false;
  }).length;
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
