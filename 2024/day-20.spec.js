const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const VALUE = undefined;

    // test for test data
    expect(part1(data("test"), 64)).toEqual(1);

    // test for real data
    // expect(part1(data())).not.toEqual(1416);
    // expect(part1(data())).toEqual(1441);
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
