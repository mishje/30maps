# 30maps A-Traktor Navigator V6.4

GitHub Pages-ready statisk PWA för A-traktor-navigering.

## V6.4

Bygger vidare på V6.3.1.

Nytt/fix:
- Stegrutan är mindre på telefon under aktiv navigation.
- Vid många steg visas ungefär 1–4 steg åt gången och resten scrollas.
- Stegrutan ligger fortsatt precis ovanför nedersta “km kvar”-kortet.
- “Tillbaka till körläge” hamnar fortsatt ovanför stegrutan när stegrutan är öppen.
- Smart körvy beta:
  - fordonspilens riktning hämtas i första hand från rutten framför bilen när navigation är aktiv
  - GPS-heading används som fallback
  - rörelse mellan GPS-punkter används som sista fallback
  - riktningen mjukas ut för att minska ryck
- Förbättringarna är gjorda så de fungerar i både Cockpit och Klassisk design.

Viktigt:
- Detta är inte full kartrotation/färdriktning-uppåt ännu. Kartan är fortfarande stabil nord-upp, men fordonspilen och körvyn använder en smartare färdriktning.

Cache:
- `style.css?v=64`
- `app.js?v=64`
- `config.js?v=64`
- Service worker-cache: `30maps-v64`
