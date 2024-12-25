const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 3;
    const VALUE = 3155;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });
});
