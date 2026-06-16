// PHB 2024 Point-Buy cost table — score → points
// Total budget = 27. All abilities start at 8.
export const POINT_BUY_COST = {
  8:  0,
  9:  1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

export const POINT_BUY_BUDGET = 27;
export const POINT_BUY_MIN = 8;
export const POINT_BUY_MAX = 15;

/** Returns the cost of buying all 6 ability scores. */
export function totalCost(scores) {
  return Object.values(scores).reduce((sum, s) => sum + (POINT_BUY_COST[s] ?? Infinity), 0);
}

/** Returns remaining points (budget − totalCost). Negative = over-budget. */
export function pointsRemaining(scores) {
  return POINT_BUY_BUDGET - totalCost(scores);
}

/** Validates a score is in valid range. */
export function isValidScore(score) {
  return score >= POINT_BUY_MIN && score <= POINT_BUY_MAX;
}
