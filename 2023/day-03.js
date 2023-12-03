const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type)
    .filter(Boolean)
    .map((line) => `.${line}.`);
  return [
    new Array(lines[0].length).fill(".").join(""),
    ...lines,
    new Array(lines[0].length).fill(".").join(""),
  ];
};

const NUMBERS = /([\d]+)/g;

const part1 = (lines) => {
  return lines
    .map((line, i, rows) => {
      if (i === 0 || i === rows.length - 1) {
        return [];
      }
      const matches = String(line).matchAll(NUMBERS);
      const numbers = [];
      for (const match of matches) {
        const value = match[0];
        const index = match.index;
        const prevLine = rows[i - 1];
        const nextLine = rows[i + 1];

        const isPartNumber = (() => {
          if (line[index - 1] !== "." || line[index + value.length] !== ".") {
            return true;
          }
          for (let x = index - 1; x <= index + value.length; x += 1) {
            if (prevLine[x] !== "." || nextLine[x] !== ".") {
              return true;
            }
          }
          return false;
        })();

        if (isPartNumber) {
          numbers.push(+value);
        }
      }
      return numbers;
    })
    .flat()
    .reduce((acc, v) => acc + v);
};

const part2 = (lines) => {
  const getNumber = (line, x, dir = "both") => {
    let start = x;
    let end = x + 1;

    if (dir === "left" || dir === "both") {
      for (let s = x; s >= 0; s -= 1) {
        // console.debug(`${line}[${x}]: -> ${line[s]}`);
        if (line[s] === ".") {
          start = s + 1;
          // console.debug(`  breaking @ ${s}`);
          break;
        }
      }
    }

    if (dir === "right" || dir === "both") {
      for (let e = x; e < line.length - 1; e += 1) {
        if (line[e] === ".") {
          end = e;
          break;
        }
      }
    }

    const out = String(line).substring(start, end);
    // console.debug(`  ${line}[${start} .. ${end}] -> ${out}`);
    return out;
  };

  return lines
    .reduce((gears, line, y, rows) => {
      if (y === 0 || y === rows.length - 1) {
        return gears;
      }

      for (let x = 1; x < line.length - 1; x += 1) {
        const symbol = line[x];

        if (symbol === "*") {
          const above = rows[y - 1];
          const below = rows[y + 1];

          const [tl, t, tr] = [above[x - 1], above[x], above[x + 1]].map(
            (v) => !Number.isNaN(+v)
          );
          const [l, r] = [line[x - 1], line[x + 1]].map(
            (v) => !Number.isNaN(+v)
          );
          const [bl, b, br] = [below[x - 1], below[x], below[x + 1]].map(
            (v) => !Number.isNaN(+v)
          );

          let numbers = [];
          let parts = 0;
          if (l) {
            parts += 1;
            numbers.push(getNumber(line, x - 1, "left"));
          }

          if (r) {
            parts += 1;
            numbers.push(getNumber(line, x + 1, "right"));
          }

          if (t) {
            // If we have a number above, then we don't need to check tl and tr
            // as it's impossible for those to be separate values.
            parts += 1;
            numbers.push(getNumber(above, x, "both"));
          } else {
            if (tr) {
              parts += 1;
              numbers.push(getNumber(above, x + 1, "right"));
            }
            if (tl) {
              parts += 1;
              numbers.push(getNumber(above, x - 1, "left"));
            }
          }

          if (b) {
            // Same logic as t
            parts += 1;
            numbers.push(getNumber(below, x, "both"));
          } else {
            if (br) {
              parts += 1;
              numbers.push(getNumber(below, x + 1, "right"));
            }
            if (bl) {
              parts += 1;
              numbers.push(getNumber(below, x - 1, "left"));
            }
          }

          if (parts === 2) {
            gears.push({
              x,
              y,
              numbers,
              ratio: numbers.reduce((acc, v) => acc * v),
            });
          }
        }
      }

      return gears;
    }, [])
    .map(({ ratio }) => ratio)
    .reduce((acc, v) => acc + v);
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
};
