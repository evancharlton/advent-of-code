const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true });
};

const part1 = (lines) => {
  const antennas = {};

  for (let y = 0; y < lines.length; y += 1) {
    for (let x = 0; x < lines[y].length; x += 1) {
      const cell = lines[y][x];
      if (cell === ".") {
        continue;
      }
      antennas[cell] = antennas[cell] ?? [];
      antennas[cell].push({ x, y, cell });
    }
  }

  const antinodes = {};

  Object.values(antennas).forEach((antennas) => {
    antennas.forEach((coords, n, data) => {
      // Compare each antenna with its peers. The peer will be the one twice as
      // far away and we'll see if the antinode falls within the bounds.
      for (let i = 0; i < data.length; i += 1) {
        if (i === n) {
          continue;
        }

        const dx = data[i].x - coords.x;
        const dy = data[i].y - coords.y;
        const x = coords.x - dx;
        const y = coords.y - dy;

        if (!lines[y]?.[x]) {
          // This is off the map.
          continue;
        }

        const key = `${x},${y}`;
        if (antinodes[key]) {
          antinodes[key].push(coords.cell);
          continue;
        }
        antinodes[key] = [coords.cell];
      }
    });
  });

  return Object.keys(antinodes).length;
};

const part2 = (lines) => {
  const antennas = {};
  const antinodes = {};

  for (let y = 0; y < lines.length; y += 1) {
    for (let x = 0; x < lines[y].length; x += 1) {
      const cell = lines[y][x];
      if (cell === ".") {
        continue;
      }
      antennas[cell] = antennas[cell] ?? [];
      antennas[cell].push({ x, y, cell });
      const key = `${x},${y}`;
      antinodes[key] = antinodes[key] || [];
      antinodes[key].push(`(${cell})`);
    }
  }

  Object.values(antennas).forEach((antennas) => {
    antennas.forEach((coords, n, data) => {
      // Compare each antenna with its peers. The peer will be the one twice as
      // far away and we'll see if the antinode falls within the bounds.
      for (let i = 0; i < data.length; i += 1) {
        if (i === n) {
          continue;
        }

        const dx = data[i].x - coords.x;
        const dy = data[i].y - coords.y;
        const slope = dy / dx;

        const f = (x1) => coords.y - slope * (coords.x - x1);

        for (let x = 0; x < lines[0].length; x += 1) {
          const y = f(x);
          if (!lines[y]) {
            continue;
          }

          const key = `${x},${y}`;
          if (antinodes[key]) {
            antinodes[key].push(coords.cell);
            continue;
          }
          antinodes[key] = [coords.cell];
        }
      }
    });
  });

  return Object.keys(antinodes).length;
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
