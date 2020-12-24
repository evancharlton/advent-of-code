const { part1, part2, data } = require("./day-24");

describe("Day 24", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(10);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(549);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"), 1)).toBe(15);
      expect(part2(data("test"), 2)).toBe(12);
      expect(part2(data("test"), 3)).toBe(25);
      expect(part2(data("test"), 4)).toBe(14);
      expect(part2(data("test"), 10)).toBe(37);
      expect(part2(data("test"), 20)).toBe(132);
      expect(part2(data("test"), 30)).toBe(259);
      expect(part2(data("test"), 40)).toBe(406);
      expect(part2(data("test"), 50)).toBe(566);
      expect(part2(data("test"), 100)).toBe(2208);
    });

    it("works for real data", () => {
      expect(part2(data())).toBeGreaterThan(456);
    });
  });
});
