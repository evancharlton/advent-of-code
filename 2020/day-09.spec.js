const { part1, part2, data } = require("./day-09");

describe("Day 09", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"), 5)).toBe(127);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(556543474);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"), 5)).toBe(62);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(76096372);
    });
  });
});
