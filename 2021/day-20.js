const ogLog = console.log;
console.log = (...args) => {
  if (process.env.NODE_ENV !== "test") {
    ogLog(...args);
  }
};

const data = (type = "") => {
  const [algorithm, image] = require("./input")(__filename, "\n\n", type);
  const imageArray = image.split("\n").map((line) => line.split(""));

  const imageMap = {};
  for (let y = 0; y < imageArray.length; y += 1) {
    for (let x = 0; x < imageArray[y].length; x += 1) {
      imageMap[`${x},${y}`] = imageArray[y][x];
    }
  }

  return {
    algorithm,
    image: imageMap,
    dimensions: [imageArray[0].length, imageArray.length],
  };
};

const k = (x, y) => `${x},${y}`;

const xy = (k) => k.split(",").map((v) => +v);

const getPixelString = (image, x, y, fallback) => {
  return [
    k(x - 1, y - 1),
    k(x, y - 1),
    k(x + 1, y - 1),
    k(x - 1, y),
    k(x, y),
    k(x + 1, y),
    k(x - 1, y + 1),
    k(x, y + 1),
    k(x + 1, y + 1),
  ]
    .map((key) => image[key] ?? fallback)
    .join("");
};

const MAPPING = {
  "#": 1,
  ".": 0,
};

const toBits = (pixelString) =>
  pixelString
    .split("")
    .map((c) => MAPPING[c])
    .join("");

const getBounds = (image) =>
  Object.keys(image)
    .map(xy)
    .reduce(
      ([minX, maxX, minY, maxY], [x, y]) => {
        return [
          Math.min(minX, x),
          Math.max(maxX, x),
          Math.min(minY, y),
          Math.max(maxY, y),
        ];
      },
      [
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
      ]
    );

const print = (image) => {
  const [minX, maxX, minY, maxY] = getBounds(image);

  let out = "";
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      out += image[k(x, y)];
    }
    out += "\n";
  }
  return out;
};

const part1 = ({ algorithm, image }, loops = 2) => {
  let workspace = { ...image };

  const margin = 10;

  for (let l = 0; l < loops; l += 1) {
    console.log(`Iteration ${l}`);
    console.log(print(workspace));
    const [minX, maxX, minY, maxY] = getBounds(image);
    const next = {};
    for (let y = minY - margin; y <= maxY + margin; y += 1) {
      for (let x = minX - margin; x <= maxX + margin; x += 1) {
        console.log(`${x},${y}:`);
        const pixelString = getPixelString(
          workspace,
          x,
          y,
          l % 2 === 0 ? "." : "#"
        );
        console.log(`  pixelString: ${pixelString}`);
        const bits = toBits(pixelString);
        console.log(`  bits: ${bits}`);
        const offset = Number.parseInt(bits, 2);
        console.log(`  offset: ${offset}`);
        const output = algorithm[offset];
        console.log(`  output: ${output}`);
        next[k(x, y)] = output;
      }
    }
    console.log(`Iteration ${l + 1}`);
    console.log(print(next));
    workspace = next;
  }

  const [minX, maxX, minY, maxY] = getBounds(workspace);
  for (let x = minX; x <= maxX; x += 1) {
    workspace[k(x, minY)] = "?";
    workspace[k(x, maxY)] = "?";
  }

  for (let y = minY; y <= maxY; y += 1) {
    workspace[k(minX, y)] = "?";
    workspace[k(maxX, y)] = "?";
  }
  console.log(`Final `);
  console.log(print(workspace));

  return Object.values(workspace).filter((v) => v === "#").length;
};

const part2 = (data) => {
  return data;
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || ""), 2));
  // console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
};
