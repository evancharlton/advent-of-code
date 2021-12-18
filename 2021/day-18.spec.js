const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const {
  part1,
  part2,
  data,
  addTrees,
  parseTree,
  explodeTree,
  splitTree,
  toArray,
  sumTrees,
  calculateMagnitude,
} = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test("explodeTree", () => {
    const et = (str) => {
      const startTree = parseTree(JSON.parse(str));
      const tree = explodeTree(startTree);
      return JSON.stringify(toArray(tree));
    };

    // expect(et("[1,2]")).toEqual("[1,2]");
    // expect(et("[[1,2],3]")).toEqual("[[1,2],3]");
    expect(et("[[[[[9,8],1],2],3],4]")).toEqual("[[[[0,9],2],3],4]");
    expect(et("[7,[6,[5,[4,[3,2]]]]]")).toEqual("[7,[6,[5,[7,0]]]]");
    expect(et("[[6,[5,[4,[3,2]]]],1]")).toEqual("[[6,[5,[7,0]]],3]");
    expect(et("[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]")).toEqual(
      "[[3,[2,[8,0]]],[9,[5,[7,0]]]]"
    );
    expect(et("[[3,[2,[1,[7,3]]]],[6,4]]")).toEqual("[[3,[2,[8,0]]],[9,4]]");
    expect(et("[[3,[2,[8, 0]]],[9,[5,[4,[3,2]]]]]")).toEqual(
      "[[3,[2,[8,0]]],[9,[5,[7,0]]]]"
    );
    expect(et("[[[[[1,1],[2,2]],[3,3]],[4,4]],[5,5]]")).toEqual(
      "[[[[0,[3,2]],[3,3]],[4,4]],[5,5]]"
    );
    expect(et("[[[[0,[3,2]],[3,3]],[4,4]],[5,5]]")).toEqual(
      "[[[[3,0],[5,3]],[4,4]],[5,5]]"
    );
  });

  test("splitTree", () => {
    const st = (str) =>
      JSON.stringify(toArray(splitTree(parseTree(JSON.parse(str)))));
    expect(st("[[[[0,7],4],[15,[0,13]]],[1,1]]")).toEqual(
      "[[[[0,7],4],[[7,8],[0,13]]],[1,1]]"
    );
    expect(st("[[[[0,7],4],[[7,8],[0,13]]],[1,1]]")).toEqual(
      "[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]"
    );
    expect(
      st("[[[[7,7],[7,8]],[[9,5],[8,0]]],[[[9,10],20],[8,[9,0]]]]")
    ).toEqual("[[[[7,7],[7,8]],[[9,5],[8,0]]],[[[9,[5,5]],20],[8,[9,0]]]]");
  });

  test("addTrees", () => {
    const a = (one, two) =>
      JSON.stringify(
        toArray(
          addTrees(parseTree(JSON.parse(one)), parseTree(JSON.parse(two)))
        )
      );
    expect(a("[1,2]", "[3,4]")).toEqual("[[1,2],[3,4]]");
  });

  test("sumTrees", () => {
    const st = (which) =>
      JSON.stringify(
        toArray(
          sumTrees(
            data(which)
              .map((line) => JSON.parse(line))
              .map((pair) => parseTree(pair))
          )
        )
      );
    expect(st("bug")).toEqual(
      "[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]"
    );
    expect(st("sum")).toEqual("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]");
    expect(st("simple-4")).toEqual("[[[[1,1],[2,2]],[3,3]],[4,4]]");
    expect(st("simple-5")).toEqual("[[[[3,0],[5,3]],[4,4]],[5,5]]");
    expect(st("simple-6")).toEqual("[[[[5,0],[7,4]],[5,5]],[6,6]]");
    expect(st("test")).toEqual(
      "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]"
    );
    expect(st("homework")).toEqual(
      "[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]"
    );
  });

  test("calculateMagnitude", () => {
    const cm = (str) => calculateMagnitude(parseTree(JSON.parse(str)));
    expect(cm("[[1,2],[[3,4],5]]")).toEqual(143);
  });

  test("Part 1", () => {
    // test for test data
    expect(part1(data("homework"))).toEqual(4140);

    // test for real data
    expect(part1(data())).toEqual(3869);
  });

  test("Part 2", () => {
    // test for test data
    expect(part2(data("homework"))).toEqual(3993);

    // test for real data
    expect(part2(data())).toEqual(4671);
  });
});
