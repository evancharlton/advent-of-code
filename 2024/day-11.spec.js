const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 55312;
    const VALUE = 199986;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    expect(part2(data("test"), 6)).toEqual(22);
    expect(part2(data("test"), 25)).toEqual(55312);

    expect(part2(data())).toEqual(236804088748754);
  });
});
