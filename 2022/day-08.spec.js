const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, getScore } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 21;
    const VALUE = 1684;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).not.toEqual(1380);
    expect(part1(data())).not.toEqual(1469);
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = 8;
    const VALUE = 486540;

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part2(data())).not.toEqual(497352);
    expect(part2(data())).toEqual(VALUE);
  });

  test("getScore", () => {
    expect(getScore(data("test"), 1, 2)).toEqual(4);
    expect(getScore(data("test"), 3, 2)).toEqual(8);
  });
});
