const readLines = require("../read-input");
const intcode = require("../intcode");

readLines("./day-13/input")
  .then(async ([program]) => {
    const tiles = {};
    const tile = {
      left: undefined,
      top: undefined,
      tileId: undefined
    };
    await intcode(
      program,
      () => 0,
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
          if (tile.tileId !== 0) {
            tiles[`${tile.left},${tile.top}`] = tile.tileId;
          }
          tile.left = undefined;
          tile.top = undefined;
          tile.tileId = undefined;
        }
      }
    );
    return Object.keys(tiles)
      .map(k => tiles[k])
      .filter(tileId => tileId === 2).length;
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
