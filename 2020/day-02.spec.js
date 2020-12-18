const { part1, part2, data } = require("./day-02");

describe("Day 02", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(2);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(398);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe(1);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(562);
    });
  });
});
