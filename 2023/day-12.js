const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .filter(Boolean)
    .map((line) => {
      const [springs, info] = line.split(" ");
      return { springs, info: info.split(",").map((v) => +v) };
    });
};

const power = (num) => {
  const out = [];
  for (let i = 0; i < Math.pow(2, num); i += 1) {
    const option = [];
    for (let n = 0; n < num; n += 1) {
      option.push((i >> n) & (0b1 > 0) ? "#" : ".");
    }
    out.push(option.join(""));
  }
  return out;
};

const count = (springs, info) => {
  const pattern = [
    `^\\.*`,
    info.map((c) => `#{${c}}`).join("\\.+"),
    `\\.*$`,
  ].join("");
  const regex = new RegExp(pattern);

  const unknown = springs.replace(/[^?]/g, "").length;
  const powerSets = power(unknown);

  return powerSets
    .map((option) => {
      let foo = springs;
      for (let i = 0; i < option.length; i += 1) {
        foo = foo.replace(/\?/, option[i]);
      }
      if (foo.includes("?")) {
        throw new Error("Something went wrong");
      }
      return foo;
    })
    .filter((candidate) => {
      return regex.test(candidate);
    }).length;
};

const part1 = (lines) => {
  return lines
    .map(({ springs, info }) => {
      return count(springs, info);
    })
    .reduce((acc, v) => acc + v);
};

const unfold = (line, info) => {
  return [
    [line, line, line, line, line].join("?"),
    [info, info, info, info, info].flat(),
  ];
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
  count,
  unfold,
};
