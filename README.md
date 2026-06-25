# 30maps A-Traktor Navigator V6.2.3

GitHub Pages-ready statisk PWA för A-traktor-navigering.

## V6.2.3

Bygger vidare på V6.2.2.

Fixar:
- “Tillbaka till körläge”-knappen ligger högre upp och ska inte hamna ovanpå nedersta körkortet.
- Knappen följer temat normalt:
  - ljust läge: ljus knapp med mörk text
  - mörkt läge: mörk knapp med ljus text
- Steglistan är kompaktare på telefon under aktiv navigation.
- Steglistan tar max cirka halva skärmen och innehållet scrollar.
- Mindre radhöjd, mindre padding och mindre siffermarkörer i stegrutan under aktiv navigation.
- Kartan/rutten ska vara lättare att se samtidigt som stegen är öppna.

Behåller:
- V6.2.2: metarad under toppknapparna i ruttkortet.
- V6.2.1: kompaktare ruttkort på telefon.
- V6.2: numrerade stegmarkörer och bränsle/kostnad via inställningar.
- V6.1: ursprunglig OSRM/bilrutt bevaras över omruttning.
- V6: `config.js` och delning av mål.

Cache:
- `style.css?v=623`
- `app.js?v=623`
- `config.js?v=623`
- Service worker-cache: `30maps-v623`
