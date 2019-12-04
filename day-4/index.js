const doubleDigits = chars => {
  for (let i = 1; i < chars.length; i += 1) {
    if (chars[i - 1] === chars[i]) {
      return true;
    }
  }
  return false;
};

const increasing = chars => {
  return chars.join("") === [...chars].sort().join("");
};

const isValid = input => {
  const chars = String(input).split("");

  if (!doubleDigits(chars)) {
    return false;
  }

  if (!increasing(chars)) {
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
