const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    // test for test data
    expect(part1(data("test"), 10)).toEqual(1588);

    // test for real data
    expect(part1(data(), 10)).toEqual(3411);
  });

  test("Part 2", () => {
    // test for test data
    expect(part2(data("test"), 40)).toEqual(2188189693529);

    // test for real data
    expect(part2(data(), 40)).toEqual(7477815755570);
  });
});
