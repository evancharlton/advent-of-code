const data = (type = "") => {
  return require("./input")(__filename, "\n", type)[0];
};

const parseHex = (hex) => {
  log(`Parsing hex: ${hex}`);
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

const spaces = (num) => {
  let out = "";
  while (out.length < num) {
    out += " ";
  }
  return out;
};

const log = (...args) => {
  if (false) {
    console.log(...args);
  }
};

function parseBits(bits, maxPackets = Number.MAX_SAFE_INTEGER) {
  log(`Parsing bits: ${bits.join("")}`);
  let state = VERSION;

  const packet = {
    id: Date.now(),
  };
  const packets = [];
  let i = 0;
  while (i < bits.length && packets.length < maxPackets) {
    log(
      [bits.join(""), `${spaces(i)}^`, `state = ${state}, i = ${i}`, ""].join(
        "\n"
      ),
      packet,
      packets
    );
    switch (state) {
      case VERSION: {
        const version = Number.parseInt(
          [bits[i], bits[i + 1], bits[i + 2]].join(""),
          2
        );
        packet.version = version;
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
          packets.push(
            ...subpackets.map((p) => ({ ...p, parentId: packet.id }))
          );
          log(
            `Parsed ${subpacketSize} bits of subpackets into ${subpackets.length} packets`,
            packets
          );
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
          packets.push(
            ...subpackets.map((p) => ({ ...p, parentId: packet.id }))
          );
          i += consumedBits;
          log(
            `Parsed ${subpacketCount} subpackets into ${subpackets.length} packets`,
            packets
          );
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
      log("Flushing", packet);
      packets.push({ ...packet });
      packet.version = -1;
      packet.value = -1;
      packet.type = -1;
      packet.id = Date.now();
      state = VERSION;
    }
  }
  if (packet.value > 0) {
    packets.push({ ...packet });
  }
  const out = {
    packets,
    consumedBits: i,
  };
  log(`===>`, out);
  return out;
}

const part1 = (data) => {
  const { packets } = parseHex(data);
  log(packets);
  return packets.map(({ version }) => version).reduce((acc, v) => acc + v, 0);
};

const part2 = (data) => {
  return data;
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
