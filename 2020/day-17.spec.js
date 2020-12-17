const { part1, part2, data, getNeighbors } = require("./day-17");

describe("Day 17", () => {
  describe("getNeighbors", () => {
    it("works", () => {
      expect(getNeighbors("1,1,1").length).toBe(27);
    });
  });

  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(112);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(273);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe(848);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(1504);
    });
  });
});
