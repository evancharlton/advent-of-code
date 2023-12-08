const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 2;
    const VALUE = 12737;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);
    expect(part1(data("test-2"))).toEqual(6);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = 6;
    const VALUE = 9064949303801;

    // test for test data
    expect(part2(data("test-3"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
