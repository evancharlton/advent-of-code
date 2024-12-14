const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 12;
    const VALUE = 232589280;

    // test for test data
    expect(part1(data("test"), { width: 11, height: 7 })).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const VALUE = undefined;

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
