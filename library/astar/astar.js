const pq = require("./pq");
const getPath = require("./getPath");

/**
 *
 * @param {{
 *   neighbors: (T) => T[],
 *   weight: (neighbor: T, current: T, (max: number) => T[]) => number,
 *   start: T,
 *   goal: (T) => boolean,
 *   h: (T) => number,
 * }} args
 * @returns
 */
const astar = ({
  neighbors: getNeighbors,
  weight,
  start,
  goal,
  h,
  sanityCheck = () => true,
}) => {
  const queue = pq(start);
  const cameFrom = new Map();

  const gScore = new Map(); // ?? Number.MAX_SAFE_INTEGER
  const g = (key) => gScore.get(key) ?? Number.MAX_SAFE_INTEGER;
  gScore.set(start, 0);

  const fScore = new Map(); // ?? Number.MAX_SAFE_INTEGER
  const f = (key) => fScore.get(key) ?? Number.MAX_SAFE_INTEGER;
  fScore.set(start, h(start));

  while (queue.length() > 0 && sanityCheck()) {
    const current = queue.take();
    if (goal(current)) {
      return getPath(cameFrom, current);
    }

    const neighbors = getNeighbors(current);
    for (let i = 0; i < neighbors.length; i += 1) {
      const neighbor = neighbors[i];
      const tentativeScore =
        g(current) +
        weight(neighbor, current, (n) => getPath(cameFrom, current, n));
      if (tentativeScore < g(neighbor)) {
        cameFrom.set(neighbor, current);
        if (gScore.has(neighbor)) {
          throw new Error(`Cannot overwrite gScore[${neighbor}]!`);
        }
        gScore.set(neighbor, tentativeScore);
        if (fScore.has(neighbor)) {
          throw new Error(`Cannot overwrite fScore[${neighbor}]!`);
        }
        fScore.set(neighbor, tentativeScore + h(neighbor, current));
        queue.put(neighbor, f(neighbor));
      }
    }
  }

  throw new Error(`No path found: astar(..)`);
};

module.exports = astar;
