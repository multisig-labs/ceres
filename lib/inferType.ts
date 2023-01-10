// deno-lint-ignore-file no-explicit-any

import { BigNumber } from "npm:ethers@5.7.2";

const inferType = (value: any): string => {
  const type = typeof value;
  if (type === "object") {
    if (Array.isArray(value)) {
      return "array";
    }
    if (BigNumber.isBigNumber(value)) {
      return "bigNumber";
    }
    return "object";
  }
  return type;
};

export default inferType;
