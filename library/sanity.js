const sanity = (limit, msg = "") => {
  let remaining = limit;
  return (localMsg = "") => {
    if (remaining-- <= 0) {
      throw new Error(
        `Limit reached after ${limit} iterations! ${localMsg || msg}`.trim()
      );
    }
  };
};

module.exports = { sanity };
