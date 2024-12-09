const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true })[0]
    .split("")
    .map((v) => +v);
};

const part1 = (map) => {
  let checksum = 0;
  let pointer = 0;
  let end = map.length - 1;

  for (let i = 0; i < map.length; i += 1) {
    const cell = map[i];
    const id = Math.floor(i / 2);
    for (let j = 0; j < cell; j += 1) {
      // If we are in *block mode* then we need to just calculate the checksum
      // for these digits.
      if (i % 2 === 0) {
        checksum += pointer * id;
      } else {
        // If we're in *empty cell* mode, then we first need to take a disk
        // block from the end of the disk and move it into here.

        if (map[end] === 0) {
          // There's nothing to take from. We need to advance the pointer to
          // the left.
          end -= 2;
        }

        if (end <= i) {
          // We can't proceed with this, can we?
          break;
        }

        if (end <= i) {
          // We've reached the end of the disk - from here on out, it's all
          // going to be empty .. except for maybe the next block? Something
          // like that, anyway.
        }

        const endId = Math.floor(end / 2);
        checksum += pointer * endId;
        map[end] -= 1;
      }
      pointer += 1;
    }
  }

  return checksum;
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
