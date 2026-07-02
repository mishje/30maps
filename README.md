# 30maps A-Traktor Navigator V6.6.9

GitHub Pages-ready statisk PWA för A-traktor-navigering.

## V6.6.9

Bygger vidare på V6.6.8.

Nytt/fix:
- Fordonspilen visar verklig färdriktning i första hand:
  - GPS-heading
  - rörelseriktning
  - senaste stabila riktning
  - ruttens riktning bara som sista fallback när man ligger nära rutten
- Snap-to-route för markörens position:
  - markören ligger på rutt/väg när GPS är nära aktiv rutt
  - snap släpper när man faktiskt kör fel/off-route
- Smooth marker movement:
  - markören glider mjukt vid små normala GPS-uppdateringar
  - stora hopp/off-route hoppar ikapp snabbare så den inte halkar efter
- Följläge är av när appen öppnas, men första GPS-träffen centrerar kartan en gång.
- På telefon placeras första GPS-vyn i det synliga utrymmet under sök/favoritpanelen.
- Startvyn är lite mer utzoomad på telefon och dator.
- Fler ruttkandidater:
  - OSRM `alternatives=true`
  - flera OSRM-rutter läses in
  - fler Valhalla-profiler
  - automatiska nord/syd-korridorer via OSRM
  - dubbletter tas bort
- Appen väljer fortfarande bästa epa/A-traktor-rutt som grön huvudrutt.
- Snabbaste vanliga bilrutt sparas separat och visas blå i “Visa avancerat och bilrutt”.
- Skalad komfortlogik:
  - korta rutter prioriterar skönare körning mer
  - långa rutter låter faktisk tidsbesparing väga mer
  - både minuter sparade och procent/distans vägs in

Cache:
- `style.css?v=669`
- `app.js?v=669`
- `config.js?v=669`
- Service worker-cache: `30maps-v669`
