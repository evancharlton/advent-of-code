const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    // test for simple data
    // expect(part1([])).toEqual(undefined);

    // test for test data
    expect(part1(data("test"))).toEqual(15);

    // test for real data
    expect(part1(data())).toEqual(633);
  });

  test("Part 2", () => {
    // test for simple data
    // expect(part2([])).toEqual(undefined);

    // test for test data
    expect(part2(data("test"))).toEqual(1134);

    // test for real data
    expect(part2(data())).toEqual(PROD);
  });
});
