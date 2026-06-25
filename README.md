# 30maps A-Traktor Navigator V6.2

GitHub Pages-ready statisk PWA för A-traktor-navigering.

## V6.2

Bygger vidare på V6.1.

Nytt:
- “Visa steg” visar nu numrerade stegmarkörer på kartan.
- Siffrorna på kartan matchar stegen i stegrutan.
- När stegrutan stängs tas stegmarkörerna bort.
- Tryck på ett steg i listan flyttar/zoomar kartan till just det steget.
- Valt steg får tydlig highlight både i listan och på kartan.
- Ny liten inställningsknapp `⚙️` i sök/favorit-panelen.
- Bränsleberäkning med manuell medelförbrukning.
- Manuell literprisinställning.
- Bränsle/kostnad visas bara om medelförbrukning är ifylld.
- Ruttkortets storlek ändras inte; samma lilla metayta växlar/fadear mellan distans/tid och bränsle/kostnad.

Bränsle:
- Medelförbrukning anges i `L/mil`.
- Literpris anges i `kr/L`.
- Om literpris saknas visas bara ungefärlig bränsleåtgång.
- Om både medelförbrukning och literpris finns visas ungefärlig bränsleåtgång och kostnad.

Behåller:
- V6.1: ursprunglig OSRM/bilrutt bevaras över omruttning.
- V6.1: delat mål på telefon öppnar med sök/favorit-rutan minimerad.
- V6: `config.js` med `APP_BASE_URL`.
- V6: liten `↗ Dela`-knapp för mål.
- V5.9: smart framför-vy utan kartrotation.
- V5.8: fix för Starta navigation från utzoomad karta.
- V5.8: stabil “Tillbaka till körläge”-knapp.
- V5.7: ingen onödig svängkortsanimation.
- V5.6: hårt svängkortslås.

Cache:
- `style.css?v=62`
- `app.js?v=62`
- `config.js?v=62`
- Service worker-cache: `30maps-v62`
