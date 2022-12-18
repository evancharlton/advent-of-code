const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 64;
    const VALUE = 3364;

    expect(
      part1([
        [1, 1, 1],
        [2, 1, 1],
      ])
    ).toEqual(10);

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    expect(part1(HOLLOW_4X4)).toEqual(16 * 6 + 4 * 6);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = 58;
    const VALUE = undefined;

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    expect(part2(HOLLOW_4X4)).toEqual(16 * 6);
    expect(part2(HOLLOW_4X4_WITH_HOLE)).toEqual(16 * 5 + 15 + 4 * 5 + 3 + 4);

    // test for real data
    expect(part2(data())).toBeGreaterThan(1896);
    expect(part2(data())).toEqual(VALUE);
  });
});

const HOLLOW_4X4 = (() => {
  const out = [];
  for (const x of [0, 1, 2, 3]) {
    for (const y of [0, 1, 2, 3]) {
      for (const z of [0, 1, 2, 3]) {
        if (
          (x === 1 || x === 2) &&
          (y === 1 || y === 2) &&
          (z === 1 || z === 2)
        ) {
          continue;
        }
        out.push([x, y, z]);
      }
    }
  }
  return out;
})();

const HOLLOW_4X4_WITH_HOLE = (() => {
  const out = [];
  for (const x of [0, 1, 2, 3]) {
    for (const y of [0, 1, 2, 3]) {
      for (const z of [0, 1, 2, 3]) {
        if (
          (x === 1 || x === 2) &&
          (y === 1 || y === 2) &&
          (z === 0 || z === 1 || z === 2)
        ) {
          continue;
        }
        out.push([x, y, z]);
      }
    }
  }
  return out;
})();
