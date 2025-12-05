const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 3;
    const VALUE = 868;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = 14;
    const VALUE = 354143734113772;

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    expect(
      part2([
        [
          [1, 4],
          [3, 8],
          [9, 15],
        ],
        [1, 5, 10, 15],
      ])
    ).toEqual(15);

    // test for real data
    expect(part2(data())).not.toEqual(335289513753532);
    expect(part2(data())).toBeGreaterThan(350669762943151);
    expect(part2(data())).toEqual(VALUE);
  });
});
