const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 21;
    const VALUE = 1594;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = 40;
    const VALUE = 15650261281478;

    // test for test data
    expect(part2(data("mini"))).toEqual(2);
    expect(part2(data("merge"))).toEqual(4);
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
