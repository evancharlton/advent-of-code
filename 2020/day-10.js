const lines = require("./input")(__filename).map(Number);

lines.push(0);
lines.sort((a, b) => a - b);

const runs = [];
let run = [];
for (let i = 0; i < lines.length; i += 1) {
  const curr = lines[i];
  const next = lines[i + 1];
  const breakpoint = next - curr === 3;
  run.push(curr);

  if (breakpoint) {
    // This is the end of a run; save it away.
    runs.push([...run]);
    run = [];
  }
}

if (run.length > 0) {
  runs.push([...run]);
}

const isValid = (list) => {
  for (let i = 1; i < list.length; i += 1) {
    if (list[i] - list[i - 1] > 3) {
      return false;
    }
  }
  return true;
};

// Yanked from SO
const powerset = (l) => {
  return (function ps(list) {
    if (list.length === 0) {
      return [[]];
    }
    var head = list.pop();
    var tailPS = ps(list);
    return tailPS.concat(
      tailPS.map(function (e) {
        return [head].concat(e);
      })
    );
  })(l.slice()).sort((a, b) => a - b);
};

const bruteforce = (list) => {
  const innerSet = list.slice(1, list.length - 1);
  return powerset(innerSet).reduce((acc, set) => {
    const paddedSet = [list[0], ...set, list[list.length - 1]].sort(
      (a, b) => a - b
    );
    const valid = isValid(paddedSet);
    if (valid) {
      return acc + 1;
    }
    return acc;
  }, 0);
};

const relevant = runs.filter((r) => r.length > 2);
const out = relevant.reduce((acc, r) => {
  return acc * bruteforce(r);
}, 1);

console.log("total:", out);
