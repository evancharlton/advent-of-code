const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, findNumber } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    // test for simple data
    // expect(part1([])).toEqual(undefined);

    // test for test data
    expect(part1(data("test"))).toEqual(26);

    // test for real data
    expect(part1(data())).toEqual(479);
  });

  test("Part 2", () => {
    // test for simple data
    // expect(part2([])).toEqual(undefined);

    // test for test data
    expect(part2(data("test"))).toEqual(61229);

    // test for real data
    expect(part2(data())).toEqual(1041746);
  });

  test("findNumber", () => {
    const mapping = "deafgbc";

    expect(findNumber(mapping, "ab")).toEqual(1);
    expect(findNumber(mapping, "eafb")).toEqual(4);
    expect(findNumber(mapping, "dab")).toEqual(7);
    expect(findNumber(mapping, "acedgfb")).toEqual(8);

    expect(findNumber(mapping, "cagedb")).toEqual(0);
    expect(findNumber(mapping, "cdfgeb")).toEqual(6);
    expect(findNumber(mapping, "cdfbe")).toEqual(5);
    expect(findNumber(mapping, "gcdfa")).toEqual(2);
    expect(findNumber(mapping, "fbcad")).toEqual(3);
    expect(findNumber(mapping, "cefabd")).toEqual(9);
  });
});
