const data = (type = "") => {
  return require("./input")(__filename, "\n", type).filter(Boolean);
};

const part1 = (lines, x = 0, y = 0, f = "E") => {
  let id = 0;
  const beams = [{ x, y, f, id }];
  const cells = new Map();
  let z = 0;
  while (beams.length > 0 && z++ < 100_000) {
    const beam = beams.shift();

    const key = `${beam.x},${beam.y}`;
    if (!cells.has(key)) {
      cells.set(key, new Set());
    }
    const paths = cells.get(key);
    if (paths.has(beam.f)) {
      // We've already been here, going this same direction, then bail.
      // We know how this story ends.
      continue;
    }

    paths.add(beam.f);

    const cell = lines[beam.y][beam.x];

    if (
      cell === "." ||
      (cell === "-" && (beam.f === "E" || beam.f === "W")) ||
      (cell === "|" && (beam.f === "N" || beam.f === "S"))
    ) {
      beam.x += { E: 1, W: -1, N: 0, S: 0 }[beam.f];
      beam.y += { E: 0, W: 0, N: -1, S: 1 }[beam.f];
    } else if (
      (cell === "\\" && beam.f === "W") ||
      (cell === "/" && beam.f === "E")
    ) {
      beam.f = "N";
      beam.y -= 1;
    } else if (
      (cell === "\\" && beam.f === "S") ||
      (cell === "/" && beam.f === "N")
    ) {
      beam.f = "E";
      beam.x += 1;
    } else if (
      (cell === "\\" && beam.f === "N") ||
      (cell === "/" && beam.f === "S")
    ) {
      beam.f = "W";
      beam.x -= 1;
    } else if (
      (cell === "\\" && beam.f === "E") ||
      (cell === "/" && beam.f === "W")
    ) {
      beam.f = "S";
      beam.y += 1;
    } else if (cell === "|" && (beam.f === "E" || beam.f === "W")) {
      if (beam.y < lines.length - 1) {
        beams.push({
          x: beam.x,
          y: beam.y + 1,
          f: "S",
          id: ++id,
        });
      }
      beam.f = "N";
      beam.y -= 1;
    } else if (cell === "-" && (beam.f === "N" || beam.f === "S")) {
      if (beam.x < lines[0].length - 1) {
        beams.push({
          x: beam.x + 1,
          y: beam.y,
          f: "E",
          id: ++id,
        });
      }
      beam.f = "W";
      beam.x -= 1;
    } else {
      throw new Error("Impossible?");
    }

    if (
      beam.x >= 0 &&
      beam.x < lines[0].length &&
      beam.y >= 0 &&
      beam.y < lines.length
    ) {
      beams.push(beam);
    }
  }

  return cells.size;
};

const part2 = (lines) => {
  const outputs = [];

  for (let y = 0; y < lines.length; y += 1) {
    outputs.push(
      part1(lines, 0, y, "E"),
      part1(lines, lines[0].length - 1, y, "W")
    );
  }

  for (let x = 0; x < lines[0].length; x += 1) {
    outputs.push(
      part1(lines, x, 0, "S"),
      part1(lines, x, lines.length - 1, "N")
    );
  }

  return Math.max(...outputs);
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
