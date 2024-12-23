const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 7;
    const VALUE = 1200;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    const res = part1(data())
    expect(res).not.toEqual(451)
    expect(res).not.toEqual(2362)
    expect(res).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = "co,de,ka,ta";
    const VALUE = "ag,gh,hh,iv,jx,nq,oc,qm,rb,sm,vm,wu,zr";
    const WRONG_GUESSES = [
      "ae,cm,ey,ko,lj,mc,nh,pu,sz,tw"
    ]

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    const res = part2(data())
    for (const guess of WRONG_GUESSES) {
      expect(res).not.toEqual(guess)
    }
    expect(res).toEqual(VALUE);
  });
});
