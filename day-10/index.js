const readLines = require("../read-input");

const SIMPLE_TEST = [".#..#", ".....", "#####", "....#", "...##"];

const LARGER_TEST = [
  "......#.#.",
  "#..#.#....",
  "..#######.",
  ".#.#.###..",
  ".#..#.....",
  "..#....#.#",
  "#..#....#.",
  ".##.#..###",
  "##...#..#.",
  ".#....####"
];

const TEST = null;

const printableMap = map => {
  return map
    .reduce((acc, row) => {
      return [...acc, row.map(v => v || "·").join(" ")];
    }, [])
    .join("\n");
};

readLines("./day-10/input", TEST)
  .then(map => {
    return map.reduce((rows, row) => {
      return [...rows, row.split("")];
    }, []);
  })
  .then(map => {
    return {
      map,
      total: map.reduce((total, row) => {
        return total + row.filter(cell => cell === "#").length;
      }, 0)
    };
  })
  .then(({ map, total }) => {
    // Now go through each cell and keep track of how many asteroids are in
    // each cardinal direction from it.
    const asteroids = [];
    for (let y = 0; y < map.length; y += 1) {
      for (let x = 0; x < map[0].length; x += 1) {
        if (map[y][x] !== "#") {
          continue;
        }
        asteroids.push({
          id: asteroids.length,
          x,
          y
        });
      }
    }
    return {
      map,
      total,
      asteroids
    };
  })
  .then(({ map, total, asteroids }) => {
    const withCounts = asteroids.map(({ id, x, y }) => {
      const slopeLookup = {};
      // Loop over all of the other asteroids and get the slope to each one.
      asteroids.forEach(asteroid => {
        if (asteroid.id === id) {
          // yo dawg
          return;
        }
        const dx = asteroid.x - x;
        const dy = asteroid.y - y;
        const stringified = `(${Math.abs((dx / dy).toFixed(5))}|${
          dx > 0 ? "+" : "-"
        }|${dy > 0 ? "+" : "-"})`;
        slopeLookup[stringified] = (slopeLookup[stringified] || 0) + 1;
      });
      return {
        id,
        x,
        y,
        count: Object.keys(slopeLookup).length
      };
    });
    return {
      map,
      total,
      asteroids: withCounts
    };
  })
  .then(({ map, total, asteroids }) => {
    console.log(`Total asteroids: ${total}`);
    console.log("-----");
    console.log(asteroids);
    console.log("-----");
    console.log(printableMap(map));
    return asteroids;
  })
  .then(asteroids => {
    return asteroids.sort((a, b) => {
      return b.count - a.count;
    })[0];
  })
  .then(best => {
    console.log(`Best is at ${best.x},${best.y} with ${best.count} detected`);
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
