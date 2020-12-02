const readLines = require("../read-input");

const createDeck = (count = 10007) => {
  const deck = [];
  for (let i = 0; i < count; i += 1) {
    deck.push(i);
  }
  return deck;
};

const dealWith = line => {
  const increment = +line.replace("deal with increment ", "");
  return deck => {
    const newDeck = new Array(deck.length);
    deck.forEach((card, i) => {
      newDeck[(i * increment) % deck.length] = card;
    });
    return newDeck;
  };
};

const cut = line => {
  const size = +line.replace("cut ", "");
  return deck => {
    if (size > 0) {
      const top = deck.slice(0, size);
      const bottom = deck.slice(size);
      return [...bottom, ...top];
    } else if (size < 0) {
      const top = deck.slice(0, deck.length + size);
      const bottom = deck.slice(deck.length + size);
      return [...bottom, ...top];
    }
    throw new Error("Cannot cut the deck with zero cards");
  };
};

const dealInto = () => deck => {
  const newDeck = [];
  while (deck.length > 0) {
    newDeck.unshift(deck.shift());
  }
  return newDeck;
};

const getAction = line => {
  if (line.startsWith("deal with increment")) {
    return dealWith(line);
  }
  if (line.startsWith("cut")) {
    return cut(line);
  }
  if (line === "deal into new stack") {
    return dealInto(line);
  }
  throw new Error(`Unknown instruction: ${line}`);
};

readLines("./day-22/input")
  .then(async lines => {
    let cards = createDeck();

    lines.forEach(line => {
      const action = getAction(line);
      const newDeck = action(cards);
      cards = newDeck;
    });

    return cards;
  })
  .then(deck => {
    return deck.findIndex(card => card === 2019);
  })
  .then(output => {
    if (output !== undefined) {
      if (Array.isArray(output) || typeof output === "object") {
        console.log(JSON.stringify(output, null, 2));
      } else {
        console.log(output);
      }
    }
    process.exit(0);
  })
  .catch(ex => {
    console.error(ex);
    process.exit(1);
  });
