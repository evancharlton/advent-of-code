const { part1, part2, data } = require("./day-10");

describe("Day 10", () => {
  describe("Part 1", () => {
    it("works for test1 data", () => {
      expect(part1(data("test1"))).toBe(7 * 5);
    });

    it("works for test2 data", () => {
      expect(part1(data("test2"))).toBe(22 * 10);
    });
  });

  describe("Part 2", () => {
    it("works for test1 data", () => {
      expect(part2(data("test1"))).toBe(8);
    });

    it("works for test2 data", () => {
      expect(part2(data("test2"))).toBe(19208);
    });
  });
});
