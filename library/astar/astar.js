const pq = require("./pq");
const getPath = require("./getPath");

const astar = ({ neighbors: getNeighbors, cost, start, goal, h }) => {
  const queue = pq(start);
  const cameFrom = new Map();

  const gScore = new Map(); // ?? Number.MAX_SAFE_INTEGER
  const g = (key) => gScore.get(key) ?? Number.MAX_SAFE_INTEGER;
  gScore.set(start, 0);

  const fScore = new Map(); // ?? Number.MAX_SAFE_INTEGER
  const f = (key) => fScore.get(key) ?? Number.MAX_SAFE_INTEGER;
  fScore.set(start, h(start));

  while (queue.length() > 0) {
    const current = queue.take();
    if (goal(current, () => getPath(cameFrom, current))) {
      return getPath(cameFrom, current);
    }

    const neighbors = getNeighbors(current);
    for (let i = 0; i < neighbors.length; i += 1) {
      const neighbor = neighbors[i];
      const tentativeScore = g(current) + cost(neighbor);
      if (tentativeScore < g(neighbor)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeScore);
        fScore.set(neighbor, tentativeScore + h(neighbor));
        queue.put(neighbor, f(neighbor));
      }
    }
  }

  console.debug(cameFrom);
  throw new Error(`No path found: astar(${start}, ${goal})`);
};

module.exports = astar;
