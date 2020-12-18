const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type).filter(Boolean);
  return lines;
};

const getTerms = (expr) => {
  if (expr.includes("(")) {
    throw new Error("Parens must be removed first");
  }
  const cleaned = expr.replace(/ /g, "");

  const { term, terms } = cleaned.split("").reduce(
    ({ terms, term }, char) => {
      switch (char) {
        case "+":
        case "*":
          return {
            terms: [...terms, +term, char],
            term: "",
          };
        default:
          return {
            terms,
            term: `${term}${char}`,
          };
      }
    },
    { terms: [], term: "" }
  );
  terms.push(+term);
  return terms;
};

const doMath = (expr) => {
  const terms = getTerms(expr);
  if (terms.length < 3) {
    throw new Error(
      `Must have at least 3 terms (was ${terms.length}: "${expr}")`
    );
  }
  if (terms.length % 2 !== 1) {
    throw new Error(`Must have an odd number of terms (was: ${terms.length})`);
  }
  let first = terms.shift();
  while (terms.length > 0) {
    const op = terms.shift();
    const second = terms.shift();

    switch (op) {
      case "+": {
        first = first + second;
        break;
      }
      case "*": {
        first = first * second;
        break;
      }
    }
  }
  return first;
};

const evaluate = (expr, handleAddition = false) => {
  let currentExpression = expr;
  while (true) {
    const subExpression = currentExpression.match(/\([0-9+* ]+\)/);
    if (!subExpression) {
      break;
    }
    const [expr] = subExpression;
    const cleaned = expr.replace(/^\(/, "").replace(/\)$/, "");
    const evaluated = evaluate(cleaned, handleAddition);
    currentExpression = currentExpression.replace(expr, evaluated);
  }

  if (handleAddition) {
    while (true) {
      const subExpression = currentExpression.match(/\b[\d]+ \+ [\d]+\b/);
      if (!subExpression) {
        break;
      }
      const [match] = subExpression;
      if (match === currentExpression) {
        break;
      }
      const evaluated = evaluate(match, handleAddition);
      currentExpression = currentExpression.replace(match, evaluated);
    }
  }

  return doMath(currentExpression);
};

const part1 = (problems) => {
  return problems
    .map((problem) => {
      return evaluate(problem);
    })
    .reduce((acc, totals) => acc + totals, 0);
};

const part2 = (problems) => {
  return problems
    .map((problem) => {
      return evaluate(problem, true);
    })
    .reduce((acc, totals) => acc + totals, 0);
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
  doMath,
  evaluate,
  getTerms,
};
