const readLines = require("../read-input");

const spaces = (a) => {
  let out = "";
  while (out.length <= a * 2) {
    out += " ";
  }
  return out;
};

const VERBOSE = false;

readLines(`${__dirname}/input`)
  .then(async (equations) => {
    return equations.map((equation) => {
      const [parts, result] = equation.split(" => ");
      const components = parts.split(", ");
      const [yield, product] = result.split(" ");
      return {
        yield: +yield,
        product,
        components: components.map((c) => {
          const [quantity, item] = c.split(" ");
          return { quantity: +quantity, item };
        }),
      };
    });
  })
  .then((parsed) => {
    return parsed.reduce(
      (acc, item) => ({
        ...acc,
        [item.product]: {
          ...item,
          stock: 0,
          created: 0,
          reset: function () {
            this.stock = 0;
            this.created = 0;
          },
        },
      }),
      {
        ORE: {
          stock: 0,
          created: 0,
          make: function (amount) {
            VERBOSE && console.log(`   --> Made ${amount} ORE !`);
            this.created += amount;
          },
          reset: function () {
            this.stock = 0;
            this.created = 0;
          },
        },
      }
    );
  })
  .then((factories) => {
    Object.keys(factories).forEach((item) => {
      if (factories[item].make) {
        return;
      }

      factories[item].make = function (amount, indent = 0) {
        if (this.stock >= amount) {
          VERBOSE &&
            console.log(`${spaces(indent)}Using existing stock of ${item}`);
          this.stock -= amount;
          return;
        }

        while (this.stock < amount) {
          this.components.forEach(({ quantity, item: type }) => {
            VERBOSE &&
              console.log(
                `${spaces(
                  indent
                )}${item} needs ${quantity} of ${type} ... (stock: ${
                  this.stock
                })`
              );
            factories[type].make(quantity, indent + 1);
          });
          this.stock += this.yield;
          this.created += this.yield;
        }

        this.stock -= amount;
      };
    });
    return factories;
  })
  .then((factories) => {
    // Look for the upper bound; we'll do a binary search later
    let lastSuccessPow = 6;
    let firstFailurePow = 0;
    while (true) {
      const pow = lastSuccessPow + 1;
      const amount = Math.pow(10, pow);
      console.log(`amount: ${amount}`);
      factories.FUEL.make(amount);
      if (factories.ORE.created > 1000000000000) {
        firstFailurePow = pow;
        break;
      }
      lastSuccessPow = pow;
      factories.ORE.reset();
      factories.FUEL.reset();
    }
    console.log(`Upper bound: ${Math.pow(10, lastSuccessPow)}`);
    console.log(`Lower bound: ${Math.pow(10, firstFailurePow)}`);
    return factories;
  })
  .then((factories) => {
    const max = 1000000000000;
    while (factories.ORE.created < max * 0.1) {
      factories.FUEL.make(1);
    }
    console.log(
      `Created ${factories.FUEL.created} FUEL -- maybe multiply by ten?`
    );
    return factories;
  })
  .then((factories) => {
    return factories.ORE.created;
  })
  .then((output) => {
    if (output !== undefined) {
      if (Array.isArray(output) || typeof output === "object") {
        console.log(JSON.stringify(output, null, 2));
      } else {
        console.log(output);
      }
    }
    process.exit(0);
  })
  .catch((ex) => {
    console.error(ex);
    process.exit(1);
  });
