const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, rounds } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 10605;
    const VALUE = 120056;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test.only("Part 2", () => {
    const TEST_VALUE = 2713310158;
    const VALUE = undefined;

    expect(rounds(data("test"), 1, (item) => item)).toMatchObject({
      0: 2,
      1: 4,
      2: 3,
      3: 6,
    });

    expect(rounds(data("test"), 20, (item) => item)).toMatchObject({
      0: 99,
      1: 97,
      2: 8,
      3: 103,
    });

    expect(rounds(data("test"), 1000, (item) => item)).toMatchObject({
      0: 5204,
      1: 4792,
      2: 199,
      3: 5192,
    });

    expect(rounds(data("test"), 10000, (item) => item)).toMatchObject({
      0: 52166,
      1: 47830,
      2: 1938,
      3: 52013,
    });

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
