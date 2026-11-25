// recipes.js — the Dim Sum Harbor menu: every dish the bamboo steamer house
// can serve, the raw ingredient it starts as, which station cooks it, how
// long it needs over the steam (or in the wok), how long it survives once
// done before it dries out, and what a finished piece earns on a plate.
//
// The house rules that shape the whole game live here:
//   * steamed pieces want the bamboo baskets, spring rolls want the wok;
//   * a ticket may ask for the same dish twice, so routes must be planned;
//   * tea is poured fresh at the plating bench and sauce is a small dish —
//     both are part of the ticket, not decoration.

// Raw pieces waiting on the counter, keyed by id. `cook` and `grace` are
// seconds: cook until ready, then grace seconds before it is ruined.
export const ITEMS = {
  siumai: {
    id: 'siumai', name: 'Siu Mai', detail: 'pork & prawn open-top',
    station: 'steam', cook: 6, grace: 5, price: 8,
  },
  hargow: {
    id: 'hargow', name: 'Har Gow', detail: 'prawn crystal crescent',
    station: 'steam', cook: 7, grace: 4, price: 9,
  },
  bao: {
    id: 'bao', name: 'Char Siu Bao', detail: 'barbecue pork bun',
    station: 'steam', cook: 9, grace: 6, price: 10,
  },
  cheungfun: {
    id: 'cheungfun', name: 'Cheung Fun', detail: 'rice roll, sweet soy',
    station: 'steam', cook: 5, grace: 4, price: 8,
  },
  springroll: {
    id: 'springroll', name: 'Spring Roll', detail: 'glass noodle, wok-fried',
    station: 'fry', cook: 5, grace: 4, price: 7,
  },
};

// Counter order, left to right, for the ingredient bins and number keys.
export const ITEM_ORDER = ['siumai', 'hargow', 'bao', 'cheungfun', 'springroll'];

// Teas are poured at the bench; a ticket names exactly one pot.
export const TEAS = [
  { id: 'jasmine', name: 'Jasmine Tea' },
  { id: 'oolong', name: 'Oolong Tea' },
  { id: 'chrys', name: 'Chrysanthemum Tea' },
];

// Sauces ride in the small dish on the plate; some tickets skip sauce.
export const SAUCES = [
  { id: 'soy', name: 'Dark Soy' },
  { id: 'chili', name: 'Chili Oil' },
  { id: 'mustard', name: 'Hot Mustard' },
];

export function teaById(id) { return TEAS.find((t) => t.id === id) || null; }
export function sauceById(id) { return SAUCES.find((s) => s.id === id) || null; }

// Coin value of a whole ticket's food (tea and sauce are included free —
// they decide the tip, not the base price).
export function ticketFoodPrice(items) {
  let total = 0;
  for (const [id, count] of Object.entries(items)) {
    total += (ITEMS[id] ? ITEMS[id].price : 0) * count;
  }
  return total;
}
