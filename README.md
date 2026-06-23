# 30maps A-Traktor Navigator V3.4

Mobilvänlig GitHub Pages/PWA-version optimerad för iPhone 13.

## Viktiga funktioner

- Destination väljs först.
- Startpunkt visas först efter vald destination.
- Startpunkt är från början Min position men kan ändras.
- Håll inne på kartan för att välja plats.
- Kartval kan användas som destination, startpunkt eller favorit.
- Koordinater fylls i fältet när kartpunkt väljs som destination.
- Rensa rensar rutt och textfält.
- Menyn fade:ar in efter GPS-centrering.
- Sökförslag begränsas till Sverige.
- Sökförslag sorteras efter avstånd från GPS-position.
- Favoriter och senaste platser sparas i localStorage.
- Mörkt läge.
- Starta navigation-läge.
- Stor nästa-sväng-ruta.
- Avstånd till nästa sväng.
- Kvarvarande avstånd och uppskattad tid.
- Automatisk omrutting när du hamnar långt från rutten.
- Visa alla steg-för-steg-instruktioner.
- Bättre felmeddelanden.

## Routing

Appen använder Valhalla först och OSRM som reserv.

Valhalla är inställt för att kraftigt nedprioritera motorvägar och hålla topphastighet kring 30 km/h.
En statisk GitHub Pages-app kan inte garantera juridiskt perfekta A-traktorrutter. Följ alltid skyltning och trafikregler.

## GitHub Pages

Lägg filerna direkt i repots rot:

- index.html
- app.js
- style.css
- manifest.json
- service-worker.js
- README.md
- icons/icon-192.png
- icons/icon-512.png

Aktivera sedan:

Settings -> Pages -> Deploy from branch -> main -> / (root)

## iPhone

Öppna GitHub Pages-länken i Safari och välj:

Dela -> Lägg till på hemskärmen

Tillåt platsåtkomst.


## V3.3

- Sök/favoritpanelen kan minimeras med handtaget.
- Panelen minimeras automatiskt när kartan dras.
- Panelen minimeras automatiskt vid långtryck på kartan.
- Panelen kan dras/tryckas tillbaka med flärpen.
- Knappar har tunn outline.
- Textmarkering vid långtryck på kartan minskas, men inputfält fungerar fortfarande normalt.


## V3.3.1

Hotfix: minimerad sök-/favoritpanel lämnar inte längre en tom ruta.


## V3.3.2

Hardfix: minimerad sök-/favoritpanel tvingas nu till 58px höjd så den inte lämnar en stor tom ruta.


## V3.4

- Cache-busting i `index.html`: `style.css?v=34` och `app.js?v=34`.
- Ny service worker-cache: `30maps-v34`.
- Dolda horisontella scrollbars för favoriter/senaste.
- Mjukare minimera/öppna-känsla för sök-/favoritpanelen.
- Centrerad text i panelhandtaget.
- Route-kortet har öppningsanimation och stängningsanimation.
- Route-kortet animerar inte om när det redan är öppet och destinationen byts.
- Route-kortet har kryss uppe till höger som rensar rutten.
- Route-kortet blir kompakt när sök-/favoritpanelen är öppen och fullt när panelen är minimerad.
- Långtryck på kartan tvingar inte längre bort sök-/favoritpanelen.
