const { part1, part2, data, parseInfo, merge } = require("./day-16");

describe("Day 16", () => {
  describe("merge", () => {
    it("works", () => {
      expect(
        merge([
          [1, 5],
          [2, 6],
        ])
      ).toEqual(expect.arrayContaining([[1, 6]]));
    });
  });

  describe("parseInfo", () => {
    it("works", () => {
      expect(
        parseInfo(
          `
class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50
`.trim()
        )
      ).toEqual(
        expect.arrayContaining([
          [1, 3],
          [5, 11],
          [13, 44],
          [45, 50],
        ])
      );
    });
  });

  describe("Part 1", () => {
    it("works for test data", () => {
      expect(
        part1({
          info: `
class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50`.trim(),
          nearby: `
7,3,47
40,4,50
55,2,20
38,6,12
          `.trim(),
        })
      ).toBe(71);
    });

    it.skip("works for real data", () => {
      expect(part1(data())).toBe(undefined);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe(undefined);
    });

    it.skip("works for real data", () => {
      expect(part2(data())).toBe(undefined);
    });
  });
});
