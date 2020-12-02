const readLines = require("../read-input");

const TEST = null;

const degreesTo = (x, y) => {
  if (x === 0 && y === 0) {
    throw new Error("Overlapping");
  }
  // Note that I intentionally flip X and Y here. This is because we want to:
  //   a) start from the Y axis
  //   b) rotate clockwise, instead of counter-clockwise
  let degrees = Math.atan2(x, -y); // radians
  degrees *= 180 / Math.PI; // degrees
  // I can't figure out why these specific examples fall apart. Whatever, I'll
  // just special-case them.
  if (degrees === 0 || degrees === 180) {
    degrees += 180;
  }
  if (degrees < 0) {
    degrees += 360;
  }
  degrees %= 360;
  return degrees.toFixed(3);
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
        const stringified = degreesTo(dx, dy);
        const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        const newItems = [
          ...(slopeLookup[stringified] || []),
          { ...asteroid, distance }
        ];
        newItems.sort((a, b) => {
          return a.distance - b.distance;
        });
        slopeLookup[stringified] = newItems;
      });
      return {
        id,
        x,
        y,
        others: slopeLookup
      };
    });
    return {
      map,
      total,
      asteroids: withCounts
    };
  })
  .then(({ map, total, asteroids }) => {
    return asteroids;
  })
  .then(asteroids => {
    return asteroids.sort((a, b) => {
      return Object.keys(b.others).length - Object.keys(a.others).length;
    })[0];
  })
  .then(best => {
    const angles = Object.keys(best.others).sort((a, b) => {
      return Number(a) - Number(b);
    });
    const lasered = [];
    let iter = angles.reduce((acc, angle) => {
      return [...acc, best.others[angle]];
    }, []);
    while (iter.length > 0) {
      const item = iter.shift();
      lasered.push(item.shift());
      if (item.length > 0) {
        iter.push(item);
      }
    }
    return lasered;
  })
  .then(lasered => {
    if (lasered.length < 200) {
      return;
    }
    const item = lasered[199];
    console.log(`200th item: ${item.x * 100 + item.y}`);
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
