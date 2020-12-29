const { part1, part2, data } = require("./day-05");

describe("Day 05", () => {
  describe("Part 1", () => {
    it("works", () => {
      expect(part1("aA")).toBe(0);
      expect(part1("abBA")).toBe(0);
      expect(part1("aabAAB")).toBe(6);
      expect(part1(data())).toBe(10708);
    });
  });

  describe("Part 2", () => {
    it("works", () => {
      expect(part2("dabAcCaCBAcCcaDA")).toBe(4);
      expect(part2(data())).toBe(5330);
    });
  });
});
