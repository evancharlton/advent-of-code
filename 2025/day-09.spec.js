const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 50;
    const VALUE = 4760959496;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test.skip("Part 2", () => {
    const TEST_VALUE = 24;
    const VALUE = 1343576598;

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    const v = part2(data());
    expect(v).toBeLessThan(4618516475);
    expect(v).toBeGreaterThan(93277);
    expect(v).toEqual(VALUE);
  });
});
