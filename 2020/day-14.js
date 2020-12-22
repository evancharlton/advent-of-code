const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type);
  return lines;
};

const convertToBinary = (x, len = ZEROED_MEMORY.length) => {
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

const createApps = (lines) => {
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
  return apps;
};

const part1 = (lines) => {
  const apps = createApps(lines);
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
  });

  return Object.values(memory)
    .filter(Boolean)
    .map((entry) => parseInt(entry, 2))
    .reduce((acc, entry) => acc + entry, 0);
};

const getOffsets = (offset, mask) => {
  const addr = convertToBinary(offset);
  const addresses = [addr];
  const expected = Math.pow(2, mask.split("").filter((v) => v === "X").length);

  addr.split("").forEach((char, i) => {
    const maskValue = mask[i];
    if (maskValue === "0") {
      // unchanged
    } else if (maskValue === "1") {
      // Replace it with a 1
      for (let a = 0; a < addresses.length; a += 1) {
        const updated = addresses[a].split("");
        updated[i] = "1";
        addresses[a] = updated.join("");
      }
    } else if (maskValue === "X") {
      const copies = [...addresses];
      while (addresses.length) {
        addresses.shift();
      }
      const exploded = copies
        .map((address) => {
          const zero = String(address).split("");
          const one = String(address).split("");
          zero[i] = "0";
          one[i] = "1";
          return [zero.join(""), one.join("")];
        })
        .flat();
      addresses.push(...exploded);
    }
  });

  if (addresses.length !== expected) {
    throw new Error(
      `Missing addresses (expected ${expected}, got ${addresses.length})`
    );
  }

  return addresses.map((addr) => parseInt(addr, 2));
};

const part2 = (lines) => {
  const apps = createApps(lines);
  const memory = {};
  apps.forEach(({ mask, ins }, i) => {
    ins.forEach(({ offset, value }) => {
      const offsets = getOffsets(offset, mask);
      offsets.forEach((addr) => {
        memory[addr] = value;
      });
    });
  });

  return (
    Object.values(memory)
      .filter(Boolean)
      // .map((entry) => parseInt(entry, 2))
      .reduce((acc, entry) => acc + entry, 0)
  );
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
  convertToBinary,
  apply,
  ZEROED_MEMORY,
  getOffsets,
};
