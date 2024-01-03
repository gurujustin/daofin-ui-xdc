import { utils, BigNumberish } from "ethers";

export function toEther(value: string) {
  return utils.formatEther(value);
}

export function toWei(value: string) {
  return utils.parseEther(value);
}

export function numberWithCommaSeparate(value: number | string) {
  return typeof value === "number"
    ? value.toLocaleString("en-US")
    : parseFloat(value).toLocaleString("en-US");
}

export function weiBigNumberToFormattedNumber(value: BigNumberish) {
  return numberWithCommaSeparate(toEther(value.toString()).toString());
}
