const { part1, part2, data, getTerms, evaluate, doMath } = require("./day-18");

describe("Day 18", () => {
  describe("getTerms", () => {
    it("works", () => {
      expect(getTerms("1 + 2")).toEqual(expect.arrayContaining([1, "+", 2]));
    });
  });

  describe("evaluate", () => {
    it("works", () => {
      expect(evaluate("1 + (2 * 3)")).toEqual(7);
      expect(evaluate("1 + 2")).toEqual(3);
    });
  });

  describe("doMath", () => {
    it("works", () => {
      expect(doMath("1 + 2")).toBe(3);
      expect(doMath("1 * 2")).toBe(2);
      expect(doMath("1 + 2 * 3")).toBe(9);
    });
  });

  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(["1 + 2 * 3 + 4 * 5 + 6"])).toBe(71);
      expect(part1(["1 + (2 * 3) + (4 * (5 + 6))"])).toBe(51);
      expect(part1(["2 * 3 + (4 * 5)"])).toBe(26);
      expect(
        part1(["1 + 2 * 3 + 4 * 5 + 6", "1 + (2 * 3) + (4 * (5 + 6))"])
      ).toBe(71 + 51);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(50956598240016);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      // expect(part2(["1 + 2 * 3 + 4 * 5 + 6"])).toBe(71);
      expect(part2(["1 + (2 * 3) + (4 * (5 + 6))"])).toBe(51);
      expect(part2(["2 * 3 + (4 * 5)"])).toBe(46);
      expect(part2(["5 + (8 * 3 + 9 + 3 * 4 * 3)"])).toBe(1445);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(535809575344339);
    });
  });
});
