const readLines = require("../read-input");
const intcode = require("../intcode");

const TEST = "";

const INTERSECTIONS = [401, 612, 500].reduce(
  (acc, n) => ({ ...acc, [n]: true }),
  {}
);

readLines("./day-17/input", TEST)
  .then(async ([program]) => {
    const outputs = [];
    await intcode(
      program,
      () => {
        return 0;
      },
      out => {
        outputs.push(out);
      }
    );
    return outputs.map(v => String.fromCharCode(+v));
  })
  .then(chars => {
    const width =
      chars.findIndex(v => {
        return v === "\n";
      }) + 1;
    const XYs = {};
    const glyphs = chars.map((v, i) => {
      if (
        chars[i] === "#" &&
        chars[i - 1] === "#" &&
        chars[i + 1] === "#" &&
        chars[i - width] === "#" &&
        chars[i + width] === "#"
      ) {
        const x = i % width;
        const y = Math.floor(i / width);
        XYs[`${x},${y}`] = x * y;
        return "O";
      }
      return v;
    });
    return { glyphs, XYs };
  })
  .then(({ glyphs, XYs }) => {
    const sum = Object.keys(XYs).reduce((acc, xy) => {
      return acc + XYs[xy];
    }, 0);
    console.log("Sum:", sum);
    return glyphs;
  })
  .then(chars => {
    return ` ${chars.join(" ")}`;
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
