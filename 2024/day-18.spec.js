const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 22;
    const VALUE = 454;

    // test for test data
    expect(part1(data("test"), { size: 7, cap: 12 })).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).not.toEqual(460);
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = "6,1";
    const VALUE = "8,51";

    // test for test data
    expect(part2(data("test"), { size: 7, cap: 12 })).toEqual(TEST_VALUE);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
