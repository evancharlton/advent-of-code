const getPath = (cameFrom, current) => {
  let n = current;
  const out = [];
  while (n) {
    out.unshift(n);
    n = cameFrom.get(n);
  }
  return out;
};

module.exports = getPath;
