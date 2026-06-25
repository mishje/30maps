# 30maps A-Traktor Navigator V6.2.1

GitHub Pages-ready statisk PWA för A-traktor-navigering.

## V6.2.1

Bygger vidare på V6.2.

Mobilpolish:
- Kompaktare ruttkort på telefon.
- Målnamnet i ruttkortet begränsas till max två rader.
- “Dela” i ruttkortet är nu en liten ikonknapp.
- Underraden i ruttkortet är kortare: vald ruttprofil + 30 km/h.
- Varningsrutan är kompaktare.
- “Visa avancerat och bilrutt” är mindre och tar mindre höjd.
- “Starta navigation” behålls stor och tydlig.
- “Spara mål” och “Visa alla steg” är lite lägre men fortfarande mobilvänliga.

Projekt:
- `HISTORY.md` skickas nu med i ZIP:en och ska uppdateras vid varje ny version.

Behåller:
- V6.2: numrerade stegmarkörer och klickbara steg.
- V6.2: bränsle/kostnad via inställningar.
- V6.1: ursprunglig OSRM/bilrutt bevaras över omruttning.
- V6.1: delat mål på telefon öppnar med sök/favorit-rutan minimerad.
- V6: `config.js` med `APP_BASE_URL`.
- V6: liten `↗ Dela`-knapp för mål.
- V5.9: smart framför-vy utan kartrotation.
- V5.8: fix för Starta navigation från utzoomad karta och stabil “Tillbaka till körläge”.
- V5.7: ingen onödig svängkortsanimation.
- V5.6: hårt svängkortslås.

Cache:
- `style.css?v=621`
- `app.js?v=621`
- `config.js?v=621`
- Service worker-cache: `30maps-v621`
