const { part1, part2, data } = require("./day-08");

describe("Day 08", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(5);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(2014);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe(8);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(2251);
    });
  });
});
