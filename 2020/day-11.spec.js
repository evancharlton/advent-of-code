const {
  part1,
  part2,
  data,
  tick,
  toString,
  immediateNeighbors,
  visibleNeighbors,
} = require("./day-11");

describe("Day 11", () => {
  describe("tick", () => {
    it("Detects final state", () => {
      const start = data("test-final");
      const { next, changes } = tick(immediateNeighbors, 4)(start);
      expect(toString(start)).toMatch(toString(next));
      expect(changes).toBe(0);
    });
  });

  describe("visibleNeighbors", () => {
    it("handles the row", () => {
      const input = `
        .............
        .L.L.#.#.#.#.
        .............
      `
        .trim()
        .split("\n")
        .map((l) => l.trim());
      expect(visibleNeighbors(input, 1, 1)).toBe(0);
      expect(visibleNeighbors(input, 1, 3)).toBe(1);
      expect(visibleNeighbors(input, 1, 5)).toBe(1);
      expect(visibleNeighbors(input, 1, 7)).toBe(2);
    });

    it("handles the zero-case", () => {
      const input = `
        .##.##.
        #.#.#.#
        ##...##
        ...L...
        ##...##
        #.#.#.#
        .##.##.
      `
        .trim()
        .split("\n")
        .map((l) => l.trim());
      expect(visibleNeighbors(input, 3, 3)).toBe(0);
    });

    it("handles the eight-case", () => {
      const input = `
        ###
        #L#
        ###
      `
        .trim()
        .split("\n")
        .map((l) => l.trim());
      expect(visibleNeighbors(input, 1, 1)).toBe(8);
    });
  });

  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(37);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe(26);
    });
  });
});
