# Future upgrades

Ideas saved for later. Nothing here is built yet.

## Push notifications near a store
Alert shoppers when they arrive at a saved store, even with the app closed.
- Wait until the app is hosted with a server and database, or is an installed app.
  A web app only gets location while it is open on screen.
- The saved store locations ("Detect my store") can be reused for this.

## Price comparison between local stores
Show prices next to each item and an estimated total per store
(e.g. `Walmart ≈ $412 · Soriana ≈ $438`) so shoppers can choose where to go.
- Start with PROFECO "Quién es Quién en los Precios" open data for staples
  (check how current it is for the shopper's city first).
- After launch: shoppers share what they paid; later, prices from scanned receipts.
- Avoid scraping store websites (terms of use, fragile, online prices differ).
- Hard part: matching "milk" to a product. Use a typical product, let the shopper
  pick one once, and compare unit prices (per kg / per liter).
- Show how fresh each price is.

## Scan a receipt to build a list
Photo of a receipt, then a review screen with checkboxes, then add to the list or save as a list.
- Free prototype: Tesseract.js on the phone (more misreads on thermal receipts).
- Hosted version: AI vision through the server (key stays on the server), much more accurate.
- Skip non-item lines (prices, IVA, totals, address); expand receipt abbreviations
  (JIT → jitomate, DET → detergente); sort with the existing dictionary.
- Receipts also carry prices, store and date, which can feed price comparison (with consent).

## Recipe link to shopping list
Shopper pastes a recipe URL; the backend reads the ingredients; a review screen with checkboxes adds them to the list.
- Needs the server: browsers can't read other websites from the app.
- Most recipe sites (Kiwilimón, Cocina Fácil, blogs) include the standard schema.org Recipe data
  (`recipeIngredient`): free and reliable. Use AI on the page text only as a fallback.
- Clean each line into a list item: drop quantities, units and prep words
  ("2 cups all-purpose flour, sifted" → flour; keep the amount as a note), combine duplicates,
  leave staples (salt, pepper, oil, water) unchecked, sort with the existing dictionary.
- Option that works without a backend: paste the ingredient text itself and parse it on the phone.
