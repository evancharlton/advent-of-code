const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, count, unfold } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("count", () => {
    expect(count("?#?#?#?#?#?#?#?", [1, 3, 1, 6])).toEqual(1);
    expect(count("????.######..#####.", [1, 6, 5])).toEqual(4);
    expect(count("?..??.??????.?", [1, 1, 6])).toEqual(2);
    expect(count("??????.?????", [1, 1, 1])).toEqual(91);
    expect(count(...unfold("???.###", [1, 1, 3]))).toEqual(1);
  });

  test("Part 1", () => {
    const TEST_VALUE = 21;
    const VALUE = 6958;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = 525152;
    const VALUE = undefined;

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
