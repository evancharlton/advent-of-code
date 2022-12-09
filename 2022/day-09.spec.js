const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, takeStep } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 13;
    const VALUE = 6212;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).not.toEqual(6211);
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const VALUE = 2522;

    // test for test data
    expect(part2(data("test"))).toEqual(1);

    // larger test
    expect(part2(data("test.large"))).toEqual(36);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });

  describe("takeStep", () => {
    test("R example", () => {
      const [H, T] = takeStep("R", 1, new Set(), [2, 2], [1, 1]);
      expect(H).toEqual([3, 2]);
      expect(T).toEqual([2, 2]);
    });

    test("U example", () => {
      const [H, T] = takeStep("U", 1, new Set(), [2, 2], [1, 1]);
      expect(H).toEqual([2, 3]);
      expect(T).toEqual([2, 2]);
    });

    test("R 4", () => {
      const newKnots = takeStep(
        "R",
        4,
        new Set(),
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
      );
      expect(newKnots).toEqual([
        [4, 0],
        [3, 0],
        [2, 0],
        [1, 0],
        [0, 0],
      ]);
    });

    test("U 8", () => {
      const newKnots = takeStep(
        "U",
        8,
        new Set(),
        [5, 0],
        [4, 0],
        [3, 0],
        [2, 0],
        [1, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
      );
      expect(newKnots).toEqual([
        [5, 8], // H
        [5, 7], // 1
        [5, 6], // 2
        [5, 5], // 3
        [5, 4], // 4
        [4, 4], // 5
        [3, 3], // 6
        [2, 2], // 7
        [1, 1], // 8
        [0, 0], // 9
      ]);
    });
  });
});
