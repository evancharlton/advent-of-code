const sanity = (limit, msg = "") => {
  let remaining = limit;
  return (localMsg = "") => {
    remaining -= 1;
    if (remaining <= 0) {
      throw new Error(
        `Limit reached after ${limit} iterations! ${localMsg || msg}`.trim()
      );
    }
    return true
  };
};

module.exports = { sanity };
