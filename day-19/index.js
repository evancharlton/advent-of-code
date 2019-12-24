const readLines = require("../read-input");
const intcode = require("../intcode");

readLines("./day-19/input")
  .then(async ([program]) => {
    const outputs = [];
    const [X, Y] = [50, 50];
    for (let y = 0; y < Y; y += 1) {
      outputs.push([]);
      for (let x = 0; x < X; x += 1) {
        outputs[y][x] = 0;
        const inputs = [x, y];
        await intcode(
          program,
          () => {
            return inputs.shift();
          },
          out => {
            outputs[y][x] = out;
          }
        );
      }
    }
    return outputs;
  })
  .then(outs => {
    return outs
      .reduce((acc, row) => {
        return [...acc, ...row];
      }, [])
      .filter(v => v !== 0).length;
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
