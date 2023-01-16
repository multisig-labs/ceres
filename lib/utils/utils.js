import {
  constants as ethersConstants,
  utils as ethersUtils,
} from "npm:ethers@5.7.2";
import { DateTime } from "npm:luxon@3.2.1";

const ORC_STATE_MAP = {
  0: "Prelaunch",
  1: "ClaimMPStrt",
  2: "ClaimMPFin",
  3: "ExportC2PStrt",
  4: "ExportC2PFin",
  5: "ImportC2PStrt",
  6: "ImportC2PFin",
  7: "StakeMPStrt",
  8: "StakeMPFin",
  9: "RecStkStartStrt",
  10: "RecStkStartFin",
  11: "Validating",
  12: "ExportP2CStrt",
  13: "ExportP2CFin",
  14: "ImportP2CStrt",
  15: "ImportP2CFin",
  16: "RecStkEndStrt",
  17: "RecreateMPStrt",
  18: "RecStkErrStrt",
  19: "CancelMPStrt",
  20: "RecStkEndFin",
  21: "RecreateMPFin",
  22: "RecStkErrorFin",
  23: "CancelMPFin",
  24: "MPError",
};

const MINIPOOL_STATUS_MAP = {
  0: "Prelaunch",
  1: "Launched",
  2: "Staking",
  3: "Withdrawable",
  4: "Finished",
  5: "Canceled",
  6: "Error",
};

function makeRpc(method, params = {}) {
  const rpc = {
    id: 1,
    jsonrpc: "2.0",
    method,
    params,
  };

  return {
    method: "POST",
    body: JSON.stringify(rpc),
    headers: {
      "Content-Type": "application/json",
    },
  };
}

async function sha256(message) {
  const buffer = await window.crypto.subtle.digest("SHA-256", message.buffer);
  return new Uint8Array(buffer);
}

async function cb58Encode(message) {
  const payload = ethersUtils.arrayify(message);
  const checksum = await sha256(payload);
  const buffer = new Uint8Array(payload.length + 4);
  buffer.set(payload);
  buffer.set(checksum.slice(-4), payload.length);
  return ethersUtils.base58.encode(new Uint8Array(buffer));
}

async function cb58Decode(message) {
  const buffer = ethersUtils.base58.decode(message);
  const payload = buffer.slice(0, -4);
  const checksum = buffer.slice(-4);
  const newChecksum = (await sha256(payload)).slice(-4);

  if (
    (checksum[0] ^ newChecksum[0]) |
    (checksum[1] ^ newChecksum[1]) |
    (checksum[2] ^ newChecksum[2]) |
    (checksum[3] ^ newChecksum[3])
  ) {
    throw new Error("Invalid checksum");
  }
  return payload;
}

// Usage
// const pipeline = pipeAsyncFunctions(...fns);
// const promises = objs.map((obj) => pipeline(obj));
// const xobjs = await Promise.all(promises);
const pipeAsyncFunctions = (...fns) => (arg) =>
  fns.reduce((p, f) => p.then(f), Promise.resolve(arg));

// Generic formatters
const formatters = {
  formatEther: (v) =>
    parseFloat(ethersUtils.formatEther(v)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  formatAvax: (v) =>
    parseFloat(v / 1_000_000_000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  formatInflationAmt: (v) => {
    const newTokens = v[1].sub(v[0]);
    return ethersUtils.formatEther(newTokens).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  },
  formatEtherPct: (v) => {
    if (v.eq(ethersConstants.MaxUint256)) {
      return "∞";
    }

    const p = parseFloat(ethersUtils.formatEther(v)) * 100;
    return (
      p.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      }) + "%"
    );
  },

  formatMPStatus: (v) => MINIPOOL_STATUS_MAP[v],
  formatErrorMsg: (v) => ethersUtils.toUtf8String(ethersUtils.stripZeros(v)),
  labelAddress: (v, EOALabels) => EOALabels[v] || v,
  formatEtherAtTime: (v) => `${ethersUtils.formatEther(v[0])}@${v[1]}`,
  bigToNumber: (v) => v.toNumber(),
  unixToISOOnly: (v) => {
    if (v?.toNumber) v = v.toNumber();
    return DateTime.fromSeconds(v || 0).toLocaleString(DateTime.DATETIME_SHORT);
  },
  unixToISO: (v) => {
    if (v?.toNumber) v = v.toNumber();
    if (v === 0) return v;
    const dt = DateTime.fromSeconds(v || 0).toLocaleString(
      DateTime.DATETIME_SHORT,
    );
    return `${dt} (${v})`;
  },
};

export {
  cb58Decode,
  cb58Encode,
  formatters,
  makeRpc,
  MINIPOOL_STATUS_MAP,
  ORC_STATE_MAP,
  pipeAsyncFunctions,
  sha256,
};
