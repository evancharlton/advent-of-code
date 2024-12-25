const data = (type = "") => {
  const [initial, gates] = require("./input")(__filename, { type, trim: true, delim: "\n\n" });
  return {
    initial: initial
      .split("\n")
      .map(line => line.split(": ")).reduce((acc, [wire, value]) => ({
        ...acc,
        [wire]: +value
      }), {}),
    gates: gates
      .split("\n")
      .map(line => {
        const [_, a, op, b, output] = line.match(/^([^ ]+) (AND|OR|XOR) ([^ ]+) -> (.+)$/);
        return { a, b, op, output }
      })
  };
};

const OPS = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  XOR: (a, b) => a ^ b,
}

const getBinary = (wires, prefix) => {
  return parseInt(Object.entries(wires)
    .filter(([name]) => name.startsWith(prefix))
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([_, v]) => v)
    .join(''), 2)
}

const part1 = ({ initial, gates }) => {
  const wires = { ...initial };
  const queue = [...gates];
  while (queue.length > 0) {
    const gate = queue.shift();
    const { a, b, op, output } = gate;
    if (!(a in wires) || !(b in wires)) {
      queue.push(gate)
      continue;
    }

    wires[output] = OPS[op](wires[a], wires[b])
  }


  return getBinary(wires, "z")
};

const part2 = ({ initial, gates }) => {
  return { initial, gates }
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
};
