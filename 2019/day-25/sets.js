let max = (2 ** 7).toString(2).length;

for (let i = 2 ** 7; i > 0; i -= 1) {
  let str = i.toString(2);
  while (str.length < max) {
    str = `0${str}`;
  }
  console.log(str);
}
