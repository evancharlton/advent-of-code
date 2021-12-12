const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, parse } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test.only("Part 1", () => {
    // test for test data
    expect(part1(data("test"))).toEqual(10);
    expect(part1(data("test-a"))).toEqual(19);
    expect(part1(data("test-b"))).toEqual(226);

    // test for real data
    expect(part1(data())).toEqual(4011);
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
