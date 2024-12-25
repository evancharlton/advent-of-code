const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true, delim: "\n\n" }).reduce((acc, thing) => {
    const lines = thing.split("\n");
    const which = lines[0] === "#####" ? "locks" : "keys";
    const pins = [];

    if (which === "keys") {
      lines.reverse();
    }

    for (let x = 0; x < lines[0].length; x += 1) {
      let y = 1;
      for (; y <= 6; y += 1) {
        if (lines[y][x] === ".") {
          break;
        }
      }
      pins.push(y - 1);
    }

    acc[which].push(pins);

    return acc;
  }, {
    locks: [],
    keys: [],
  });
};

const part1 = ({ locks, keys }) => {
  const fits = [];

  for (const lock of locks) {
    keyLoop: for (const key of keys) {
      for (let p = 0; p < key.length; p += 1) {
        if (lock[p] + key[p] > 5) {
          continue keyLoop;
        }
      }
      fits.push([lock, key]);
    }
  }

  return fits.length;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
};
