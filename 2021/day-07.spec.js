const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, fuelCost } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    // test for simple data
    // expect(part1([])).toEqual(undefined);

    // test for test data
    expect(part1(data("test"))).toEqual(37);

    // test for real data
    expect(part1(data())).toEqual(357353);
  });

  test("Part 2", () => {
    // test for simple data
    // expect(part2([])).toEqual(undefined);

    // test for test data
    expect(part2(data("test"))).toEqual(168);

    // test for real data
    expect(part2(data())).toEqual(104822130);
  });

  test("fuelCost", () => {
    expect(fuelCost(16, 5)).toEqual(66);
  });
});
