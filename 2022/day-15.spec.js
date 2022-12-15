const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 26;
    const VALUE = 4951427;

    // test for test data
    expect(part1(data("test"), 10)).toEqual(TEST_VALUE);

    // test for real data
    // expect(part1(data(), 2000000)).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = 56000011;
    const VALUE = 13029714573243;

    // test for test data
    expect(part2(data("test"), 20)).toEqual(TEST_VALUE);

    // test for real data
    expect(part2(data(), 4_000_000)).toEqual(VALUE);
  });
});
