const { part1, part2, data } = require("./day-07");

describe("Day 07", () => {
  describe("Part 1", () => {
    it.skip("works", () => {
      expect(part1(data("test"))).toBe("CABDFE");
      expect(part1(data())).toBe("");
    });
  });

  describe("Part 2", () => {
    it("works", () => {
      expect(part2(data("test"))).toBe(undefined);
      expect(part2(data())).toBe(undefined);
    });
  });
});
