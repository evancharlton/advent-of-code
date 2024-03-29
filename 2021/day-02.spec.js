const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    // test for simple data
    // expect(part1([])).toEqual(undefined);

    // test for test data
    expect(part1(data("test"))).toEqual(150);

    // test for real data
    expect(part1(data())).toEqual(1962940);
  });

  test("Part 2", () => {
    // test for simple data
    // expect(part1([])).toEqual(undefined);

    // test for test data
    expect(part2(data("test"))).toEqual(900);

    // test for real data
    expect(part2(data())).toEqual(1813664422);
  });
});
