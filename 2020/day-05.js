const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const getSeatInfo = (input) => {
  const letters = input.split("");
  const rowInfo = letters.slice(0, 7);
  const seatInfo = letters.slice(7);

  const row = rowInfo.reduce(
    ([start, end], l) => {
      if (end - start === 1) {
        return l === "F" ? start : end;
      }
      const mid = start + (end - start) / 2;
      if (l === "F") {
        return [start, Math.floor(mid)];
      } else {
        return [Math.ceil(mid), end];
      }
    },
    [0, 127]
  );

  const seat = seatInfo.reduce(
    ([start, end], l) => {
      if (end - start === 1) {
        return l === "L" ? start : end;
      }
      const mid = start + (end - start) / 2;
      if (l === "L") {
        return [start, Math.floor(mid)];
      } else {
        return [Math.ceil(mid), end];
      }
    },
    [0, 7]
  );

  return { row, seat, id: row * 8 + seat };
};

const part1 = (lines) => {
  const [{ id }] = lines
    .map(getSeatInfo)
    .sort(({ id: idA }, { id: idB }) => idB - idA);
  return id;
};

const part2 = (lines) => {
  const plane = lines.map(getSeatInfo).reduce((acc, { row, seat }) => {
    return {
      ...acc,
      [row]: {
        ...acc[row],
        [seat]: true,
      },
    };
  }, {});

  for (let row = 11; row < 128; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const r = plane[row];
      if (r[col] === undefined) {
        return row * 8 + col;
      }
    }
  }
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
};
