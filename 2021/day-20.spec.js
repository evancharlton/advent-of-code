const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    // test for test data
    expect(part1(data("test"))).toEqual(35);

    // test for real data
    expect(part1(data())).not.toEqual(5704);
    expect(part1(data())).not.toEqual(10184);
    expect(part1(data())).not.toEqual(5521);
    expect(part1(data())).toEqual(5498);
  });

  test("Part 2", () => {
    // test for test data
    expect(part2(data("test"))).toEqual(3351);

    // test for real data
    expect(part2(data())).toEqual(16014);
  });
});
