# 30maps A-Traktor Navigator V6.1

GitHub Pages-ready statisk PWA för A-traktor-navigering.

## V6.1

Bygger vidare på V6.

Fixar:
- Den ursprungliga OSRM/bilrutten sparas nu separat när första rutten räknas.
- Vid felkörning/omruttning bevaras den ursprungliga OSRM/bilrutten, precis som den ursprungliga valda 30maps-rutten.
- När originalrutten visas igen kan den blå bilrutten också komma från den ursprungliga OSRM/bilrutten.
- Den ursprungliga OSRM/bilrutten rensas först när man rensar rutten eller väljer ett nytt mål.
- När ett delat mål öppnas på telefon/liten skärm startar sök/favorit-rutan minimerad.
- Desktop/större skärm lämnas fortsatt öppen.

Behåller:
- V6: `config.js` med `APP_BASE_URL`.
- V6: liten `↗ Dela`-knapp för mål.
- V5.9: smart framför-vy utan kartrotation.
- V5.8: fix för Starta navigation från utzoomad karta.
- V5.8: stabil “Tillbaka till körläge”-knapp.
- V5.7: ingen onödig svängkortsanimation.
- V5.6: hårt svängkortslås.

Cache:
- `style.css?v=61`
- `app.js?v=61`
- `config.js?v=61`
- Service worker-cache: `30maps-v61`
