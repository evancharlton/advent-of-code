const { part1, data } = require("./day-25");

describe("Day 25", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(14897079);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(711945);
    });
  });
});
