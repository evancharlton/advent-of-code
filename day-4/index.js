const doubleDigits = input => {
  return !!String(input)
    .replace(/(000+|111+|222+|333+|444+|555+|666+|777+|888+|999+)/g, "")
    .match(/(00|11|22|33|44|55|66|77|88|99)/);
};

const increasing = input => {
  return (
    String(input) ===
    String(input)
      .split("")
      .sort()
      .join("")
  );
};

const isValid = input => {
  if (!doubleDigits(input)) {
    return false;
  }

  if (!increasing(input)) {
    return false;
  }

  return true;
};

let valid = [];
for (let i = 402328; i <= 864247; i += 1) {
  if (isValid(i)) {
    valid.push(i);
  }
}

console.log(valid.length);
