const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    // test for test data
    expect(part1(data("mini"))).toEqual(4);
    expect(part1(data("test"))).toEqual(2024);

    // test for real data
    expect(part1(data())).toEqual(51715173446832);
  });

  test("Part 2", () => {
    const TEST_VALUE = undefined;
    const VALUE = undefined;

    // test for test data
    // expect(part2(data("swap"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
