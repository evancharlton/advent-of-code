const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true }).map(line => {
    const [position, velocity] = line.split(' ');

    const [px, py] = position.replace(/p=/, '').split(',').map(v => +v)
    const [vx, vy] = velocity.replace(/v=/, '').split(',').map(v => +v)

    return {
      px, py, vx, vy
    }
  });
};

const part1 = (robots, { width: W, height: H, steps = 100 } = { width: 101, height: 103 }) => {
  const grid = {};


  for (const robot of robots) {
    const px = (((robot.px + (robot.vx * steps)) % W) + W) % W
    const py = (((robot.py + (robot.vy * steps)) % H) + H) % H
    const key = `${px},${py}`
    grid[key] = grid[key] ?? 0
    grid[key] += 1
  }

  // const output = [];
  // for (let h = 0; h < H; h += 1) {
  //   const row = [];
  //   for (let w = 0; w < W; w += 1) {
  //     const key = `${w},${h}`
  //     row.push(grid[key] ?? '.')
  //   }
  //   output.push(row.join(' '))
  // }

  // console.debug(`\n${output.join('\n')}`)

  const totals = [];
  const midX = Math.floor(W / 2)
  const midY = Math.floor(H / 2)
  Object.entries(grid).forEach(([key, robots]) => {
    const [x, y] = key.split(',').map(v => +v)
    let quadrant = 0;
    if (x < midX && y < midY) {
      quadrant = 1;
    } else if (x > midX && y < midY) {
      quadrant = 2;
    } else if (x < midX && y > midY) {
      quadrant = 3;
    } else if (x > midX && y > midY) {
      quadrant = 4
    }
    totals[quadrant] = (totals[quadrant] ?? 0) + robots;
  })

  return totals.slice(1).reduce((acc, v) => acc * v, 1);
};

const part2 = (lines) => {
  return undefined;
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
