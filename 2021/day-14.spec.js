const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, parse } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    // test for test data
    // expect(part1(data("test"), 1)).toEqual("NCNBCHB");
    expect(part1(data("test"), 10)).toEqual(1588);

    // test for real data
    expect(part1(data(), 10)).toEqual(3411);
  });

  test.skip("Part 2", () => {
    // test for simple data
    // expect(part2([])).toEqual(undefined);

    // test for test data
    expect(part2(data("test"))).toEqual(TEST);

    // test for real data
    expect(part2(data())).toEqual(PROD);
  });
});
