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

const getPixelString = (image, x, y, infinitePixel) => {
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
    .map((key) => image[key] ?? infinitePixel)
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
      out += image[k(x, y)] + " ";
    }
    out += "\n";
  }
  return out;
};

const part1 = (input) => {
  return enhance(input, 2);
};

const enhance = ({ algorithm, image }, loops = 2) => {
  let workspace = { ...image };

  const margin = 1;

  for (let l = 0; l < loops; l += 1) {
    const [minX, maxX, minY, maxY] = getBounds(workspace);
    const next = {};
    for (let y = minY - margin; y <= maxY + margin; y += 1) {
      for (let x = minX - margin; x <= maxX + margin; x += 1) {
        const pixelString = getPixelString(
          workspace,
          x,
          y,
          l % 2 === 0 ? "." : algorithm[0]
        );
        const bits = toBits(pixelString);
        const offset = Number.parseInt(bits, 2);
        const output = algorithm[offset];
        next[k(x, y)] = output;
      }
    }
    workspace = next;
  }

  return Object.values(workspace).filter((v) => v === "#").length;
};

const part2 = (data) => {
  return enhance(data, 50);
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
};
