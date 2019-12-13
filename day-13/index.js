const readLines = require("../read-input");
const intcode = require("../intcode");

readLines("./day-13/input")
  .then(async ([program]) => {
    const tiles = {};
    let score = 0;
    const tile = {
      left: undefined,
      top: undefined,
      tileId: undefined
    };
    const ball = {
      left: undefined,
      top: undefined
    };
    const paddle = {
      left: undefined,
      top: undefined
    };
    await intcode(
      // Free games!
      `2,${program.substr(program.indexOf(",") + 1)}`,
      () => {
        if (
          ball.left === undefined ||
          paddle.left === undefined ||
          ball.left === paddle.left
        ) {
          return 0;
        }
        if (ball.left > paddle.left) {
          return 1;
        }
        return -1;
      },
      out => {
        if (tile.left === undefined) {
          tile.left = out;
        } else if (tile.top === undefined) {
          tile.top = out;
        } else if (tile.tileId === undefined) {
          tile.tileId = out;
        } else {
          throw new Error("Unknown state");
        }

        if (tile.tileId !== undefined) {
          // Flush the tile
          if (tile.left === -1 && tile.top === 0) {
            score = tile.tileId;
          } else if (tile.tileId !== 0) {
            tiles[`${tile.left},${tile.top}`] = tile.tileId;
          }

          if (tile.tileId === 3) {
            paddle.left = tile.left;
            paddle.top = tile.top;
          } else if (tile.tileId === 4) {
            ball.left = tile.left;
            ball.top = tile.top;
          }
          tile.left = undefined;
          tile.top = undefined;
          tile.tileId = undefined;
        }
      }
    );
    return score;
  })
  .then(output => {
    if (output !== undefined) {
      if (Array.isArray(output) || typeof output === "object") {
        console.log(JSON.stringify(output, null, 2));
      } else {
        console.log(output);
      }
    }
    process.exit(0);
  })
  .catch(ex => {
    console.error(ex);
    process.exit(1);
  });
