const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, countSides, getRegions } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  const r = (which) => getRegions(data(which));

  describe("countSides", () => {
    test("E", () => {
      const regions = r("e");
      expect(regions.length).toEqual(3);

      expect(countSides(regions[0])).toEqual(12);
      expect(countSides(regions[1])).toEqual(4);
    });

    test("nested", () => {
      const regions = r("nested");

      expect(countSides(regions[0])).toEqual(20);
      expect(16 + (4 + 16)).toEqual(36);
      expect(4 * 1 * 4 + 21 * (4 + 4 * 4)).toEqual(436);
    });
  });

  test("Part 1", () => {
    const VALUE = 1402544;

    // test for test data
    expect(part1(data("mini"))).toEqual(140);
    expect(part1(data("nested"))).toEqual(772);
    expect(part1(data("test"))).toEqual(1930);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const VALUE = 862486;

    // test for test data
    // expect(part2(data("mini"))).toEqual(80);
    expect(part2(data("e"))).toEqual(236);
    expect(part2(data("nested"))).toEqual(436);
    expect(part2(data("midi"))).toEqual(368);
    expect(part2(data("test"))).toEqual(1206);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
