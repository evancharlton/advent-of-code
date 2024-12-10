const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const VALUE = 754;

    // test for test data
    expect(part1(data("test-mini"))).toEqual(2);
    expect(part1(data("test"))).toEqual(36);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const VALUE = 1609;

    // test for test data
    expect(part2(data("test-3"))).toEqual(3);
    expect(part2(data("test-13"))).toEqual(13);
    expect(part2(data("test-227"))).toEqual(227);
    expect(part2(data("test"))).toEqual(81);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
