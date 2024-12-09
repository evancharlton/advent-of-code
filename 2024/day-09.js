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

        const endId = Math.floor(end / 2);
        checksum += pointer * endId;
        map[end] -= 1;
      }
      pointer += 1;
    }
  }

  return checksum;
};

const part2 = (map) => {
  let checksum = 0;

  const blockOffsets = map.reduce(
    (acc, v) => [...acc, (acc[acc.length - 1] ?? 0) + v],
    [0]
  );

  for (let i = map.length - 1; i >= 0; i -= 2) {
    const fileSize = map[i];
    const fileId = i / 2;
    // Scan from the right and place the files
    let newHome = i;
    for (let j = 1; j < i; j += 2) {
      if (map[j] >= fileSize) {
        // We can move a file here
        newHome = j;
        break;
      }
    }

    map[newHome] -= fileSize;
    map[i] = 0;

    // Update the checksum accordingly
    for (let k = 0; k < fileSize; k += 1) {
      checksum += blockOffsets[newHome] * fileId;
      blockOffsets[newHome] += 1;
    }
  }

  return checksum;
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
