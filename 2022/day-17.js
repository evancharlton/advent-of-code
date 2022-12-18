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
  [0b0001000, 0b0011100, 0b0001000],
  // L
  [0b0000100, 0b0000100, 0b0011100],
  // column
  [0b0010000, 0b0010000, 0b0010000, 0b0010000],
  // square
  [0b0011000, 0b0011000],
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
  (jets, prune = Number.MAX_SAFE_INTEGER) =>
  (count = 2022, initialBoard = []) => {
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
    for (let i = 0; i < count; i += 1) {
      if (false) {
        const key = `${rockIndex % ROCKS.length} / ${
          insIndex % jets.length
        } / ${board.slice(0, 10).map(bin).join(",")}`;
        if (cache.has(key)) {
          console.debug(cache);
          console.debug(key);
          throw new Error(
            `yay @ ${i} prev: ${cache.get(key)}\t${i - cache.get(key)}`
          );
        }
        cache.set(key, i);
      }
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
      }
    }
    VERBOSE && debug(print(board));

    return { height: board.length - initialBoard.length, board };
  };

const part1 = (jets, count = 2022) => {
  const sim = simulator(jets);
  return sim(count).height;
};

const part2 = (jets, count = 2022) => {
  const sim = simulator(jets);

  const { board } = sim(count);

  // const start = sim(24);
  // const loop = sim(53, start.board);
  // const times = Math.floor(count / 53);
  // const leftovers = sim(count - (53 * Math.floor(count / 53) + 24), loop.board);
  // return [times, start.height, loop.height, leftovers.height];
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  // console.log(`Part 2:`, part2(data(process.argv[2] || "")));
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
