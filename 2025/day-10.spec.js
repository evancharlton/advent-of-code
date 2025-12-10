const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 7;
    const VALUE = 432;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);
    expect(part1(data("problems"))).toBeGreaterThan(0);

    // test for real data
    const res = part1(data());
    expect(res).toBeLessThan(476);
    expect(res).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = undefined;
    const VALUE = undefined;

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
