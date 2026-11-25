# Dim Sum Harbor — Bamboo Steamer House

A harbour-side dim sum kitchen game. You run a bamboo steamer house for
one 3-minute shift: tickets land on the rail, each asking for a
combination of steamed pieces, a pot of tea and a sauce. Stack raw siu
mai, har gow, char siu bao and cheung fun into the three bamboo baskets,
fry spring rolls in the wok, watch the steam — plate every piece inside
its ready window before it dries out, pour the right tea, pick the right
sauce, and serve before the table's patience runs dry. Late tables cost
strikes; three strikes close the house.

## How to play

- **Start a piece cooking:** click a raw piece on the bottom counter
  (or press `1`–`5`). Steamed pieces take the first free bamboo basket;
  spring rolls go to the wok.
- **Plate it:** when a basket flashes READY, click it (or `Q` / `W` /
  `E` for baskets 1–3, `R` for the wok) to move the piece onto the
  plate. Too slow and it dries out — click a ruined piece to bin it.
- **Finish the plate:** click a teapot (`6`–`8`) to pour the tea the
  ticket names, and a sauce dish to add the sauce.
- **Serve:** click the ticket you are serving to target it, then SERVE
  (or `Space`). Exact match only — food, tea and sauce must all agree.
  Faster service earns a bigger tip.
- **Bin the plate** with the BIN PLATE button (or `Backspace`) when a
  plate goes wrong. `T` restarts the shift.

Route planning matters: baskets are shared, cook times differ (a bao
needs 9 s over the steam, a cheung fun only 5 s), and late in the shift
tickets arrive faster with shorter patience.

## Layout of the source

- `game/src/recipes.js` — the menu: dishes, stations, cook/grace times.
- `game/src/orders.js` — the ticket rail, patience, plate matching.
- `game/src/stations.js` — the three bamboo baskets and the wok.
- `game/src/render.js` — all canvas drawing (kitchen, food, tickets).
- `game/src/input.js` — mouse and keyboard mapping.
- `game/src/main.js` — the shift loop and the staged screenshot scenes
  (`?shot=cover|rush|serve&seed=N`).

[![make.fun bounty](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
![rank](https://make.fun/badge/best-cooking-game-20261125-0137/aicryptoch/makefun-best-cooking-game-20261125/rank.svg)
![reward](https://make.fun/badge/best-cooking-game-20261125-0137/aicryptoch/makefun-best-cooking-game-20261125/reward.svg)
Bounty: https://make.fun/bounty/best-cooking-game-20261125-0137
