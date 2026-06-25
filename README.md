# 30maps A-Traktor Navigator V6.3.1

GitHub Pages-ready statisk PWA för A-traktor-navigering.

## V6.3.1

Bygger vidare på V6.3.

Fixar:
- Designläge läggs till i Inställningar:
  - 30maps Cockpit
  - Klassisk design
- Första besök startar alltid i Cockpit om användaren inte har sparat något annat.
- Användarens designval sparas lokalt med `localStorage`.
- Cockpit-stilen är nu scope:ad till `body.design-cockpit`.
- Klassisk design använder gamla V6.2.x-utseendet och fungerar med både ljust och mörkt tema.
- Ljust/mörkt tema är separerat från designläget.
- Versionsrutan är fixad så den inte blir helgrön/fel i något läge.
- Nya designreglaget är stylat i både Cockpit och Klassisk design.

Viktigt framåt:
- Nya UI-delar ska kontrolleras i både Cockpit och Klassisk design.

Cache:
- `style.css?v=631`
- `app.js?v=631`
- `config.js?v=631`
- Service worker-cache: `30maps-v631`
