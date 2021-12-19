const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test.only("Part 1", () => {
    // test for test data
    expect(part1(data("2d"))).toEqual(3);
    expect(part1(data("rotations"))).toEqual(6);

    // test for real data
    expect(part1(data("test"))).toEqual(79);
    expect(part1(data())).toEqual(365);
  });

  test("Part 2", () => {
    // test for test data
    expect(part2(data("test"))).toEqual(3621);

    // test for real data
    expect(part2(data())).toEqual(PROD);
  });
});
