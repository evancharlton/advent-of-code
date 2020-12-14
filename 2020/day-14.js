const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type);
  return lines;
};

const convertToBinary = (x, len = 36) => {
  let str = Number(x).toString(2);
  while (str.length < len) {
    str = `0${str}`;
  }
  return str;
};

const ZEROED_MEMORY = "000000000000000000000000000000000000";

const apply = (memory, value, mask) => {
  const start = String(memory || ZEROED_MEMORY);
  const end = start
    .split("")
    .map((existingValue, pos) => {
      const maskValue = mask[pos];
      if (maskValue === "X") {
        // Only the X values can be changed
        return value[pos];
      }
      return maskValue;
    })
    .join("");
  return end;
};

const part1 = (lines) => {
  const apps = [];
  let app = undefined;
  lines.forEach((line) => {
    if (line.startsWith("mask")) {
      // New app
      if (app) {
        apps.push({ ...app });
      }
      app = {
        ins: [],
      };
      app.mask = line.replace("mask = ", "");
    } else if (line.startsWith("mem")) {
      const [_, offset, value] = line.match(/^mem\[([0-9]+)\] = ([0-9]+)$/);
      app.ins.push({
        offset: +offset,
        value: +value,
      });
    }
  });
  apps.push({ ...app });

  const memory = {};

  apps.forEach(({ mask, ins }, i) => {
    ins.forEach(({ offset, value }) => {
      const entry = apply(
        memory[offset],
        convertToBinary(value, ZEROED_MEMORY.length),
        mask
      );
      memory[offset] = entry;
    });
    if (i === 0) {
      console.log(memory);
    }
  });

  console.log(
    Object.values(memory)
      .filter(Boolean)
      .map((entry) => parseInt(entry, 2))
  );

  return Object.values(memory)
    .filter(Boolean)
    .map((entry) => parseInt(entry, 2))
    .reduce((acc, entry) => acc + entry, 0);
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
  convertToBinary,
  apply,
  ZEROED_MEMORY,
};
