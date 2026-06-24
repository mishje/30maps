# 30maps A-Traktor Navigator V5

GitHub Pages-ready statisk PWA för A-traktor-navigering.

## V5

Bygger på den snabba V3.8/OSRM-baserade routinggrunden, men versionen heter nu bara V5.

Tillägg och ändringar:

- Tog bort all animation för sök/favoriter.
- Tog bort all animation för ruttkortet.
- Versionsbadgen visar `BETA · v5`.
- Versionsbadgen kan klickas bort. Den kommer tillbaka när sidan laddas om.
- Ruttkortet har maxhöjd/scroll så knappar inte trycks utanför kortet när avancerad info är öppen.
- Den gula rutan visar enkel säkerhetstext som standard.
- Avancerad ruttinfo och blå OSRM/bilrutt visas bara efter knapptryck.
- Kartan passar in rutten bättre på mobil så rutten hamnar ovanför ruttkortet.
- På dator/större skärm används mer centrerad kartpassning.
- Omräkning vid avvikelse från rutten är snabbare:
  - cirka 80 meter från rutten
  - cirka 10 sekunders cooldown
  - kräver två GPS-träffar i rad utanför rutten för att undvika GPS-hopp
- Under navigation klipps den gröna ruttlinjen successivt så körd sträcka försvinner och kvarvarande rutt blir tydligare.
- När navigation avslutas visas hela rutten igen.
- Den gröna nästa-steg-rutan i navigationsläge får en kort tydlig animation när instruktionen byts.
- Cache-busting: `style.css?v=5` och `app.js?v=5`.
- Service worker-cache: `30maps-v5`.

Obs: Kontrollera alltid skyltning. Motorvägar och motortrafikleder är kraftigt nedprioriterade, men appen ersätter inte vägskyltar eller förarens ansvar.
