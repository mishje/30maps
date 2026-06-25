# 30maps A-Traktor Navigator V6.6.7

GitHub Pages-ready statisk PWA för A-traktor-navigering.

## V6.6.7

Bygger vidare på V6.6.6.

Fixar:
- Heading-up roterar mjukare när den väl roterar.
- Kartans target-bearing och faktisk map-bearing separeras.
- `requestAnimationFrame` används för att glida kartans bearing mot target i små steg.
- Rotationens hastighet är adaptiv:
  - små ändringar glider lugnare
  - större riktningsändringar får komma ikapp snabbare men utan hopp
- Route-corridor från V6.6.6 behålls.
- Smart körvy påverkas inte.

Behåller:
- V6.6.6: route-corridor för att ignorera små böjar som går tillbaka.
- V6.6.4: GPS-markören ligger längre ner i heading-up.
- V6.6.3: korrekt/inverterad bearing.
- V6.6.2: riktig Leaflet-rotation via `leaflet-rotate`.
- Kartlägen: Smart körvy och Färdriktning uppåt (beta).
- Cockpit och Klassisk design stöds.

Cache:
- `style.css?v=667`
- `app.js?v=667`
- `config.js?v=667`
- Service worker-cache: `30maps-v667`
