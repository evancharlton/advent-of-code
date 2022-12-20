const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 3;
    const VALUE = 10763;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).toBeGreaterThan(9604);
    expect(part1(data())).not.toEqual(-13097);
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = 1623178306;
    const VALUE = 4979911042808;

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    const two = part2(data());
    expect(two).toBeGreaterThan(702836206498);
    expect(two).toEqual(VALUE);
  });
});
