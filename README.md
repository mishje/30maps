# 30maps A-Traktor Navigator V5.8

GitHub Pages-ready statisk PWA för A-traktor-navigering.

## V5.8

Bygger vidare på V5.7.

Fixar:
- När man trycker “Starta navigation” från en utzoomad karta gör appen nu zoom och körlägespanorering tillsammans.
- GPS-markören ska hamna rätt i körläge även om kartan var mer utzoomad än ruttningsvyn.
- Körläget gör en extra liten efterjustering efter kartans move/zoom så markören hamnar rätt.
- “Tillbaka till körläge”-knappen får stabil position och stabil klickyta.
- Knappen använder inte längre den globala `button:active`-transformen som fick den att hoppa.
- Tryck registreras redan på `pointerdown`, så vänsterkanten ska fungera lika bra som mitten/höger.
- Knappen göms först med en kort fördröjning efter tryck, så den inte hoppar undan under själva klicket.

Cache:
- `style.css?v=58`
- `app.js?v=58`
- Service worker-cache: `30maps-v58`
