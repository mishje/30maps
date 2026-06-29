# 30maps A-Traktor Navigator V6.6.8

GitHub Pages-ready statisk PWA för A-traktor-navigering.

## V6.6.8

Bygger vidare på V6.6.7.

Fixar/nytt:
- Tydligare inställningar:
  - “Spara” är nu “Spara bränsle”.
  - “Stäng av” är nu “Stäng av bränsle”.
  - Designläge och kartläge visar att de sparas direkt.
- Versionsbadgen är ren: ingen extra “Smart fallback”-text bredvid versionsnumret.
- Wake Lock försöker hålla skärmen vaken när navigation är aktiv.
- Mjukare övergång när användaren drar kartan från körläge:
  - följläge pausas mjukare
  - “Återgå till körläge”-knappen visas mjukare
  - återgång glider tillbaka till bilen
- Körläge startar mer inzoomat på telefon.
- Heading-up får turn-gate:
  - kartan tittar inte lika långt förbi en tydlig sväng för tidigt
  - ny riktning blandas in närmare själva svängen
- Ruttvalet får komfortlogik:
  - rakare/enklare vägar prioriteras mer
  - många kurvor, korta segment och många svängar straffas
  - onödiga småvägsgenvägar ska vinna mer sällan
- Omruttning försöker bli mer laglig/rimlig:
  - aktuell färdriktning används
  - direkta U-svängar straffas
  - flera startpunkter längre fram kan testas
  - rutten ska hellre fortsätta framåt till rimlig väg tillbaka

Behåller:
- V6.6.7: mjuk requestAnimationFrame-baserad heading-up-rotation.
- V6.6.6: route-corridor.
- V6.6.4: GPS-markören ligger längre ner i heading-up.
- V6.6.3: korrekt/inverterad bearing.
- V6.6.2: riktig Leaflet-rotation via `leaflet-rotate`.
- Kartlägen: Smart körvy och Färdriktning uppåt (beta).
- Cockpit och Klassisk design stöds.

Cache:
- `style.css?v=668`
- `app.js?v=668`
- `config.js?v=668`
- Service worker-cache: `30maps-v668`
