const readLines = require("../read-input");

const SYMBOLS = {
  R: ">",
  L: "<",
  U: "v",
  D: "^",
  X: "X"
};

const walk = (wire, grid, onIntersection) => {
  const newGrid = { ...grid };
  let x = 0;
  let y = 0;
  let steps = 1;
  wire.forEach(instruction => {
    const distance = +instruction.substr(1);
    let deltaX = 0;
    let deltaY = 0;
    const direction = instruction.substr(0, 1);
    switch (direction) {
      case "R":
        deltaX = 1;
        break;
      case "L":
        deltaX = -1;
        break;
      case "U":
        deltaY = 1;
        break;
      case "D":
        deltaY = -1;
        break;
    }

    for (let i = 1; i <= distance; i += 1) {
      const key = `${x + deltaX * i},${y + deltaY * i}`;
      if (newGrid[key]) {
        onIntersection(x + deltaX * i, y + deltaY * i);
        newGrid[key] = { char: "X", steps: newGrid[key].steps + steps };
      } else {
        newGrid[key] = {
          char: SYMBOLS[direction],
          steps
        };
      }
      steps += 1;
    }

    x += deltaX * distance;
    y += deltaY * distance;
  });
  return newGrid;
};

const findIntersections = ([wire1, wire2]) => {
  const grid = { "0,0": { char: "O" } };
  const intersections = [];
  const wire1Grid = walk(wire1, grid, (x, y) => {
    console.log("intersection @", x, y);
  });
  const wire2Grid = walk(wire2, wire1Grid, (x, y) => {
    intersections.push({ x, y });
  });
  return [wire2Grid, intersections];
};

const toWires = ([wire1, wire2]) => {
  return [wire1.split(","), wire2.split(",")];
};

const printGrid = grid => {
  const bounds = Object.keys(grid).reduce(
    ({ minX, maxX, minY, maxY }, key) => {
      const [x, y] = key.split(",").map(Number);
      return {
        minX: Math.min(minX, x),
        maxX: Math.max(maxX, x),
        minY: Math.min(minY, y),
        maxY: Math.max(maxY, y)
      };
    },
    {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0
    }
  );

  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const arrayGrid = new Array(height);
  for (let i = 0; i <= height; i += 1) {
    const row = [];
    for (let j = 0; j <= width; j += 1) {
      row.push(" ");
    }
    arrayGrid[i] = row;
  }

  Object.keys(grid).forEach(xy => {
    const [x, y] = xy.split(",").map(Number);
    const row = y + Math.abs(bounds.minY);
    const col = x + Math.abs(bounds.minX);
    const { char } = grid[xy];
    arrayGrid[row][col] = char;
  });

  const string = arrayGrid
    .map(row => {
      return row.join("");
    })
    .join("\n");
  return string;
};

const manhattanDistance = ({ x, y }) => {
  return Math.abs(x) + Math.abs(y);
};

readLines("./day-3/input")
  // Promise.resolve([
  //   "R75,D30,R83,U83,L12,D49,R71,U7,L72",
  //   "U62,R66,U55,R34,D71,R55,D58,R83"
  // ])
  // Promise.resolve(["R5,D3", "D2,R2,U5"])
  .then(toWires)
  .then(findIntersections)
  .then(input => {
    const [grid, intersections] = input;
    const [closest] = intersections
      .map(({ x, y }) => {
        return grid[`${x},${y}`].steps;
      })
      .sort((a, b) => a - b);
    console.log("Closest intersection @", closest);
    return printGrid(grid);
  })
  .then(output => {
    const fs = require("fs");
    fs.writeFileSync("./output", output);
    process.exit(0);
  })
  .catch(ex => {
    console.error(ex);
    process.exit(1);
  });
