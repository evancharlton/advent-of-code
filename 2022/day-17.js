let VERBOSE = !!process.env.AOC_VERBOSE;

const data = (type = "") => {
  return require("./input")(__filename, "", type).filter((c) => !!c.trim());
};

const bin = (v) => v.toString(2);

const debug = (...args) => {
  VERBOSE && console.debug(...args);
};

const ROCKS = [
  // line
  [0b0011110],
  // plus
  // prettier-ignore
  [
    0b0001000,
    0b0011100,
    0b0001000
  ],
  // L (well, J I guess)
  // prettier-ignore
  [
    0b0000100,
    0b0000100,
    0b0011100
  ],
  // column
  // prettier-ignore
  [
    0b0010000,
    0b0010000,
    0b0010000,
    0b0010000
  ],
  // square
  // prettier-ignore
  [
    0b0011000,
    0b0011000
  ],
];

const print = (board, indent = 0) => {
  const space = new Array(indent).fill(" ").join("");
  const lines = [...board].map((row) => {
    const out = ["|"];
    for (let i = 0; i < 7; i += 1) {
      out.unshift((row >> i) & 1 ? "#" : ".");
    }
    out.unshift("|");
    return out.join(" ");
  });
  // printed.unshift("\n");
  // printed.push("+---------------+");
  return lines.map((line) => `${space}${line}`).join("\n");
};

const canBePushed = (dir, rock, board, pieceBottom) => {
  switch (dir) {
    case ">": {
      return rock.every((v, n, arr) => {
        const shifted = v >> 1;
        if (shifted << 1 !== v) {
          // This would've pushed over the right edge of the screen.
          return false;
        }

        if (pieceBottom < 0 || !board) {
          return true;
        }

        // See if there's a collision with the board
        const h = arr.length;
        const relevantRowIndex = pieceBottom - (h - 1 - n);
        const relevantRow =
          board[relevantRowIndex] ??
          (relevantRowIndex < 0 ? 0b0000000 : 0b1111111);
        return (shifted | relevantRow) === (shifted ^ relevantRow);
      });
    }

    case "<": {
      return rock.every((v, n, arr) => {
        const shifted = (v << 1) & 0b1111111;
        if (shifted >> 1 !== v) {
          // This would've pushed over the right edge of the screen.
          return false;
        }

        if (pieceBottom < 0 || !board) {
          return true;
        }

        // See if there's a collision with the board
        const h = arr.length;
        const relevantRowIndex = pieceBottom - (h - 1 - n);
        const relevantRow =
          board[relevantRowIndex] ??
          (relevantRowIndex < 0 ? 0b0000000 : 0b1111111);
        return (shifted | relevantRow) === (shifted ^ relevantRow);
      });
    }
    default:
      throw new Error("Unknown operation: " + dir);
  }
};

const push = (rock, dir, board, pieceBottom) => {
  if (!canBePushed(dir, rock, board, pieceBottom)) {
    return rock;
  }

  switch (dir) {
    case ">": {
      return rock.map((v) => v >> 1);
    }

    case "<": {
      return rock.map((v) => v << 1);
    }
    default:
      throw new Error("Unknown operation: " + dir);
  }
};

const canMerge = (piece, board, proposedOverlapIndex) => {
  if (proposedOverlapIndex >= board.length) {
    return false;
  }
  return piece.every((pieceRow, n, arr) => {
    const h = arr.length;
    const relevant = h - 1 - n <= proposedOverlapIndex;

    if (!relevant) {
      return true;
    }

    const relevantRowIndex = proposedOverlapIndex - (h - 1 - n);
    const relevantRow = board[relevantRowIndex] ?? 0b1111111;

    return (relevantRow ^ pieceRow) === (relevantRow | pieceRow);
  });
};

const merge = (board, piece, offsetY) => {
  if (offsetY < 0 || board.length === 0) {
    return [...piece, ...board];
  }

  if (offsetY >= board.length) {
    throw new Error(`Too far down: ${offsetY} >= ${board.length}`);
  }

  const copy = [...board];

  let mergedRows = 0;
  for (let y = offsetY; y >= Math.max(0, offsetY - board.length); y -= 1) {
    const boardRow = copy[y];
    const n = piece.length - 1 - (offsetY - y);
    copy[y] = boardRow | piece[n];
    mergedRows++;
  }

  for (let y = piece.length - 1 - mergedRows; y >= 0; y -= 1) {
    copy.unshift(piece[y]);
  }

  return copy;
};

const simulator =
  ({ jets, prune = Number.MAX_SAFE_INTEGER }) =>
  ({ rocksCount, initialBoard = [], stop = () => false }) => {
    if (!rocksCount) {
      throw new Error("Missing rocksCount");
    }
    let insIndex = 0;
    const ins = () => {
      return jets[insIndex++ % jets.length];
    };

    let rockIndex = 0;
    const getRock = () => {
      return [...ROCKS[rockIndex++ % ROCKS.length]];
    };

    // console.log(
    //   `The first rock is ${ROCKS[0]} and the first 10 instructions are ${jets
    //     .slice(0, 10)
    //     .join(" ")}`
    // );

    const cache = new Map();

    let height = 0;
    let board = [...initialBoard];
    for (let i = 0; i < rocksCount; i += 1) {
      // i % (jets.length * ROCKS.length) === 0 &&
      //   console.debug(
      //     [
      //       `insIndex: ${insIndex} (% jets.length = ${insIndex % jets.length})`,
      //       `rockIndex: ${rockIndex}`,
      //     ].join("\n")
      //   );

      let rock = getRock();
      board.unshift(0, 0, 0);
      let overlapIndex = -2;

      // Now we're aligned with the top of the stack, so we need to start
      // accounting for dropping *and* jets.
      while (canMerge(rock, board, overlapIndex + 1)) {
        overlapIndex++;
        rock = push(rock, ins(), board, overlapIndex);
      }

      // Merge the rock into the stack.
      // const expectedNewLength = startLength + pushed.length - overlapIndex;
      board = merge(board, rock, overlapIndex);
      board = board.filter((v) => v !== 0);
      if (board.length > prune * 2) {
        const before = board.length;
        board = board.slice(0, prune);
        height += before - prune;
      } else {
        height = board.length;
      }

      if (stop(board, height)) {
        break;
      }
    }
    VERBOSE && debug(print(board));

    return { height: board.length - initialBoard.length, board };
  };

const part1 = (jets, count = 2022) => {
  const sim = simulator({ jets });
  const { board, height } = sim({ rocksCount: count });
  console.log(print(board));
  return height;
};

const part2 = (jets, count = 1_000_000_000_000) => {
  const sim = simulator({ jets });

  let rocksPerCycle = 0;
  let repeatedRows = 0;
  let cycle = [];
  let startSegment = [];

  const findLoops = (board) => {
    if (board.length < 20) {
      return false;
    }

    if (cycle.length > 0) {
      // We found a cycle; let's start counting rocks
      rocksPerCycle++;
      return repeatedRows++ === cycle.length;
    } else {
      // Look through the board and see if we can find a pattern that repeats.
      const boardHeight = board.length;
      const halfHeight = Math.floor(boardHeight / 2);
      rangeLoop: for (
        let rangeHeight = 20;
        rangeHeight < halfHeight;
        rangeHeight += 1
      ) {
        const startRange = board.slice(0, rangeHeight);
        const candidateRange = board.slice(rangeHeight, rangeHeight * 2);

        checkLoop: for (let y = 0; y < startRange.length; y += 1) {
          if (startRange[y] !== candidateRange[y]) {
            continue rangeLoop;
          }
        }

        // console.log(`Found a repeating slice of ${startRange.length} rows`);
        // console.log(print(startRange));
        // console.log("----");
        // console.log(print(board));
        offset = board.length - rangeHeight * 2;
        cycle = startRange;
        startSegment = board.slice(rangeHeight * 2);
        break;
      }

      return false;
    }
  };

  const { board } = sim({ rocksCount: count, stop: findLoops });

  console.log("Start:");
  console.log(print(startSegment));
  console.log("Cycle:");
  console.log(print(cycle));
  console.log("Board:");
  console.log(print(board));

  let startRocks = 0;
  sim({
    rocksCount: count,
    stop: (board) => {
      startRocks++;
      return board.length === startSegment.length;
    },
  });

  let runningRockTotal = count;
  let runningHeightTotal = 0;

  // Start with the start segment
  runningHeightTotal += startSegment.length;
  runningRockTotal -= startRocks;

  // Account for the repeated segments
  const numCycles = Math.floor(runningRockTotal / rocksPerCycle);
  runningHeightTotal += (1 + numCycles) * cycle.length;
  runningRockTotal -= numCycles * rocksPerCycle;

  // Account for the final rocks that didn't get to finish a cycle by running
  // a simulation of the end game
  const { board: end, height: leftoverHeight } = sim({
    rocksCount: runningRockTotal,
    initialBoard: cycle,
  });

  runningHeightTotal += leftoverHeight;

  console.log({
    cycleLength: cycle.length,
    rocksPerCycle,
    startSegmentLength: startSegment.length,
    startRocks,
    numCycles,
    runningHeightTotal,
    runningRockTotal,
    countedRocks: startRocks + numCycles * rocksPerCycle + runningRockTotal,
    leftoverHeight,
    delta: 1514285714288 - runningHeightTotal,
  });
  return runningHeightTotal;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || ""), 1500));
  console.log(`Part 1.5:`, part2(data(process.argv[2] || ""), 1500));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  bin,
  canBePushed,
  canMerge,
  data,
  merge,
  part1,
  part2,
};
