const { part1, part2, data } = require("./day-04");

describe("Day 04", () => {
  describe("Part 1", () => {
    it("works", () => {
      expect(part1(data("test"))).toBe(240);
      expect(part1(data())).toBe(74743);
    });
  });

  describe("Part 2", () => {
    it("works", () => {
      expect(part2(data("test"))).toBe(4455);
      expect(part2(data())).toBe(132484);
    });
  });
});
