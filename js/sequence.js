import { meanings } from "./data.js";

export function resolveSequence(values) {
  const cycle = Object.keys(meanings).length;
  let cumulative = 0;

  return values.map((value) => {
    cumulative += value;
    const normalized = ((cumulative - 1) % cycle + cycle) % cycle;
    return normalized + 1;
  });
}

export function scoreTone(sequence) {
  return sequence.reduce((score, num) => {
    const tone = meanings[num]?.tone;
    if (tone === "吉") return score + 1;
    if (tone === "凶") return score - 1;
    return score;
  }, 0);
}

