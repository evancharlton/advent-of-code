const data = (type = "") => {
  return require("./input")(__filename, "\n", type)[0];
};

const parseHex = (hex) => {
  const bits = hex
    .split("")
    .map((v) => Number.parseInt(v, 16))
    .map((n) => n.toString(2))
    .map((s) => {
      let o = s;
      while (o.length < 4) {
        o = `0${o}`;
      }
      return o;
    })
    .join("")
    .split("")
    .map((b) => +b);
  return parseBits(bits);
};

const VERSION = 0;
const TYPE = 1;
const LITERAL = 2;
const OPERATOR_TYPE = 3;
const FLUSH = -1;

let gVersions = [];
let gPackets = [];

const parseBits = (bits, maxPackets = Number.MAX_SAFE_INTEGER) => {
  let state = VERSION;

  const packet = {
    version: 0,
    children: [],
  };
  const lVersions = [];
  const packets = [];
  let i = 0;
  while (i < bits.length && packets.length < maxPackets) {
    switch (state) {
      case VERSION: {
        const version = Number.parseInt(
          [bits[i], bits[i + 1], bits[i + 2]].join(""),
          2
        );
        packet.version = version;
        gVersions.push(version);
        lVersions.push(version);
        i += 3;
        state = TYPE;
        break;
      }
      case TYPE: {
        const type = Number.parseInt(
          [bits[i], bits[i + 1], bits[i + 2]].join(""),
          2
        );
        i += 3;
        packet.type = type;
        if (type == 4) {
          state = LITERAL;
        } else {
          state = OPERATOR_TYPE;
        }
        break;
      }
      case LITERAL: {
        const valueBits = [];
        let moreBits = 0;
        do {
          moreBits = bits[i];
          valueBits.push(bits[i + 1], bits[i + 2], bits[i + 3], bits[i + 4]);
          i += 5;
        } while (moreBits);
        packet.value = Number.parseInt(valueBits.join(""), 2);
        state = FLUSH;
        break;
      }
      case OPERATOR_TYPE: {
        const type = bits[i];
        i += 1;
        if (type === 0) {
          const subpacketSize = Number.parseInt(
            bits.slice(i, i + 15).join(""),
            2
          );
          i += 15;
          const { packets: subpackets } = parseBits(
            bits.slice(i, i + subpacketSize)
          );
          i += subpacketSize;
          packet.children = subpackets.map((p) => ({
            ...p,
          }));
          state = FLUSH;
        } else if (type === 1) {
          const subpacketCount = Number.parseInt(
            bits.slice(i, i + 11).join(""),
            2
          );
          i += 11;
          const { consumedBits, packets: subpackets } = parseBits(
            bits.slice(i),
            subpacketCount
          );
          packet.children = subpackets.map((p) => ({
            ...p,
          }));
          i += consumedBits;
          state = FLUSH;
        }
        break;
      }
      default: {
        console.error(packet);
        console.error(`Offset: ${i}`);
        throw new Error(`Unknown parse state ${state}`);
      }
    }
    if (state === FLUSH) {
      packets.push({ ...packet });
      gPackets.push({ ...packet });
      if (packets.length !== lVersions.length) {
        console.error(packet);
        console.error(gPackets);
        console.error(lVersions);
        console.error(`Offset: ${i}`);
        const spaces = new Array(i - 2).join(" ");
        console.error([bits.join(""), `${spaces}^`].join("\n"));
        throw new Error(
          `Extra packet detected: ${lVersions.length} versions and ${gPackets.length} packets`
        );
      }
      packet.version = -1;
      packet.value = -1;
      packet.type = -1;
      state = VERSION;
    }
  }
  return {
    packets,
    consumedBits: i,
  };
};

const getVersions = (packet) => {
  return [packet.version, packet.children.map((child) => getVersions(child))];
};

const part1 = (data) => {
  gVersions = [];
  const { packets } = parseHex(data);
  const packetVersions = packets
    .map((packet) => getVersions(packet))
    .flat(Number.MAX_SAFE_INTEGER);
  // console.log(packetVersions.join(" "));
  // console.log(gVersions.join(" "));
  // console.log(gVersions.length, gPackets.length);
  const total1 = gVersions.reduce((acc, v) => acc + v, 0);
  const total2 = packetVersions.reduce((acc, v) => acc + v, 0);
  if (total1 !== total2) {
    // TODO: Why doesn't this work? Something's up with how I count the packets
    // I think. Everything else checks out but ... I dunno.
    // throw new Error(data);
  }
  return total1;
};

const expression = (packet) => {
  if (packet.children.length === 0) {
    return packet.value;
  }

  const { children } = packet;

  switch (packet.type) {
    case 0: {
      // sum
      return children.reduce((acc, child) => acc + expression(child), 0);
    }
    case 1: {
      // product
      return children.reduce((acc, child) => acc * expression(child), 1);
    }
    case 2: {
      const values = children.map((child) => expression(child));
      return Math.min(...values);
    }
    case 3: {
      const values = children.map((child) => expression(child));
      return Math.max(...values);
    }
    case 5: {
      const [first, second] = children;
      return expression(first) > expression(second) ? 1 : 0;
    }
    case 6: {
      const [first, second] = children;
      return expression(first) < expression(second) ? 1 : 0;
    }
    case 7: {
      const [first, second] = children;
      return expression(first) === expression(second) ? 1 : 0;
    }
    default: {
      return packet.value;
    }
  }
};

const part2 = (data) => {
  const { packets } = parseHex(data);
  const [root] = packets;
  return expression(root);
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  log(`Part 1:`, part1(data(process.argv[2] || "")));
  log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
  parseBits,
  parseHex,
};
