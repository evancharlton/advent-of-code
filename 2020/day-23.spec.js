const { part1, part2, data } = require("./day-23");

describe("Day 23", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"), 10)).toBe("92658374");
      expect(part1(data("test"))).toBe("67384529");
    });

    it("works for real data", () => {
      expect(part1(data())).toBe("43769582");
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe(149245887792);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(264692662390);
    });
  });
});
