// input.js — hands and keys for Dim Sum Harbor.
// Mouse: click a raw bin to start a piece cooking, click a basket or the
// wok to plate (or bin) what is inside, click tea and sauce to set the
// plate, click a ticket to target it, SERVE / BIN PLATE buttons.
// Keyboard: 1–5 raw pieces, 6–8 teas, Space/Enter serve, Backspace bin
// the plate, Q/W/E/R collect from baskets 1–3 and the wok, T restart.

import { LAYOUT, basketRect } from './render.js';
import { ITEM_ORDER, TEAS, SAUCES } from './recipes.js';

function inside(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

// Translate a canvas click into a game action object (or null).
export function clickAction(x, y, view) {
  for (let i = 0; i < ITEM_ORDER.length; i++) {
    if (inside(x, y, LAYOUT.bins[i])) return { type: 'place', item: ITEM_ORDER[i] };
  }
  for (let i = 0; i < 3; i++) {
    if (inside(x, y, basketRect(i))) return { type: 'collect', slot: i };
  }
  if (inside(x, y, LAYOUT.wok)) return { type: 'collect', slot: 3 };
  for (let i = 0; i < TEAS.length; i++) {
    if (inside(x, y, LAYOUT.teaBtns[i])) return { type: 'tea', tea: TEAS[i].id };
  }
  for (let i = 0; i < SAUCES.length; i++) {
    if (inside(x, y, LAYOUT.sauceBtns[i])) return { type: 'sauce', sauce: SAUCES[i].id };
  }
  if (inside(x, y, LAYOUT.serveBtn)) return { type: 'serve' };
  if (inside(x, y, LAYOUT.binBtn)) return { type: 'binPlate' };
  // tickets on the rail
  for (let i = 0; i < view.tickets.length; i++) {
    const r = {
      x: LAYOUT.rail.x, y: 106 + i * (LAYOUT.rail.ticketH + LAYOUT.rail.gap),
      w: LAYOUT.rail.w, h: LAYOUT.rail.ticketH,
    };
    if (inside(x, y, r)) return { type: 'select', ticketId: view.tickets[i].id };
  }
  return null;
}

// Translate a key press into a game action object (or null).
export function keyAction(key) {
  if (key >= '1' && key <= '5') {
    return { type: 'place', item: ITEM_ORDER[Number(key) - 1] };
  }
  if (key >= '6' && key <= '8') {
    return { type: 'tea', tea: TEAS[Number(key) - 6].id };
  }
  switch (key) {
    case ' ': case 'Enter': return { type: 'serve' };
    case 'Backspace': return { type: 'binPlate' };
    case 'q': case 'Q': return { type: 'collect', slot: 0 };
    case 'w': case 'W': return { type: 'collect', slot: 1 };
    case 'e': case 'E': return { type: 'collect', slot: 2 };
    case 'r': case 'R': return { type: 'collect', slot: 3 };
    case 't': case 'T': return { type: 'restart' };
    default: return null;
  }
}

// Wire a canvas to the game's action handler.
export function attachInput(canvas, getView, onAction) {
  canvas.addEventListener('click', (ev) => {
    const rect = canvas.getBoundingClientRect();
    const x = (ev.clientX - rect.left) * (canvas.width / rect.width);
    const y = (ev.clientY - rect.top) * (canvas.height / rect.height);
    const view = getView();
    if (view.gameOver) { onAction({ type: 'restart' }); return; }
    const action = clickAction(x, y, view);
    if (action) onAction(action);
  });
  window.addEventListener('keydown', (ev) => {
    const view = getView();
    if (view.gameOver) {
      if (ev.key === 't' || ev.key === 'T' || ev.key === 'Enter') onAction({ type: 'restart' });
      return;
    }
    const action = keyAction(ev.key);
    if (action) {
      if (action.type === 'serve' || action.type === 'binPlate') ev.preventDefault();
      onAction(action);
    }
  });
}
