export function rollDie(n: number): number {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error("Argument must be a positive integer");
  }
  return Math.floor(Math.random() * n) + 1;
}

export function rollDice(...dice: number[]): number[] {
  return dice.map((n) => rollDie(n)).sort((a, b) => a - b);
}
