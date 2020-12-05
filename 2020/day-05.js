const lines = require("./input")(__filename, "\n");

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

const plane = lines.map(getSeatInfo).reduce((acc, { row, seat }) => {
  return {
    ...acc,
    [row]: {
      ...acc[row],
      [seat]: true,
    },
  };
}, {});

console.table(plane);
