const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, findCorruption, parse } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test.only("findCorruption", () => {
    // expect(findCorruption([""])).toBeUndefined();
    expect(findCorruption("{([(<{}[<>[]}>{[]{[(<()>".split(""))).toEqual("}");
  });

  test.only("Part 1", () => {
    // test for simple data
    // expect(part1([])).toEqual(undefined);

    // test for test data
    expect(part1(data("test"))).toEqual(26397);

    // test for real data
    expect(part1(data())).toEqual(364389);
  });

  test("Part 2", () => {
    // test for simple data
    // expect(part2([])).toEqual(undefined);

    // test for test data
    expect(part2(data("test"))).toEqual(TEST);

    // test for real data
    expect(part2(data())).toEqual(PROD);
  });
});
