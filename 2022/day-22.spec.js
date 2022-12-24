const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 6032;
    const VALUE = 30552;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = 5031;
    const VALUE = 184106;

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    const res = part2(data());
    expect(res).toBeGreaterThan(22258);
    expect(res).toBeGreaterThan(34262);
    expect(res).not.toBe(112188);
    expect(res).toEqual(VALUE);
  });
});
