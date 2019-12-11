const readLines = require("../read-input");
const intcode = require("../intcode");
const fs = require("fs");

const TEST = null;

const c = color => {
  return color ? "white" : "black";
};

readLines("./day-11/input", TEST)
  .then(([program]) => {
    const grid = {};

    const position = {
      x: 0,
      y: 0
    };

    const oldPosition = {
      x: 0,
      y: 0
    };

    let outputCount = 0;
    let direction = "up";
    const paintedPanels = {};

    const xy = ({ x, y }) => {
      return `${x},${y}`;
    };

    return intcode(
      program,
      () => {
        return new Promise(resolve => {
          (function getValue() {
            if (position.x !== undefined && position.y !== undefined) {
              const color = grid[xy(position)] || 0;
              console.log("<=", xy(position), "is", c(color));
              oldPosition.x = position.x;
              oldPosition.y = position.y;
              position.x = undefined;
              position.y = undefined;
              resolve(color);
              return;
            }
            setTimeout(getValue, 1);
          })();
        });
      },
      out => {
        if (outputCount % 2 === 0) {
          // Paint
          if ((grid[xy(oldPosition)] || 0) !== out) {
            console.log("=>", `paint ${c(grid[xy(oldPosition)])} to ${c(out)}`);
          } else {
            console.log(
              "=>",
              `no need to paint -- ${xy(oldPosition)} is already ${c(out)}`
            );
          }
          grid[xy(oldPosition)] = out;
          paintedPanels[xy(oldPosition)] =
            (paintedPanels[xy(oldPosition)] || 0) + 1;
        } else {
          const oldDirection = direction;
          position.x = oldPosition.x;
          position.y = oldPosition.y;
          switch (oldDirection) {
            case "up": {
              if (out === 0) {
                // left
                direction = "left";
                position.x -= 1;
              } else {
                // right
                direction = "right";
                position.x += 1;
              }
              break;
            }

            case "left": {
              if (out === 0) {
                // left
                direction = "down";
                position.y += 1;
              } else {
                // right
                direction = "up";
                position.y -= 1;
              }
              break;
            }

            case "down": {
              if (out === 0) {
                // left
                direction = "right";
                position.x += 1;
              } else {
                // right
                direction = "left";
                position.x -= 1;
              }
              break;
            }

            case "right": {
              if (out === 0) {
                // left
                direction = "up";
                position.y -= 1;
              } else {
                // right
                direction = "down";
                position.y += 1;
              }
              break;
            }
          }

          console.log(
            "=>",
            `turn ${
              out === 0 ? "left" : "right"
            } (${oldDirection} -> ${direction})`
          );

          console.log("   moved", direction);
        }

        outputCount += 1;
      }
    )
      .then(() => {
        console.error("unique panels:", Object.keys(paintedPanels).length);
        console.error(
          "paint ops:",
          Object.keys(paintedPanels).reduce(
            (total, xy) => total + paintedPanels[xy],
            0
          )
        );
        return grid;
      })
      .catch(ex => {
        console.error(position, direction, outputCount);
        throw ex;
      });
  })
  // .then(grid => {
  //   const width = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
  //   const height = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
  //   Object.keys(grid).forEach(xy => {
  //     const [x, y] = xy.split(",");
  //     width[0] = Math.min(x, width[0]);
  //     width[1] = Math.max(x, width[1]);
  //     height[0] = Math.min(y, height[0]);
  //     height[1] = Math.max(y, height[1]);
  //   });

  //   console.log(width, height);

  //   const dx = width[1] - width[0];
  //   const dy = height[1] - height[0];

  //   const output = [];
  //   for (let y = 0; y < dy + 1; y += 1) {
  //     output.push([]);
  //     for (let x = 0; x < dx + 1; x += 1) {
  //       output[y].push(" ");
  //     }
  //   }

  //   console.log(`width: ${dx}\theight:${dy}`);

  //   Object.keys(grid).forEach(xy => {
  //     const [x, y] = xy.split(",");
  //     const row = y - height[0];
  //     const col = x - width[0];
  //     try {
  //       output[row][col] = grid[xy];
  //     } catch (ex) {
  //       console.error(x, "-", width[0], "=", col);
  //       console.error(y, "-", height[0], "=", row);
  //       throw ex;
  //     }
  //   });
  //   return output;
  // })
  // .then(grid => {
  //   return grid.map(row => row.join(" ")).join("\n");
  // })
  // .then(str => {
  //   fs.writeFileSync("./output", str);
  // })
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
