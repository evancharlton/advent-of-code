const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 374;
    const VALUE = 9536038;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).not.toEqual(9380366);
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const VALUE = 447744640566;

    // test for test data
    expect(part2(data("test"), 10)).toEqual(1030);
    expect(part2(data("test"), 100)).toEqual(8410);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
