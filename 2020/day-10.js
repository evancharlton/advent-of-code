const lines = require("./input")(__filename).map(Number);

lines.sort((a, b) => a - b);

let joltage = 0;
const spreads = {};
while (lines.length > 0) {
  const next = lines.shift();
  const difference = next - joltage;
  if (difference > 3 || difference < 1) {
    console.warn(`${next} is incompatible with ${joltage}`);
    break;
  }

  joltage = next;
  spreads[difference] = (spreads[difference] || 0) + 1;
}

// Account for the device itself
joltage += 3;
spreads[3] = spreads[3] + 1;

console.table(spreads);
console.log(spreads[1] * spreads[3]);
