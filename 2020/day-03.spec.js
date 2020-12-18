const { part1, part2, data } = require("./day-03");

describe("Day 03", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(7);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(225);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe(336);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(1115775000);
    });
  });
});
