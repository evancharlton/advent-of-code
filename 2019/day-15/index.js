const readLines = require("../read-input");

const tick = map => {
  const oxygenCoords = [];
  const newMap = [];
  for (let y = 0; y < map.length; y += 1) {
    const row = map[y];
    const newRow = [];
    for (let x = 0; x < row.length; x += 1) {
      if (map[y][x] === "O") {
        oxygenCoords.push({ x, y });
      }
      newRow.push(map[y][x]);
    }
    newMap.push(newRow);
  }

  // Now we know where all the oxygen is. Do another pass and grow the oxygen.
  oxygenCoords.forEach(({ x, y }) => {
    if (newMap[y][x + 1] === ".") {
      newMap[y][x + 1] = "O";
    }
    if (newMap[y][x - 1] === ".") {
      newMap[y][x - 1] = "O";
    }
    if ((newMap[y + 1] || [])[x] === ".") {
      newMap[y + 1][x] = "O";
    }
    if ((newMap[y - 1] || [])[x] === ".") {
      newMap[y - 1][x] = "O";
    }
  });
  return newMap;
};

const allOxygen = map => {
  return map.every(row => {
    return row.every(c => c !== ".");
  });
};

readLines("./day-15/map")
  .then(map => {
    return map.map(row => {
      return row.split("").filter(c => c !== " ");
    });
  })
  .then(map => {
    let m = map;
    let ticks = 0;
    while (true) {
      m = tick(m);
      ticks += 1;
      if (allOxygen(m)) {
        return ticks;
      }
    }
  })
  // .then(map => {
  //   return map
  //     .map(row => {
  //       return row.join(" ");
  //     })
  //     .join("\n");
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
