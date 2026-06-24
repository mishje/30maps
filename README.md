# 30maps A-Traktor Navigator V6

GitHub Pages-ready statisk PWA för A-traktor-navigering.

## V6

Bygger vidare på stabila V5.9. V.ROT-experimentet är inte med.

Nytt:
- Start på 6-serien.
- Ny `config.js` där appens basadress finns samlad.
- Nuvarande basadress:
  - `https://mishje.github.io/30maps/`
- Om domän/sökväg ändras senare behöver `APP_BASE_URL` ändras i `config.js`.
- Liten `↗ Dela`-knapp för mål.
- Delning skickar bara destinationen:
  - latitud
  - longitud
  - måltext/label
- Delning skickar inte användarens GPS-position, startpunkt, vald rutt eller OSRM/bilrutt.
- På mobil används Web Share API om det stöds.
- Om Web Share API inte fungerar kopieras länken i stället.
- Delade länkar öppnas via hash:
  - `#dest=lat,lon&label=namn`
- När en delad länk öppnas fyller appen i målet, markerar det på kartan och räknar rutt när GPS finns.

Placering:
- I ruttkortet finns en liten absolut placerad `↗ Dela`-knapp.
- I Vald plats-rutan finns en liten `↗ Dela`-knapp.
- Knappen är kompakt för att inte förstora rutorna mer än nödvändigt.

Behåller:
- V5.9 smart framför-vy utan kartrotation.
- V5.8-fixen för Starta navigation från utzoomad karta.
- V5.8-fixen för stabil “Tillbaka till körläge”-knapp.
- V5.7-fixen för att stoppa onödig svängkortsanimation.
- V5.6:s hårda svängkortslås.

Inte gjort i denna version:
- Ursprunglig OSRM/bilrutt sparas ännu inte över omruttning. Det är sparat som kommande fix.

Cache:
- `style.css?v=6`
- `app.js?v=6`
- `config.js?v=6`
- Service worker-cache: `30maps-v6`
