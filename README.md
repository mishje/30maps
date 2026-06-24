# 30maps A-Traktor Navigator V5.9

GitHub Pages-ready statisk PWA för A-traktor-navigering.

## V5.9

Bygger vidare på stabila V5.8. V.ROT-experimentet är inte med.

Ny körvy:
- Smart framför-vy utan kartrotation.
- Kartan är fortfarande norr upp.
- Appen räknar ut en punkt längre fram på den aktiva rutten.
- GPS-markören placeras lite bakom färdriktningen på skärmen.
- När man kör österut visas mer väg åt höger.
- När man kör västerut visas mer väg åt vänster.
- När man kör norrut visas mer väg uppåt.
- När man kör söderut flyttas markören högre upp, men hålls ovanför nedersta navigationsrutan.
- Om nästa sväng är flera km bort visas inte hela vägen till svängen; appen använder en begränsad framför-buffert.
- När en sväng närmar sig får kameran kika lite längre fram, men med maxgräns så den inte zoomar/ser för långt.
- Nära sväng blir vyn mer exakt igen.

Behåller:
- V5.8-fixen för Starta navigation från utzoomad karta.
- V5.8-fixen för stabil “Tillbaka till körläge”-knapp.
- V5.7-fixen för att stoppa onödig svängkortsanimation.
- V5.6:s hårda svängkortslås.

Cache:
- `style.css?v=59`
- `app.js?v=59`
- Service worker-cache: `30maps-v59`
