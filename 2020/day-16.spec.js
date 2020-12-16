const {
  part1,
  part2,
  data,
  validRanges,
  merge,
  validTickets,
} = require("./day-16");

describe("Day 16", () => {
  const PART_1_DATA = {
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
  };

  const PART_2_DATA = {
    info: `
class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19
`.trim(),
    nearby: `
3,9,18
15,1,5
5,14,9
`.trim(),
    yours: `11,12,13`.trim(),
  };

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

  describe("validRanges", () => {
    it("works", () => {
      expect(
        validRanges(
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
      expect(part1(PART_1_DATA)).toBe(71);
    });

    it.skip("works for real data", () => {
      expect(part1(data())).toBe(undefined);
    });
  });

  describe("Part 2", () => {
    describe("validTickets", () => {
      it("works", () => {
        expect(validTickets(PART_1_DATA)).toHaveLength(1);
      });
    });

    it("works for test data", () => {
      expect(part2(PART_2_DATA)).toBe(1);
    });

    it.skip("works for real data", () => {
      expect(part2(data())).toBe(undefined);
    });
  });
});
