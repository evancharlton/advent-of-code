const {
  part1,
  part2,
  data,
  getMonsterCount,
  findBoxesWithMonsters,
  rotateTile,
  MONSTER,
} = require("./day-20");

describe("Day 20", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(20899048083289);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(140656720229539);
    });
  });

  describe("rotateTile", () => {
    it("works", () => {
      expect(rotateTile(["abc"])).toEqual(["a", "b", "c"]);
    });
  });

  describe("getMonsterCount", () => {
    it("works", () => {
      expect(getMonsterCount(data("test")).monsters).toBe(2);
      expect(getMonsterCount(data()).monsters).toBe(37);
    });
  });

  describe("findBoxesWithMonsters", () => {
    it("works", () => {
      expect(findBoxesWithMonsters([MONSTER]).length).toBe(1);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe(273);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(1885);
    });
  });
});
