const { part1, part2, data } = require("./day-02");

describe("Day 02", () => {
  describe("Part 1", () => {
    it("works", () => {
      expect(part1(data("test"))).toBe(12);
      expect(part1(data())).toBe(7808);
    });
  });

  describe("Part 2", () => {
    it("works", () => {
      expect(part2(data("test2"))).toBe("fgij");
      expect(part2(data())).toBe("efmyhuckqldtwjyvisipargno");
    });
  });
});
