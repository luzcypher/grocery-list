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

## Supabase backend (foundation for the items below)
- Tables: trip_items, lists + list_items, stores (route order + location), item_sections, user_settings.
- Hook into the single `save()` function; keep the dictionary and sorting on the phone.
- Needs: sign-in (SMS/WhatsApp code or email link), a permanent ID per item, offline-first sync
  (keep saving on the phone, sync when there is signal), row-level security, and a one-time upload
  of each shopper's existing phone data on first sign-in.

## Shared family lists
A family shares one list; anyone can add or check off items and everyone sees it live (Supabase realtime).
- Invite family members to a list; each person still has their own private lists.

## The same list on every device
Sign in on any phone or computer and see the same trip, saved lists, stores and section choices.
The data survives getting a new phone.

## Instant push when someone adds to a shared list
Example: he is at the store; she remembers milk and adds it to the family list at home.
His phone gets a push right away ("Ana added milk to Family list"), even if the app is closed.
- Sent by the server when an item is added to a shared list (not to the person who added it).
- Group several quick adds into one push so it doesn't buzz five times.
- Let each person turn these off, or only get them while "at the store" (pairs with Detect my store).

## Split one list across several stores
People buy meat where it's cheap and snacks where they're on sale, so one list spans several stores.
- **Store tags:** while adding an item, quickly tag a store (Milk → Costco, Rib eyes → Sam's Club).
  Untagged items mean "any store". Tag from the item edit screen too.
- **Filter by where you're standing:** with "Detect my store" (already built), opening the app at Costco
  shows only Costco items plus untagged ones, with a "Show all" switch. Picking a store in the
  dropdown filters the same way. This part needs no server and can be built any time.
- **AI trip split (premium):** Claude looks at the whole list and suggests the cheapest way to split
  the trip between two nearby stores ("Buy meat and cleaning at Sam's, the rest at Soriana, save about $180").
  Needs real prices per store (see price comparison) and the server to hold the AI key.
  Should weigh savings against the extra trip, and let the shopper apply the split as store tags in one tap.

## AI meal ideas (upgrade to the built-in Meal idea button)
The Meal idea button already works offline with ~50 built-in meals: it finds a meal that is exactly one
ingredient away from the unchecked items and offers to add it.
- AI version: send the unchecked items to Claude through the server and get a suggestion for any cuisine,
  using everything on the list, with a short recipe.
- Could respect preferences (vegetarian, budget, kid-friendly) and suggest a full week of meals.

## "Running low?" restock suggestions: next steps
The phone-only version is built: it learns from checked-off items, shows a faint "Running low on milk?"
bar on the usual day, adds with one tap, snoozes with "Not now", and has a private habits screen.
Still to do once the other upgrades exist:
- Shared family lists: learn from the whole household's purchases.
- Store tags: suggest the item at the store where it is usually bought.
- Supabase: keep the habit profile in the shopper's own account so it survives a new phone.

## iPhone and Android apps in the stores
Wrap the web app as a real app for both the Apple App Store and Google Play using Capacitor
(same web code inside a native app).
- Unlocks native features from this list: push notifications (family list alerts, near-store alerts
  with the app closed), background location, camera (receipt scanning), haptics, home-screen widgets.
- Needs: Google Play developer account (~$25 USD once), Apple developer account (~$99 USD/year),
  a Mac with Xcode or a cloud build service for iPhone builds, store listings in English and Spanish,
  app icons and splash screens.
- Apple can reject "a website in a box"; shipping it with native features (push, location, camera)
  makes approval much more likely.

## Lista Mandado look: built
Name Lista Mandado, mercado colors with automatic dark mode, Bricolage Grotesque title and Nunito text
(stored in the app, both SIL Open Font License), papel picado icon in all sizes, color bars per section,
add box and mic in a bottom bar.
- Still to do before the stores: check "Lista Mandado" in both stores and the IMPI trademark register,
  reserve the name in App Store Connect, store screenshots and listing text in English and Spanish.

## Barcode scanning
Scan an empty package at home to add it to the list. Needs the camera, so it fits the store apps.
Look up the product name from the barcode (an open product database or the shopper's own past scans).

## Voice assistant shortcuts
"Hey Google, add milk to Lista Mandado" / Siri Shortcuts. Needs the store apps (Android App Actions, iOS Shortcuts).

## Built from the suggestions list (for reference)
WhatsApp sharing, quantities and notes (also by voice: "dos kilos de tortillas"), spending tracker
(price per checked item, trip and quincena totals, last price remembered), deal-day reminders per store,
"At home" pantry (checked-off items land there; meal ideas use it), large text mode.
- Later with the server: spending and prices feed price comparison; family members share At home.
