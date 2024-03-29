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
    expect(part1(data("test"))).toEqual(5);

    // test for real data
    expect(part1(data())).toEqual(5698);
  });

  test("Part 2", () => {
    // test for simple data
    // expect(part1([])).toEqual(undefined);

    // test for test data
    expect(part2(data("test"))).toEqual(12);

    // test for real data
    expect(part2(data())).not.toEqual(15442);
    expect(part2(data())).toEqual(15463);
  });
});
