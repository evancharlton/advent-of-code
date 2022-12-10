const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { crt, part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 13140;
    const VALUE = 14560;

    // test for test data
    expect(crt(data("test"))).toEqual([1, 1, 1, 4, 4, -1]);
    expect(part1(data("test.large"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = `
# # . . # # . . # # . . # # . . # # . . # # . . # # . . # # . . # # . . # # . .
# # # . . . # # # . . . # # # . . . # # # . . . # # # . . . # # # . . . # # # .
# # # # . . . . # # # # . . . . # # # # . . . . # # # # . . . . # # # # . . . .
# # # # # . . . . . # # # # # . . . . . # # # # # . . . . . # # # # # . . . . .
# # # # # # . . . . . . # # # # # # . . . . . . # # # # # # . . . . . . # # # #
# # # # # # # . . . . . . . # # # # # # # . . . . . . . # # # # # # # . . . . .
`.trim();
    const VALUE = `
# # # # . # . . # . # # # . . # . . # . # # # # . # # # . . # . . # . # # # # .
# . . . . # . # . . # . . # . # . . # . # . . . . # . . # . # . . # . . . . # .
# # # . . # # . . . # . . # . # # # # . # # # . . # . . # . # . . # . . . # . .
# . . . . # . # . . # # # . . # . . # . # . . . . # # # . . # . . # . . # . . .
# . . . . # . # . . # . # . . # . . # . # . . . . # . . . . # . . # . # . . . .
# # # # . # . . # . # . . # . # . . # . # # # # . # . . . . . # # . . # # # # .
    `.trim();

    // test for test data
    expect(part2(data("test.large"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
