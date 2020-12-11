const { part1, part2, data, tick, toString } = require("./day-11");

describe("Day 11", () => {
  describe("tick", () => {
    it("Detects final state", () => {
      const start = data("test-final");
      const { next, changes } = tick(start);
      expect(toString(start)).toMatch(toString(next));
      expect(changes).toBe(0);
    });
  });

  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(37);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe(undefined);
    });
  });
});
