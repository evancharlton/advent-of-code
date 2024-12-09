const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 1928;
    const VALUE = 6519155389266;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    const res = part1(data());
    expect(res).not.toEqual(10539393680608);
    expect(res).not.toEqual(6520497575151);
    expect(res).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = 2858;
    const VALUE = 6547228115826;

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
