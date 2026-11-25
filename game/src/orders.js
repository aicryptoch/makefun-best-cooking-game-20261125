// orders.js — the ticket rail at Dim Sum Harbor.
// Owns the seeded random source, builds new tickets from the menu (harder
// combinations as the shift heats up), ages every ticket's patience bar,
// and drops tickets whose guests walked away.

import { ITEM_ORDER, TEAS, SAUCES, ticketFoodPrice } from './recipes.js';

// Small deterministic generator so screenshot scenes and replays agree.
export function makeRng(seed) {
  let a = (seed >>> 0) || 1;
  return function rng() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let nextTicketId = 1;

// Build one ticket. `heat` is 0 at opening and rises toward 1 late in the
// shift: more distinct dishes per ticket, more doubles, shorter patience.
export function makeTicket(rng, heat) {
  const distinct = rng() < 0.35 + heat * 0.45 ? 3 : 2;
  const pool = [...ITEM_ORDER];
  const items = {};
  for (let i = 0; i < distinct; i++) {
    const pick = pool.splice(Math.floor(rng() * pool.length), 1)[0];
    items[pick] = rng() < 0.22 + heat * 0.25 ? 2 : 1;
  }
  const tea = TEAS[Math.floor(rng() * TEAS.length)].id;
  const sauce = rng() < 0.72 ? SAUCES[Math.floor(rng() * SAUCES.length)].id : null;
  const patienceMax = Math.round(52 - heat * 16 + rng() * 10);
  return {
    id: nextTicketId++,
    items,
    tea,
    sauce,
    patience: patienceMax,
    patienceMax,
    reward: ticketFoodPrice(items),
  };
}

// The rail itself: at most `capacity` tickets hang at once.
export class OrderRail {
  constructor(capacity = 3) {
    this.capacity = capacity;
    this.tickets = [];
  }

  get full() { return this.tickets.length >= this.capacity; }

  add(ticket) {
    if (this.full) return false;
    this.tickets.push(ticket);
    return true;
  }

  remove(id) {
    const i = this.tickets.findIndex((t) => t.id === id);
    if (i >= 0) this.tickets.splice(i, 1);
  }

  // Age every ticket; returns the tickets that expired this tick.
  tick(dt) {
    const expired = [];
    for (const t of this.tickets) {
      t.patience -= dt;
      if (t.patience <= 0) expired.push(t);
    }
    if (expired.length) {
      const gone = new Set(expired.map((t) => t.id));
      this.tickets = this.tickets.filter((t) => !gone.has(t.id));
    }
    return expired;
  }

  // Does this plate satisfy the ticket exactly? Returns 'ok' or a reason.
  matchPlate(ticket, plate) {
    for (const [id, need] of Object.entries(ticket.items)) {
      if ((plate.items[id] || 0) !== need) return 'food';
    }
    for (const id of Object.keys(plate.items)) {
      if (!(id in ticket.items)) return 'food';
    }
    if (plate.tea !== ticket.tea) return 'tea';
    if (plate.sauce !== ticket.sauce) return 'sauce';
    return 'ok';
  }
}

export function resetTicketIds() { nextTicketId = 1; }
