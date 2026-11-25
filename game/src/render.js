// render.js — every pixel of Dim Sum Harbor is drawn here, in code.
// A harbour-side teahouse kitchen: ticket rail on the left, the bamboo
// steamer tower and wok in the middle, the plating bench on the right,
// the pass under the rail, and the raw-ingredient counter along the
// bottom. No image assets: dumplings, buns, pots and lanterns are all
// canvas shapes, so the screenshots the judges see are the game itself.

import { ITEMS, ITEM_ORDER, TEAS, SAUCES, teaById, sauceById } from './recipes.js';

export const W = 1280;
export const H = 800;

// ---- layout (shared with input.js) -------------------------------------
export const LAYOUT = {
  hud: { x: 0, y: 0, w: W, h: 64 },
  rail: { x: 16, y: 80, w: 300, ticketH: 148, gap: 12 },
  pass: { x: 16, y: 592, w: 300, h: 192 },
  basketX: 372, basketW: 252, basketH: 92,
  basketY: [418, 320, 222], // slot 0 bottom .. slot 2 top
  wok: { x: 656, y: 428, w: 150, h: 128 },
  plate: { cx: 1047, cy: 238, r: 104 },
  teaBtns: TEAS.map((_, i) => ({ x: 838 + i * 144, y: 392, w: 130, h: 62 })),
  sauceBtns: SAUCES.map((_, i) => ({ x: 838 + i * 144, y: 466, w: 130, h: 52 })),
  serveBtn: { x: 838, y: 532, w: 202, h: 56 },
  binBtn: { x: 1054, y: 532, w: 202, h: 56 },
  bins: ITEM_ORDER.map((_, i) => ({ x: 340 + i * 186, y: 640, w: 176, h: 144 })),
  counterY: 624,
};

export function basketRect(i) {
  return { x: LAYOUT.basketX, y: LAYOUT.basketY[i], w: LAYOUT.basketW, h: LAYOUT.basketH };
}

// ---- small drawing helpers ----------------------------------------------
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, s, x, y, size, color, align = 'left', weight = 'bold') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Verdana, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

function bar(ctx, x, y, w, h, frac, back, fill) {
  ctx.fillStyle = back; rr(ctx, x, y, w, h, h / 2); ctx.fill();
  if (frac > 0.005) {
    ctx.fillStyle = fill;
    rr(ctx, x, y, Math.max(h, w * Math.min(1, frac)), h, h / 2); ctx.fill();
  }
}

function patienceColor(frac) {
  return frac > 0.5 ? '#7fc46a' : frac > 0.25 ? '#e8b64c' : '#e05d4c';
}

// ---- the food itself ------------------------------------------------------
// One piece of dim sum, centred on (x, y), drawn about s pixels wide.
// mode: 'raw' (pale, on the counter), 'cooked' (glossy, ready), 'ruined'.
export function drawItem(ctx, id, x, y, s, mode = 'cooked') {
  const u = s / 40; // unit: drawings are authored on a 40px grid
  ctx.save();
  ctx.translate(x, y);
  const dim = mode === 'raw' ? 0.82 : 1;
  if (id === 'siumai') {
    ctx.fillStyle = mode === 'ruined' ? '#4a4238' : '#e8c85a';
    ctx.beginPath();
    ctx.moveTo(-13 * u, 8 * u); ctx.lineTo(13 * u, 8 * u);
    ctx.lineTo(9 * u, -8 * u); ctx.lineTo(-9 * u, -8 * u);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = mode === 'ruined' ? '#38312a' : '#d98a4b';
    ctx.beginPath(); ctx.ellipse(0, -8 * u, 9 * u, 3.6 * u, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = mode === 'ruined' ? '#2e2a24' : '#e2703a';
    ctx.beginPath(); ctx.arc(0, -9 * u, 2.6 * u, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'hargow') {
    ctx.fillStyle = mode === 'ruined' ? '#55504a' : 'rgba(246,240,228,0.95)';
    ctx.beginPath();
    ctx.moveTo(-15 * u, 7 * u);
    ctx.quadraticCurveTo(0, -16 * u, 15 * u, 7 * u);
    ctx.quadraticCurveTo(0, 1 * u, -15 * u, 7 * u);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = mode === 'ruined' ? '#3c3833' : '#d9c9a8';
    ctx.lineWidth = 1.4 * u; ctx.stroke();
    ctx.fillStyle = mode === 'ruined' ? '#403b35' : 'rgba(238,150,130,0.75)';
    ctx.beginPath(); ctx.ellipse(0, 2 * u, 8 * u, 3.4 * u, 0, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'bao') {
    ctx.fillStyle = mode === 'ruined' ? '#5a5148' : '#f7f1e3';
    ctx.beginPath(); ctx.arc(0, 1 * u, 13.5 * u, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = mode === 'ruined' ? '#403a33' : '#ddcfb2';
    ctx.lineWidth = 1.6 * u;
    ctx.beginPath(); ctx.arc(0, -3 * u, 6 * u, Math.PI * 0.9, Math.PI * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -3 * u, 3 * u, Math.PI * 1.1, Math.PI * 2.1); ctx.stroke();
    if (mode === 'cooked') {
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath(); ctx.ellipse(-5 * u, -6 * u, 4 * u, 2.4 * u, -0.6, 0, Math.PI * 2); ctx.fill();
    }
  } else if (id === 'cheungfun') {
    for (let i = -1; i <= 1; i++) {
      ctx.fillStyle = mode === 'ruined' ? '#575046' : '#f3ecdc';
      rr(ctx, -15 * u, (i * 8 - 4) * u, 30 * u, 7 * u, 3.5 * u); ctx.fill();
      ctx.strokeStyle = mode === 'ruined' ? '#3e382f' : '#d8c8a4';
      ctx.lineWidth = 1 * u; ctx.stroke();
    }
    ctx.strokeStyle = mode === 'ruined' ? '#33291d' : '#7a4a21';
    ctx.lineWidth = 1.8 * u;
    ctx.beginPath();
    ctx.moveTo(-13 * u, -6 * u); ctx.quadraticCurveTo(0, -1 * u, 13 * u, -7 * u);
    ctx.moveTo(-13 * u, 3 * u); ctx.quadraticCurveTo(0, 8 * u, 13 * u, 2 * u);
    ctx.stroke();
  } else if (id === 'springroll') {
    ctx.fillStyle = mode === 'ruined' ? '#4c4034' : '#d99a3c';
    rr(ctx, -15 * u, -6 * u, 30 * u, 12 * u, 6 * u); ctx.fill();
    ctx.strokeStyle = mode === 'ruined' ? '#33291f' : '#a96f22';
    ctx.lineWidth = 1.4 * u;
    for (const dx of [-8, 0, 8]) {
      ctx.beginPath(); ctx.moveTo(dx * u, -6 * u); ctx.lineTo(dx * u, 6 * u); ctx.stroke();
    }
    if (mode === 'cooked') {
      ctx.fillStyle = 'rgba(255,230,170,0.55)';
      rr(ctx, -12 * u, -5 * u, 24 * u, 3.4 * u, 1.7 * u); ctx.fill();
    }
  }
  if (mode === 'raw') {
    ctx.fillStyle = 'rgba(190,205,215,0.18)';
    ctx.beginPath(); ctx.arc(0, 0, 16 * u, 0, Math.PI * 2); ctx.fill();
  }
  if (mode === 'ruined') {
    ctx.fillStyle = 'rgba(20,16,12,0.35)';
    ctx.beginPath(); ctx.arc(0, 0, 16 * u, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  return dim;
}

function drawTeapot(ctx, x, y, s, teaId, active) {
  ctx.save(); ctx.translate(x, y);
  const body = teaId === 'jasmine' ? '#b8452e' : teaId === 'oolong' ? '#3f6d5a' : '#c9962e';
  ctx.fillStyle = active ? body : '#6d6a60';
  ctx.beginPath(); ctx.ellipse(0, 2, s * 0.30, s * 0.24, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-s * 0.28, 0); ctx.lineTo(-s * 0.44, -s * 0.10); ctx.lineTo(-s * 0.27, -s * 0.10); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = active ? body : '#6d6a60'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(s * 0.10, -s * 0.02, s * 0.20, -0.4, 1.5); ctx.stroke();
  ctx.fillStyle = '#2c2c28';
  ctx.beginPath(); ctx.ellipse(0, -s * 0.22, s * 0.10, s * 0.045, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawSauceDish(ctx, x, y, s, sauceId, active) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#e9e2d0';
  ctx.beginPath(); ctx.ellipse(0, 0, s * 0.34, s * 0.16, 0, 0, Math.PI * 2); ctx.fill();
  const c = sauceId === 'soy' ? '#3a2413' : sauceId === 'chili' ? '#c33d21' : '#e3b93c';
  ctx.fillStyle = active ? c : '#8b867a';
  ctx.beginPath(); ctx.ellipse(0, -1, s * 0.25, s * 0.105, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// ---- scene pieces ----------------------------------------------------------
function drawRoom(ctx, view) {
  // teahouse wall: deep jade panels, warm wood trim
  ctx.fillStyle = '#1d2f26'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#24402f'; ctx.fillRect(0, 64, W, H - 64);
  ctx.fillStyle = 'rgba(255,214,150,0.05)';
  for (let x = 40; x < W; x += 160) ctx.fillRect(x, 64, 70, H - 64);
  // harbour window behind the steamer tower: water, a junk boat, dusk sky
  ctx.save();
  ctx.beginPath(); ctx.arc(575, 138, 62, 0, Math.PI * 2); ctx.clip();
  const sky = ctx.createLinearGradient(0, 76, 0, 200);
  sky.addColorStop(0, '#e8975a'); sky.addColorStop(0.55, '#c96f4a'); sky.addColorStop(0.56, '#3f6d6a'); sky.addColorStop(1, '#2c4f4e');
  ctx.fillStyle = sky; ctx.fillRect(513, 76, 124, 124);
  ctx.fillStyle = '#5d2f22';
  ctx.beginPath();
  ctx.moveTo(540, 168); ctx.lineTo(612, 168); ctx.lineTo(600, 180); ctx.lineTo(552, 180); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e8d9ae';
  ctx.beginPath(); ctx.moveTo(576, 166); ctx.lineTo(576, 128); ctx.lineTo(598, 166); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = '#8a6a35'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(575, 138, 62, 0, Math.PI * 2); ctx.stroke();
  // hanging lanterns
  for (const lx of [368, 782]) {
    ctx.strokeStyle = '#0f1a14'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(lx, 64); ctx.lineTo(lx, 92); ctx.stroke();
    ctx.fillStyle = '#c33d21';
    ctx.beginPath(); ctx.ellipse(lx, 112, 17, 21, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e8b64c'; ctx.fillRect(lx - 8, 90, 16, 5); ctx.fillRect(lx - 8, 130, 16, 5);
    ctx.fillStyle = 'rgba(232,182,76,0.16)';
    ctx.beginPath(); ctx.arc(lx, 112, 34, 0, Math.PI * 2); ctx.fill();
  }
  // floor boards
  ctx.fillStyle = '#3a2c1e'; ctx.fillRect(0, LAYOUT.counterY, W, H - LAYOUT.counterY);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2;
  for (let x = 0; x < W; x += 90) { ctx.beginPath(); ctx.moveTo(x, LAYOUT.counterY); ctx.lineTo(x, H); ctx.stroke(); }
}

function drawHud(ctx, view) {
  ctx.fillStyle = '#101c15'; ctx.fillRect(0, 0, W, 64);
  ctx.fillStyle = '#c9962e'; ctx.fillRect(0, 62, W, 2);
  text(ctx, 'DIM SUM HARBOR', 18, 26, 24, '#f0d089');
  text(ctx, 'Bamboo Steamer House', 18, 50, 12.5, '#9db8a4', 'left', 'normal');
  // shift clock plaque
  ctx.fillStyle = '#243528'; rr(ctx, 470, 8, 340, 48, 10); ctx.fill();
  ctx.strokeStyle = '#c9962e'; ctx.lineWidth = 2; rr(ctx, 470, 8, 340, 48, 10); ctx.stroke();
  const left = Math.max(0, Math.ceil(view.shiftLeft));
  const mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, '0');
  text(ctx, `SHIFT  ${mm}:${ss}`, 640, 33, 27, left <= 30 ? '#e05d4c' : '#f5e7bd', 'center');
  text(ctx, `COINS ${view.coins}`, 1050, 22, 17, '#e8b64c', 'right');
  text(ctx, `SCORE ${view.score}`, 1050, 46, 15, '#dfe8d8', 'right');
  text(ctx, `SERVED ${view.served}`, 1262, 22, 15, '#9db8a4', 'right');
  // strikes as crossed lanterns
  text(ctx, 'STRIKES', 1262, 46, 12, '#9db8a4', 'right', 'normal');
  for (let i = 0; i < 3; i++) {
    const x = 1158 + i * 22, y = 46;
    ctx.fillStyle = i < view.strikes ? '#e05d4c' : '#3c5546';
    ctx.beginPath(); ctx.ellipse(x, y, 7, 8.5, 0, 0, Math.PI * 2); ctx.fill();
    if (i < view.strikes) {
      ctx.strokeStyle = '#101c15'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x - 5, y - 6); ctx.lineTo(x + 5, y + 6);
      ctx.moveTo(x + 5, y - 6); ctx.lineTo(x - 5, y + 6); ctx.stroke();
    }
  }
}

function drawTicket(ctx, t, x, y, w, selected) {
  const h = LAYOUT.rail.ticketH;
  ctx.fillStyle = selected ? '#fdf6dd' : '#f3ead2';
  rr(ctx, x, y, w, h, 8); ctx.fill();
  ctx.strokeStyle = selected ? '#c9962e' : '#a08c5a'; ctx.lineWidth = selected ? 3 : 1.5;
  rr(ctx, x, y, w, h, 8); ctx.stroke();
  text(ctx, `TICKET #${t.id}`, x + 12, y + 17, 14.5, '#4a3820');
  text(ctx, `${t.reward}c`, x + w - 12, y + 17, 14.5, '#8a6a1d', 'right');
  // food rows: mini pieces with counts
  const entries = Object.entries(t.items);
  entries.forEach(([id, n], i) => {
    const cx = x + 30 + i * 62;
    drawItem(ctx, id, cx, y + 52, 34, 'cooked');
    text(ctx, `x${n}`, cx + 20, y + 52, 14, '#4a3820');
    text(ctx, ITEMS[id].name.split(' ')[0].toUpperCase(), cx, y + 78, 8.5, '#7a6742', 'center', 'normal');
  });
  // tea + sauce line
  const tea = teaById(t.tea);
  drawTeapot(ctx, x + 24, y + 104, 34, t.tea, true);
  text(ctx, tea ? tea.name : '', x + 44, y + 104, 12, '#4a3820', 'left', 'normal');
  if (t.sauce) {
    const sc = sauceById(t.sauce);
    drawSauceDish(ctx, x + 176, y + 104, 34, t.sauce, true);
    text(ctx, sc ? sc.name : '', x + 196, y + 104, 12, '#4a3820', 'left', 'normal');
  } else {
    text(ctx, 'no sauce', x + 196, y + 104, 12, '#9a8a68', 'left', 'normal');
  }
  // patience bar
  const frac = Math.max(0, t.patience / t.patienceMax);
  bar(ctx, x + 12, y + h - 18, w - 24, 10, frac, '#d8cba6', patienceColor(frac));
  text(ctx, `${Math.ceil(t.patience)}s`, x + w - 12, y + h - 30, 11, '#7a6742', 'right', 'normal');
}

function drawRail(ctx, view) {
  text(ctx, 'ORDER RAIL — click a ticket to target it', LAYOUT.rail.x + 2, 92, 12.5, '#cfe0cd');
  view.tickets.forEach((t, i) => {
    const y = 106 + i * (LAYOUT.rail.ticketH + LAYOUT.rail.gap);
    drawTicket(ctx, t, LAYOUT.rail.x, y, LAYOUT.rail.w, t.id === view.selectedTicketId);
  });
  if (!view.tickets.length) {
    text(ctx, 'no tickets — the harbour is quiet…', LAYOUT.rail.x + 8, 130, 13, '#7d9683', 'left', 'normal');
  }
}

function drawBasket(ctx, slot, i, view) {
  const r = basketRect(i);
  // bamboo body: woven bands
  ctx.fillStyle = '#c8a35e'; rr(ctx, r.x, r.y, r.w, r.h, 12); ctx.fill();
  ctx.fillStyle = '#b89047';
  for (let k = 0; k < 4; k++) ctx.fillRect(r.x + 6, r.y + 12 + k * 22, r.w - 12, 5);
  ctx.strokeStyle = '#8a6a35'; ctx.lineWidth = 3; rr(ctx, r.x, r.y, r.w, r.h, 12); ctx.stroke();
  ctx.fillStyle = '#e3c07a'; rr(ctx, r.x, r.y, r.w, 14, 7); ctx.fill();
  text(ctx, `BASKET ${i + 1}`, r.x + 12, r.y + 26, 11.5, '#5d451a');
  if (slot.state === 'empty') {
    text(ctx, 'empty — click a raw piece below', r.x + r.w / 2, r.y + 58, 12.5, '#7a5f2c', 'center', 'normal');
    return;
  }
  const mode = slot.state === 'ruined' ? 'ruined' : slot.state === 'ready' ? 'cooked' : 'raw';
  drawItem(ctx, slot.item, r.x + 58, r.y + 58, 46, mode);
  text(ctx, ITEMS[slot.item].name, r.x + 92, r.y + 46, 14.5, '#43320f');
  if (slot.state === 'cooking') {
    const p = view.stations.progress(slot);
    bar(ctx, r.x + 92, r.y + 72, r.w - 108, 11, p, '#8a6a35', '#7fc46a');
    text(ctx, 'steaming…', r.x + 92, r.y + 60, 11, '#5d451a', 'left', 'normal');
    // steam wisps
    ctx.strokeStyle = 'rgba(240,244,238,0.5)'; ctx.lineWidth = 2.5;
    for (let k = 0; k < 2; k++) {
      const sx = r.x + 40 + k * 26;
      ctx.beginPath();
      ctx.moveTo(sx, r.y - 2);
      ctx.quadraticCurveTo(sx + 6, r.y - 14, sx, r.y - 24);
      ctx.stroke();
    }
  } else if (slot.state === 'ready') {
    const g = view.stations.graceLeft(slot);
    bar(ctx, r.x + 92, r.y + 72, r.w - 108, 11, g, '#8a6a35', g > 0.4 ? '#a8d86a' : '#e05d4c');
    text(ctx, 'READY — click to plate!', r.x + 92, r.y + 60, 12, '#2e5d1e');
  } else if (slot.state === 'ruined') {
    text(ctx, 'DRIED OUT — click to bin it', r.x + 92, r.y + 58, 12.5, '#7a2418');
  }
}

function drawWok(ctx, slot, view) {
  const r = LAYOUT.wok;
  text(ctx, 'WOK — spring rolls', r.x + r.w / 2, r.y - 12, 12.5, '#cfe0cd', 'center');
  // burner + flame
  ctx.fillStyle = '#22282a'; rr(ctx, r.x + 18, r.y + 96, r.w - 36, 22, 6); ctx.fill();
  ctx.fillStyle = '#e2703a';
  ctx.beginPath();
  ctx.moveTo(r.x + 48, r.y + 98); ctx.lineTo(r.x + 66, r.y + 74); ctx.lineTo(r.x + 80, r.y + 98);
  ctx.lineTo(r.x + 92, r.y + 78); ctx.lineTo(r.x + 104, r.y + 98);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f0b84c';
  ctx.beginPath(); ctx.moveTo(r.x + 62, r.y + 98); ctx.lineTo(r.x + 76, r.y + 84); ctx.lineTo(r.x + 90, r.y + 98); ctx.closePath(); ctx.fill();
  // wok bowl
  ctx.fillStyle = '#39424a';
  ctx.beginPath();
  ctx.moveTo(r.x, r.y + 30);
  ctx.quadraticCurveTo(r.x + r.w / 2, r.y + 108, r.x + r.w, r.y + 30);
  ctx.lineTo(r.x + r.w - 10, r.y + 26); ctx.lineTo(r.x + 10, r.y + 26);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#4d5963'; ctx.fillRect(r.x - 4, r.y + 20, r.w + 8, 9);
  if (slot.state === 'empty') {
    text(ctx, 'wok idle', r.x + r.w / 2, r.y + 52, 12, '#93a5ad', 'center', 'normal');
    return;
  }
  const mode = slot.state === 'ruined' ? 'ruined' : slot.state === 'ready' ? 'cooked' : 'raw';
  drawItem(ctx, 'springroll', r.x + r.w / 2, r.y + 44, 52, mode);
  if (slot.state === 'cooking') {
    bar(ctx, r.x + 8, r.y + 122 - 14, r.w - 16, 10, view.stations.progress(slot), '#20262a', '#e8b64c');
  } else if (slot.state === 'ready') {
    bar(ctx, r.x + 8, r.y + 108, r.w - 16, 10, view.stations.graceLeft(slot), '#20262a', '#a8d86a');
    text(ctx, 'READY!', r.x + r.w / 2, r.y + 66, 13, '#a8d86a', 'center');
  } else {
    text(ctx, 'BURNT — click to bin', r.x + r.w / 2, r.y + 66, 11.5, '#e05d4c', 'center');
  }
}

function drawTower(ctx, view) {
  text(ctx, 'BAMBOO STEAMER TOWER', 372, 92, 12.5, '#cfe0cd');
  // boiler under the stack
  ctx.fillStyle = '#5a4632'; rr(ctx, 388, 516, 220, 52, 10); ctx.fill();
  ctx.fillStyle = '#e2703a';
  ctx.beginPath();
  ctx.moveTo(440, 570); ctx.lineTo(470, 540); ctx.lineTo(492, 570); ctx.lineTo(516, 544); ctx.lineTo(540, 570);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f0b84c';
  ctx.beginPath(); ctx.moveTo(466, 570); ctx.lineTo(488, 550); ctx.lineTo(510, 570); ctx.closePath(); ctx.fill();
  // lid resting on the top basket
  ctx.fillStyle = '#a8823f';
  ctx.beginPath(); ctx.ellipse(498, 216, 118, 20, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#8a6a35'; ctx.beginPath(); ctx.arc(498, 196, 9, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 3; i++) drawBasket(ctx, view.stations.slots[i], i, view);
  drawWok(ctx, view.stations.slots[3], view);
  text(ctx, 'baskets steam siu mai · har gow · bao · cheung fun', 372, 606, 11.5, '#7d9683', 'left', 'normal');
}

const PLATE_SPOTS = [
  [0, -38], [-44, -6], [44, -6], [-24, 34], [24, 34], [0, 2],
];

function drawPlateContents(ctx, plate, cx, cy, scale = 1) {
  const pieces = [];
  for (const [id, n] of Object.entries(plate.items)) {
    for (let k = 0; k < n; k++) pieces.push(id);
  }
  pieces.slice(0, 6).forEach((id, i) => {
    const [dx, dy] = PLATE_SPOTS[i];
    drawItem(ctx, id, cx + dx * scale, cy + dy * scale, 44 * scale, 'cooked');
  });
  if (plate.tea) drawTeapot(ctx, cx + 74 * scale, cy + 56 * scale, 40 * scale, plate.tea, true);
  if (plate.sauce) drawSauceDish(ctx, cx - 74 * scale, cy + 58 * scale, 38 * scale, plate.sauce, true);
  return pieces.length;
}

function drawBench(ctx, view) {
  text(ctx, 'PLATING BENCH', 838, 92, 12.5, '#cfe0cd');
  const { cx, cy, r } = LAYOUT.plate;
  // bench board
  ctx.fillStyle = '#4a3826'; rr(ctx, 826, 104, 438, 296, 14); ctx.fill();
  ctx.strokeStyle = '#2e2115'; ctx.lineWidth = 3; rr(ctx, 826, 104, 438, 296, 14); ctx.stroke();
  // the plate
  ctx.fillStyle = '#efe8d6';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#b8452e'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, r - 9, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#d8cba6'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx, cy, r - 20, 0, Math.PI * 2); ctx.stroke();
  const n = drawPlateContents(ctx, view.plate, cx, cy, 1);
  if (n === 0 && !view.plate.tea && !view.plate.sauce) {
    text(ctx, 'plate is empty', cx, cy - 8, 14, '#9a8a68', 'center', 'normal');
    text(ctx, 'plate cooked pieces, pour tea, add sauce', cx, cy + 16, 11.5, '#9a8a68', 'center', 'normal');
  }
  // info line
  const tea = view.plate.tea ? teaById(view.plate.tea).name : 'no tea yet';
  const sauce = view.plate.sauce ? sauceById(view.plate.sauce).name : 'no sauce';
  text(ctx, `On the plate:  ${tea}  ·  ${sauce}`, 838, 420 - 44, 13, '#dfe8d8');
  // tea buttons
  TEAS.forEach((t, i) => {
    const b = LAYOUT.teaBtns[i];
    const active = view.plate.tea === t.id;
    ctx.fillStyle = active ? '#33523f' : '#26392c'; rr(ctx, b.x, b.y, b.w, b.h, 9); ctx.fill();
    ctx.strokeStyle = active ? '#e8b64c' : '#4d6a58'; ctx.lineWidth = 2; rr(ctx, b.x, b.y, b.w, b.h, 9); ctx.stroke();
    drawTeapot(ctx, b.x + 28, b.y + 30, 40, t.id, true);
    text(ctx, t.name.replace(' Tea', ''), b.x + 52, b.y + 24, 13, '#f0e6c8');
    text(ctx, `key ${i + 6}`, b.x + 52, b.y + 44, 10.5, '#8fae97', 'left', 'normal');
  });
  // sauce buttons
  SAUCES.forEach((s, i) => {
    const b = LAYOUT.sauceBtns[i];
    const active = view.plate.sauce === s.id;
    ctx.fillStyle = active ? '#33523f' : '#26392c'; rr(ctx, b.x, b.y, b.w, b.h, 9); ctx.fill();
    ctx.strokeStyle = active ? '#e8b64c' : '#4d6a58'; ctx.lineWidth = 2; rr(ctx, b.x, b.y, b.w, b.h, 9); ctx.stroke();
    drawSauceDish(ctx, b.x + 28, b.y + 26, 42, s.id, true);
    text(ctx, s.name, b.x + 54, b.y + 26, 12.5, '#f0e6c8');
  });
  // serve / bin buttons
  const sb = LAYOUT.serveBtn;
  ctx.fillStyle = '#b8452e'; rr(ctx, sb.x, sb.y, sb.w, sb.h, 10); ctx.fill();
  ctx.strokeStyle = '#7e2c1c'; ctx.lineWidth = 2; rr(ctx, sb.x, sb.y, sb.w, sb.h, 10); ctx.stroke();
  text(ctx, 'SERVE  (Space)', sb.x + sb.w / 2, sb.y + sb.h / 2, 17, '#fdf3e0', 'center');
  const bb = LAYOUT.binBtn;
  ctx.fillStyle = '#26392c'; rr(ctx, bb.x, bb.y, bb.w, bb.h, 10); ctx.fill();
  ctx.strokeStyle = '#4d6a58'; ctx.lineWidth = 2; rr(ctx, bb.x, bb.y, bb.w, bb.h, 10); ctx.stroke();
  text(ctx, 'BIN PLATE  (⌫)', bb.x + bb.w / 2, bb.y + bb.h / 2, 15.5, '#cfe0cd', 'center');
}

function drawPass(ctx, view) {
  const p = LAYOUT.pass;
  text(ctx, 'THE PASS — last dish out', p.x + 2, p.y - 10, 12.5, '#cfe0cd');
  ctx.fillStyle = '#4a3826'; rr(ctx, p.x, p.y, p.w, p.h, 12); ctx.fill();
  ctx.strokeStyle = '#2e2115'; ctx.lineWidth = 3; rr(ctx, p.x, p.y, p.w, p.h, 12); ctx.stroke();
  ctx.fillStyle = '#6d5133'; ctx.fillRect(p.x + 10, p.y + 108, p.w - 20, 8);
  if (view.passPlate) {
    ctx.fillStyle = '#efe8d6';
    ctx.beginPath(); ctx.arc(p.x + 92, p.y + 66, 52, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b8452e'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(p.x + 92, p.y + 66, 45, 0, Math.PI * 2); ctx.stroke();
    drawPlateContents(ctx, view.passPlate, p.x + 92, p.y + 66, 0.52);
    text(ctx, view.passText || 'served!', p.x + 158, p.y + 48, 14.5, '#f0d089');
    text(ctx, 'steaming & ready to eat', p.x + 158, p.y + 72, 11.5, '#c9b183', 'left', 'normal');
  } else {
    text(ctx, 'nothing served yet —', p.x + 16, p.y + 52, 13.5, '#a68d5f', 'left', 'normal');
    text(ctx, 'the first happy table appears here', p.x + 16, p.y + 76, 12, '#a68d5f', 'left', 'normal');
  }
  text(ctx, `shift earnings so far: ${view.coins} coins`, p.x + 16, p.y + 148, 13, '#e8b64c');
  text(ctx, '3 strikes or the clock ends the shift', p.x + 16, p.y + 170, 11, '#8fae97', 'left', 'normal');
}

function drawCounter(ctx, view) {
  text(ctx, 'RAW COUNTER — click a piece (or keys 1–5) to start it cooking', 340, LAYOUT.counterY + 2, 12.5, '#cfe0cd');
  ITEM_ORDER.forEach((id, i) => {
    const b = LAYOUT.bins[i];
    const def = ITEMS[id];
    ctx.fillStyle = '#2c4636'; rr(ctx, b.x, b.y, b.w, b.h, 10); ctx.fill();
    ctx.strokeStyle = '#55755f'; ctx.lineWidth = 2; rr(ctx, b.x, b.y, b.w, b.h, 10); ctx.stroke();
    // bamboo tray
    ctx.fillStyle = '#c8a35e'; rr(ctx, b.x + 18, b.y + 34, b.w - 36, 52, 9); ctx.fill();
    ctx.fillStyle = '#b89047'; ctx.fillRect(b.x + 24, b.y + 48, b.w - 48, 4); ctx.fillRect(b.x + 24, b.y + 64, b.w - 48, 4);
    drawItem(ctx, id, b.x + b.w / 2 - 20, b.y + 60, 46, 'raw');
    drawItem(ctx, id, b.x + b.w / 2 + 22, b.y + 60, 46, 'raw');
    text(ctx, def.name, b.x + b.w / 2, b.y + 104, 14.5, '#f0e6c8', 'center');
    text(ctx, def.station === 'fry' ? `wok ${def.cook}s · ${def.price}c` : `steam ${def.cook}s · ${def.price}c`,
      b.x + b.w / 2, b.y + 124, 11.5, '#9db8a4', 'center', 'normal');
    text(ctx, `${i + 1}`, b.x + 10, b.y + 16, 13, '#e8b64c');
  });
}

function drawMessage(ctx, view) {
  if (!view.message || view.messageT <= 0) return;
  const a = Math.min(1, view.messageT / 0.4);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = '#101c15'; rr(ctx, 390, 100, 500, 44, 10); ctx.fill();
  ctx.strokeStyle = '#c9962e'; ctx.lineWidth = 2; rr(ctx, 390, 100, 500, 44, 10); ctx.stroke();
  text(ctx, view.message, 640, 122, 16.5, '#f5e7bd', 'center');
  ctx.restore();
}

function drawCoverBanner(ctx) {
  ctx.fillStyle = 'rgba(13,22,17,0.55)'; ctx.fillRect(0, 64, W, 118);
  ctx.fillStyle = '#b8452e'; rr(ctx, 240, 78, 800, 66, 12); ctx.fill();
  ctx.strokeStyle = '#e8b64c'; ctx.lineWidth = 3; rr(ctx, 240, 78, 800, 66, 12); ctx.stroke();
  text(ctx, 'DIM SUM HARBOR', 640, 106, 37, '#fdf3e0', 'center');
  text(ctx, 'BAMBOO STEAMER HOUSE', 640, 136, 15, '#f0d089', 'center');
  text(ctx, 'stack the baskets · mind the steam · plate it hot', 640, 168, 13.5, '#dfe8d8', 'center', 'normal');
}

function drawGameOver(ctx, view) {
  ctx.fillStyle = 'rgba(10,16,12,0.78)'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#1d2f26'; rr(ctx, 390, 250, 500, 280, 16); ctx.fill();
  ctx.strokeStyle = '#c9962e'; ctx.lineWidth = 3; rr(ctx, 390, 250, 500, 280, 16); ctx.stroke();
  text(ctx, 'SHIFT OVER', 640, 306, 34, '#f0d089', 'center');
  text(ctx, view.strikes >= 3 ? 'three tables walked out…' : 'the harbour lights go down', 640, 344, 14.5, '#cfe0cd', 'center', 'normal');
  text(ctx, `score ${view.score}   ·   coins ${view.coins}   ·   served ${view.served}`, 640, 396, 19, '#f5e7bd', 'center');
  text(ctx, 'press T or click to reopen the house', 640, 462, 15, '#9db8a4', 'center', 'normal');
}

// ---- the whole frame -------------------------------------------------------
export function drawScene(ctx, view) {
  ctx.clearRect(0, 0, W, H);
  drawRoom(ctx, view);
  drawRail(ctx, view);
  drawTower(ctx, view);
  drawBench(ctx, view);
  drawPass(ctx, view);
  drawCounter(ctx, view);
  drawHud(ctx, view);
  if (view.shot === 'cover') drawCoverBanner(ctx);
  drawMessage(ctx, view);
  if (view.gameOver) drawGameOver(ctx, view);
}
