const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    // test for test data
    expect(part1(data("test"))).toEqual(142);

    // test for real data
    expect(part1(data())).toEqual(55538);
  });

  test("Part 2", () => {
    // test for test data
    expect(part2(data("test-2"))).toEqual(281);

    // test for real data
    expect(part2(data())).toEqual(54875);
  });
});
