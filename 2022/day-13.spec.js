const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { correctOrder, data, part1, part2 } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("correctOrder", () => {
    // expect(correctOrder([1, 1, 3, 1, 1], [1, 1, 5, 1, 1])).toBe(true);
    // expect(correctOrder([[1], [2, 3, 4]], [[1], 4])).toBe(true);
    // expect(correctOrder([9], [[8, 7, 6]])).toBe(false);
    // expect(correctOrder([[4, 4], 4, 4], [[4, 4], 4, 4, 4])).toBe(true);
    // expect(correctOrder([2, 3, 4], 4)).toBe(true);
    // expect(correctOrder([7, 7, 7, 7], [7, 7, 7])).toBe(false);
    // expect(correctOrder([[[]]], [[]])).toBe(false);
    // expect(
    //   correctOrder(
    //     [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
    //     [1, [2, [3, [4, [5, 6, 0]]]], 8, 9]
    //   )
    // ).toBe(false);

    expect(
      correctOrder(
        [[1, 4, 7, 4, 8], [], [8, 0, 7, [], []]],
        [[10, [5, [0, 2, 5, 3, 3], [9, 7, 9], 6], 7, 9, [2, 9, [], 4, 0]], [8]]
      )
    ).toBe(true);
  });

  test("Part 1", () => {
    const TEST_VALUE = 13;
    const VALUE = 6235;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).not.toEqual(5948);
    expect(part1(data())).not.toEqual(6024);
    expect(part1(data())).not.toEqual(6261);
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = 140;
    const VALUE = 22866;

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
