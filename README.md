# Gashgiran Souvenir — Phase 1 Frontend

Plain HTML/CSS/JS single-page app (hash-based routing, no build step, no
dependencies to install).

## Run it
Just open `index.html` directly in a browser, or in VS Code use the
**Live Server** extension (right-click `index.html` → "Open with Live Server")
for auto-reload while editing.

## Structure
```
index.html        — page shell, nav, footer
css/style.css      — all styles (brand colors as CSS variables at the top)
js/app.js          — product/gift-box data, router, page templates, cart logic
assets/logo.jpeg   — your brand logo
```

## Where things live in app.js
- `PRODUCTS`, `GIFTBOXES`, `CATS` — edit these arrays to add/change products
- `route()` — the hash router; add new pages here
- Page builder functions (`Home()`, `Shop()`, `ProductPage()`, `Account()`, etc.) — one per route, return HTML strings
- `bindDynamic()` — wires up click handlers after each page renders
- Cart persists via `localStorage` under the key `gg_cart`

## Notes
- All prices are placeholder PKR values — update in `PRODUCTS`/`GIFTBOXES`.
- Checkout payment methods are UI-only; wiring them to real gateways is the
  Phase 2 backend (see the separate `gashgiran-payments` backend scaffold).
- No frameworks/build tools — safe to open straight in VS Code and edit live.
