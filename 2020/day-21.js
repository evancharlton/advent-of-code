const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((line) => {
    const [ingredients, allergens] = line.split(" (");
    if (!allergens) {
      throw new Error("Missing allergens?");
    }
    return {
      ingredients: ingredients.split(" "),
      allergens: allergens
        .replace(")", "")
        .replace("contains ", "")
        .split(", "),
    };
  });
};

const part1 = (input) => {
  const knownMapping = new Map();

  const allergenMap = input.reduce((acc, { allergens, ingredients }) => {
    allergens.forEach((allergen) => {
      acc.set(allergen, acc.get(allergen) || []);
      acc.get(allergen).push(ingredients);
    });
    return acc;
  }, new Map());

  while (allergenMap.size > 0) {
    allergenMap.forEach((ingredientLists, allergen) => {
      const duplicates = ingredientLists.reduce((acc, ingredientSet) => {
        // Remember: acc is the first element in the array because an initial
        // value was not specified! You spent forever debugging this.
        return acc.filter((ingredient) => {
          return ingredientSet.includes(ingredient);
        });
      });
      const filtered = duplicates.filter((ingredient) => {
        return !knownMapping.has(ingredient);
      });
      if (filtered.length === 1) {
        knownMapping.set(filtered[0], allergen);
        allergenMap.delete(allergen);
      } else if (filtered.length === 0) {
        allergenMap.set(allergen, filtered);
      }
    });
  }

  const safeIngredients = input
    .reduce((acc, { ingredients }) => {
      return [...acc, ...ingredients];
    }, [])
    .filter((ingredient) => {
      return !knownMapping.has(ingredient);
    });

  return safeIngredients.length;
};

const part2 = (input) => {
  return undefined;
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
