const getPath = (cameFrom, current, length = Number.MAX_SAFE_INTEGER) => {
  let n = current;
  const out = [];
  while (n) {
    out.unshift(n);
    n = cameFrom.get(n);
    if (out.length >= length) {
      break;
    }
  }
  return out;
};

module.exports = getPath;
