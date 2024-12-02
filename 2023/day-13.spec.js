const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 405;
    const VALUE = 35210;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    const value = part1(data());
    expect(value).not.toEqual(32363);
    expect(value).not.toEqual(33646);
    expect(value).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = 400;
    const VALUE = 31974;

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});