const { part1, part2, data } = require("./day-05");

describe("Day 05", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(["FBFBBFFRLR"])).toBe(357);
      expect(part1(["BFFFBBFRRR"])).toBe(567);
      expect(part1(["FFFBBBFRRR"])).toBe(119);
      expect(part1(["BBFFBBFRLL"])).toBe(820);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(890);
    });
  });

  describe("Part 2", () => {
    it("works for real data", () => {
      expect(part2(data())).toBe(651);
    });
  });
});
