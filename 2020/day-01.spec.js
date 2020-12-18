const { part1, part2, data } = require("./day-01");

describe("Day 01", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(514579);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(1020084);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe(241861950);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(295086480);
    });
  });
});
