// stations.js — the cooking stations of Dim Sum Harbor.
// Three bamboo baskets stacked over the boiler, plus one wok for frying.
// A slot holds a single raw piece, cooks it on a timer, holds it in a
// short "ready" grace window, then ruins it. Collecting is explicit: the
// cook decides when a piece leaves the heat and lands on the plate.

import { ITEMS } from './recipes.js';

export const SLOT_COUNT = 4; // 0..2 bamboo baskets, 3 the wok

export function emptySlot() {
  return { item: null, elapsed: 0, state: 'empty' }; // empty|cooking|ready|ruined
}

export class Stations {
  constructor() {
    this.slots = [emptySlot(), emptySlot(), emptySlot(), emptySlot()];
  }

  slotFor(itemId) { return ITEMS[itemId].station === 'fry' ? 3 : -1; }

  // Put a raw piece on its station. Steamed pieces take the first free
  // basket; fried pieces take the wok. Returns false when nowhere is free.
  place(itemId) {
    const def = ITEMS[itemId];
    if (!def) return false;
    if (def.station === 'fry') {
      const s = this.slots[3];
      if (s.state !== 'empty') return false;
      s.item = itemId; s.elapsed = 0; s.state = 'cooking';
      return true;
    }
    for (let i = 0; i < 3; i++) {
      const s = this.slots[i];
      if (s.state === 'empty') {
        s.item = itemId; s.elapsed = 0; s.state = 'cooking';
        return true;
      }
    }
    return false;
  }

  tick(dt) {
    for (const s of this.slots) {
      if (s.state !== 'cooking' && s.state !== 'ready') continue;
      const def = ITEMS[s.item];
      s.elapsed += dt;
      if (s.state === 'cooking' && s.elapsed >= def.cook) s.state = 'ready';
      else if (s.state === 'ready' && s.elapsed >= def.cook + def.grace) s.state = 'ruined';
    }
  }

  // Progress 0..1 through the cooking phase (1 once ready or ruined).
  progress(slot) {
    if (slot.state === 'empty') return 0;
    const def = ITEMS[slot.item];
    return Math.min(1, slot.elapsed / def.cook);
  }

  // Fraction of the grace window left while ready (1 fresh, 0 ruined).
  graceLeft(slot) {
    if (slot.state !== 'ready') return 0;
    const def = ITEMS[slot.item];
    return Math.max(0, 1 - (slot.elapsed - def.cook) / def.grace);
  }

  // Take a ready piece off the heat. Returns the item id or null.
  collect(i) {
    const s = this.slots[i];
    if (s.state !== 'ready') return null;
    const id = s.item;
    this.slots[i] = emptySlot();
    return id;
  }

  // Throw a ruined piece away. Returns true when something was binned.
  discard(i) {
    const s = this.slots[i];
    if (s.state !== 'ruined') return false;
    this.slots[i] = emptySlot();
    return true;
  }

  clear() { this.slots = [emptySlot(), emptySlot(), emptySlot(), emptySlot()]; }
}
