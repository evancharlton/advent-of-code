const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const VALUE = 6757;

    // test for test data
    expect(part1(data("test-square"))).toEqual(4);
    expect(part1(data("test"))).toEqual(8);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const VALUE = 523;

    // test for test data
    // expect(part2(data("test-inner1"))).toHaveLength(4);
    // expect(part2(data("test-inner2"))).toHaveLength(4);
    expect(part2(data("test-larger"))).toHaveLength(8);
    // expect(part2(data("test-junk"))).toHaveLength(10);

    // test for real data
    // NOTE: This is a total hack, and complete luck. If my input went the
    //       other way around, this would be wrong.
    expect(part2(data())).toHaveLength(VALUE);
  });
});
