const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    // test for simple data
    // expect(part1([])).toEqual(undefined);

    // test for test data
    expect(part1(data("test"))).toEqual(4512);

    // test for real data
    expect(part1(data())).toEqual(34506);
  });

  test("Part 2", () => {
    // test for simple data
    // expect(part1([])).toEqual(undefined);

    // test for test data
    expect(part2(data("test"))).toEqual(1924);

    // test for real data
    expect(part2(data())).toEqual(7686);
  });
});
