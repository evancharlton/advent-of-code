const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const crt = (program) => {
  const xLog = [
    1, // starts at 1
  ];

  program.forEach((ins) => {
    const [op, arg] = ins.split(" ");
    const x = xLog.length ? xLog[xLog.length - 1] : 1;
    switch (op) {
      case "noop": {
        xLog.push(x);
        break;
      }

      case "addx": {
        xLog.push(x);
        xLog.push(x + +arg);
        break;
      }
    }
  });

  return xLog;
};

const part1 = (lines) => {
  const xLog = crt(lines);

  return [20, 60, 100, 140, 180, 220].reduce((acc, offset) => {
    return (
      acc +
      offset *
        xLog[
          // Subtract 1 because the log is for the *end* of each cycle, not the
          // start or the middle. To get what the value would be *during* the
          // cycle, we need to look at what the _previous_ cycle _ended_ with.
          offset - 1
        ]
    );
  }, 0);
};

const part2 = (lines) => {
  const xLog = crt(lines);
  const screen = [];
  for (let i = 0; i < 6; i += 1) {
    screen.push(new Array(40).fill("."));
  }

  for (let i = 0; i < xLog.length; i += 1) {
    const spriteMiddleX = xLog[i];
    const dRow = new Array(40).fill(".");
    dRow[spriteMiddleX - 1] = "#";
    dRow[spriteMiddleX] = "#";
    dRow[spriteMiddleX + 1] = "#";

    const beamX = i % 40;
    const row = Math.floor(i / 40);

    const lit =
      beamX === spriteMiddleX - 1 ||
      beamX === spriteMiddleX ||
      beamX === spriteMiddleX + 1;

    if (lit) {
      screen[row][beamX] = "#";
    }

    // console.debug(
    //   [
    //     "Sprite position: " + dRow.join(""),
    //     "Current CRT row: " + screen[row].join(""),
    //   ].join("\n")
    // );
  }

  const print = screen.map((row) => row.join(" ")).join("\n");
  return print;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  crt,
  data,
  part1,
  part2,
};
