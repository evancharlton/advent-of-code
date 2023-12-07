const CARDS = "AKQJT98765432"
  .split("")
  .reduce((acc, card, i) => ({ ...acc, [card]: i }), {});

const JOKER_CARDS = "AKQT98765432J"
  .split("")
  .reduce((acc, card, i) => ({ ...acc, [card]: i }), {});

const HANDS = [
  "FIVE OF A KIND",
  "FOUR OF A KIND",
  "FULL HOUSE",
  "THREE OF A KIND",
  "TWO PAIR",
  "ONE PAIR",
  "HIGH CARD",
].reduce((acc, hand, i) => ({ ...acc, [hand]: i }), {});

const compareCards = (RANKS) => (cardsA, cardsB) => {
  if (typeof cardsA !== "string") {
    throw new Error(
      `Expected cardsA to be a string, not ${JSON.stringify(cardsA)}`
    );
  }

  if (typeof cardsB !== "string") {
    throw new Error("Expected cardsB to be a string");
  }

  for (let i = 0; i < cardsA.length; i += 1) {
    const cardA = cardsA[i];
    const cardB = cardsB[i];
    if (cardA === cardB) {
      continue;
    }

    if (RANKS[cardA] === undefined) {
      throw new Error(`Unknown cardA: ${cardA}`);
    }

    if (RANKS[cardB] === undefined) {
      throw new Error(`Unknown cardB: ${cardB}`);
    }

    return RANKS[cardB] - RANKS[cardA];
  }
  return 0;
};

const compareTypes = (typeA, typeB) => {
  return HANDS[typeB] - HANDS[typeA];
};

const compareHands = (ranks) => (handA, handB) => {
  if (handA.type !== handB.type) {
    return compareTypes(handA.type, handB.type);
  }

  return compareCards(ranks)(handA.cards, handB.cards);
};

const getType = (hand, joker = false) => {
  if (typeof hand !== "string") {
    throw new Error("Hand should've been a string");
  }

  if (joker && hand.includes("J")) {
    // Find the most-powerful other combination and convert the J cards into
    // whatever that is.
    const options = "AKQT98765432"
      .split("")
      .map((card) => hand.replace(/J/g, card))
      .filter((res) => res !== hand)
      .map((h) => getType(h))
      .sort(compareTypes)
      .reverse();
    return options[0];
  }

  const cardsSet = new Set(hand);
  const counts = hand
    .split("")
    .reduce((acc, card) => ({ ...acc, [card]: (acc[card] || 0) + 1 }), {});
  const values = Object.values(counts)
    .sort((a, b) => +b - +a)
    .join("-");

  switch (cardsSet.size) {
    case 5:
      return "HIGH CARD";
    case 4:
      return "ONE PAIR";
    case 3: {
      switch (values) {
        case "2-2-1":
          return "TWO PAIR";
        case "3-1-1":
          return "THREE OF A KIND";
      }
      throw new Error(`Impossible 3-card situation: ${hand} -> ${values}`);
    }
    case 2: {
      switch (values) {
        case "3-2":
          return "FULL HOUSE";
        case "4-1":
          return "FOUR OF A KIND";
      }
      throw new Error(`Impossible 4-card situation: ${hand} -> ${values}`);
    }
    case 1:
      return "FIVE OF A KIND";
  }

  throw new Error(`Impossible hand: ${hand}`);
};

const parse = (hand, joker = false) => {
  return {
    type: getType(hand, joker),
    cards: hand,
  };
};

const data = (type = "", joker = false) => {
  return require("./input")(__filename, "\n", type)
    .filter(Boolean)
    .map((line) => {
      const [hand, bid] = line.split(" ");
      return { ...parse(hand, joker), bid: +bid };
    });
};

const part1 = (hands) => {
  return hands
    .sort(compareHands(CARDS))
    .map(({ bid }, i) => bid * (i + 1))
    .reduce((acc, v) => acc + v);
};

const part2 = (hands) => {
  return hands
    .sort(compareHands(JOKER_CARDS))
    .map(({ bid }, i) => bid * (i + 1))
    .reduce((acc, v) => acc + v);
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  CARDS,
  JOKER_CARDS,
  data,
  compareCards,
  compareHands,
  getType,
  parse,
  part1,
  part2,
};
