const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, parseHex, parseBits } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    // test for test data
    expect(part1(data("test"))).toEqual(45);

    // test for real data
    expect(part1(data())).not.toEqual(435);
    expect(part1(data())).toEqual(4186);
  });

  test("Part 2", () => {
    // test for test data
    expect(part2(data("test"))).toEqual(TEST);

    // test for real data
    expect(part2(data())).toEqual(PROD);
  });
});
