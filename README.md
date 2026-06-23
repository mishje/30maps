# 30maps A-Traktor Navigator V4.2 Beta v38-bas Beta

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


## V3.5

- Sök/favoritpanelen minimeras automatiskt när destination väljs via sökresultat, favorit eller senaste plats.
- Långtryck på kartan lämnas orört.
- Drag-funktionen för sök/favoritpanelen är borttagen.
- Den lilla dragindikatorn/plutten är borttagen.
- Panelen styrs bara med tryck på flärpen.
- Minimeringsanimationen för sök/favoritpanelen är mjukare och matchar öppningskänslan bättre.
- Ruttkortet behåller pop/slide-in när det först öppnas och slide/fade-out när det stängs.
- Ruttkortet spelar inte om öppningsanimationen när ny destination väljs medan kortet redan är öppet.
- Cache-busting uppdaterad till `style.css?v=35` och `app.js?v=35`.
- Service worker-cache uppdaterad till `30maps-v35`.


## V3.6

Smart A-traktor-routing:

- Appen beräknar nu flera Valhalla-rutter:
  - Strikt småväg
  - Balanserad A-traktor
  - Primärväg kort bit OK
- Den jämför rutterna och väljer den som bäst balanserar:
  - total distans
  - antal svängar
  - onödig omväg
  - hur hårt större vägar undviks
- Målet är att undvika små onödiga avstickare från t.ex. riksväg 27/122 när en kort bit på större väg är rimligare.
- Motorvägar/motortrafikleder undviks fortfarande hårt.
- Riksväg/primärväg kan accepteras kort bit om alternativet blir tydligt sämre.
- Cache-busting uppdaterad till `style.css?v=36` och `app.js?v=36`.
- Service worker-cache uppdaterad till `30maps-v36`.


## V3.7

Testversion med ny 30 km/h-logik:

- Slopar idén att riksväg/länsväg/primary/secondary automatiskt ska straffas.
- Appen jämför flera rutter och väljer den som är bäst för ett fordon som kör cirka 30 km/h.
- Kortare rimlig väg prioriteras före bilens snabbaste väg.
- Mindre väg väljs främst om den faktiskt sparar distans/tid vid 30 km/h.
- Större väg kan vara okej om den är kortare/enklare.
- Svängar straffas lätt, för att undvika onödiga kringelikrokar.
- Motorväg/motortrafikled ska fortfarande undvikas enligt skyltning; kontrollera alltid rutten.
- Cache-busting uppdaterad till `style.css?v=37` och `app.js?v=37`.
- Service worker-cache uppdaterad till `30maps-v37`.


## Temporär beta: blå bilrutt

- Visar vanlig bilrutt i blått som jämförelse.
- Visar vald 30 km/h/A-traktorrutt i grönt.
- Lägger till beta-badge uppe i hörnet: `BETA · v3.7 · blå = bilrutt`.
- Cache-busting uppdaterad till `style.css?v=37b` och `app.js?v=37b`.
- Service worker-cache uppdaterad till `30maps-v37-beta-carline`.


## V3.8 beta: OSRM-bilrutt som jämförelsekandidat

- OSRM:s vanliga bilrutt hämtas separat.
- OSRM-bilrutten visas i blått.
- Vald 30 km/h-rutt visas i grönt.
- OSRM-bilrutten får vara med i 30 km/h-score.
- Om OSRM-bilrutten är kortare/enklare vid 30 km/h kan den väljas.
- Detta hjälper fall där Valhalla inte hittar en rimlig väg, till exempel via Linneryd.
- Badge uppdaterad till `BETA · v3.8 · blå = OSRM-bilrutt`.
- Cache-busting uppdaterad till `style.css?v=38b` och `app.js?v=38b`.
- Service worker-cache uppdaterad till `30maps-v38-beta-osrm`.


## V4 beta, byggd på V3.8-basen

Den här versionen bygger på den bifogade V3.8 beta OSRM-versionen, eftersom den hittar rutter snabbare än V3.9.

Tillägg:
- När destination väljs på mobil minimeras sök/favoritpanelen alltid:
  - sök
  - favoriter
  - senaste
  - kartpunkt efter `Navigera hit`
- På dator/större skärm minimeras inte panelerna automatiskt, men de kan fortfarande minimeras manuellt.
- När man håller inne på kartan visas en markör/pil direkt på vald koordinat.
- Ingen rutt beräknas från kartpunkt förrän man trycker `Navigera hit`.
- Sök/favoriter har tydlig stängningsanimation.
- Ruttkortet har fram- och bortanimation.
- Ruttkortet spelar inte om öppningsanimationen när det redan är öppet och man byter destination.
- Cache-busting: `style.css?v=40v38` och `app.js?v=40v38`.
- Service worker-cache: `30maps-v40-v38base`.


## V4.1 beta, byggd på V3.8-basen

Ändringar:
- Den gula rutan visar nu bara enkel säkerhetstext som standard.
- Avancerad ruttjämförelse ligger bakom knappen `Visa avancerat och blå bilrutt`.
- Blå OSRM/bilrutt visas bara när avancerad info är öppen.
- När avancerad info döljs tas blå bilrutt bort igen.
- Ny animation för sök/favoritpanelen: innehållet öppnas/stängs mjukare i stället för att hela panelen flyttas.
- Cache-busting: `style.css?v=41v38` och `app.js?v=41v38`.
- Service worker-cache: `30maps-v41-v38base`.


## V4.2 beta, byggd på V3.8-basen

Ändringar:
- Sök/favorit-animationen är förenklad kraftigt.
- Den använder nu bara snabb fade på innehållet, utan blur, clip-path eller skalning.
- Kartdragning minimerar bara sök/favoriter på telefon/liten skärm.
- På dator/större skärm ligger sök/favoriter kvar när man drar runt kartan.
- Manuell minimering fungerar fortfarande på alla skärmstorlekar.
- Cache-busting: `style.css?v=42v38` och `app.js?v=42v38`.
- Service worker-cache: `30maps-v42-v38base`.
