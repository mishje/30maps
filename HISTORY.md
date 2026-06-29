# 30maps versionshistorik

## V6.6.8
- Gör inställningsrutan tydligare: “Spara bränsle”, “Stäng av bränsle” och “Sparas direkt” för design/kartläge.
- Ta bort extra text bredvid versionsnumret, inklusive “Smart fallback”.
- Lägg Wake Lock-försök medan navigation är aktiv.
- Lägg mjukare övergång från körläge till manuell kartdragning och tillbaka.
- Starta körläge mer inzoomat på telefon.
- Lägg turn-gate i heading-up så kartan inte roterar för tidigt före tydlig sväng.
- Lägg komfortpoäng i ruttvalet: rakare/enklare väg prioriteras och kurviga/svängiga genvägar straffas.
- Gör omruttning mer rimlig genom att använda färdriktning, straffa U-sväng och testa framåtpunkter.
- Smart körvy påverkas inte.

## V6.6.7
- Gör heading-up-rotationen mjukare när kartan väl roterar.
- Separera target-bearing från faktisk map-bearing.
- Använd `requestAnimationFrame` för att glida kartans bearing mot target i små steg.
- Lägg adaptiv rotationshastighet: små ändringar blir lugnare och större riktningsändringar kommer ikapp utan hopp.
- Behåll route-corridor från V6.6.6.
- Smart körvy påverkas inte.

## V6.6.6
- Minimera sök/favoritkortet på telefon när mål är klart/framme och den ursprungliga rutten visas igen.
- Inför route-corridor för heading-up: flera punkter framför bilen används för att avgöra övergripande färdriktning.
- Små böjar som går tillbaka ignoreras oftare, så kartan inte roterar fram och tillbaka i onödan.
- Justera deadband och max rotationshastighet för mindre hack.
- Smart körvy påverkas inte.

## V6.6.5
- Gör heading-up mjukare när vägen svänger.
- Jämna ut route-bearing med flera lookahead-punkter längs rutten.
- Lägg låg deadband så små jitter inte roterar kartan.
- Begränsa max rotationshastighet så kartan glider runt i stället för att hoppa.
- Gör heading-up-autozoom lugnare och mer sällan ändrad.
- Smart körvy påverkas inte.

## V6.6.4
- Placera GPS-markören längre ner på telefon i Färdriktning uppåt (beta).
- Flytta heading-up-kamerans centrum framåt i färdriktningen så mer väg syns framför fordonet.
- Mjuka ut bearing-uppdateringar genom att ignorera små ändringar och throttla rotationen.
- Gör heading-up-autozoom lugnare med mindre zoomsteg och högre tröskel innan zoom ändras.
- Smart körvy påverkas inte.

## V6.6.3
- Korrigera bearing-riktningen i Färdriktning uppåt (beta) genom att invertera bearing-vinkeln som skickas till `leaflet-rotate`.
- Fordonspilen låses bara rakt upp när kartans bearing faktiskt har applicerats.
- Om kartrotationen inte fungerar fortsätter pilen visa verklig färdriktning i stället för att peka fel.
- Smart körvy påverkas inte.

## V6.6.2
- Ta bort den egna CSS-rotationen av `leaflet-map-pane`.
- Lägg till `leaflet-rotate` som riktig Leaflet-rotation för Färdriktning uppåt (beta).
- Använd `map.setBearing(...)` när rotationsstödet finns.
- Om rotationsstödet inte laddas faller appen tillbaka till Smart körvy i stället för att visa trasig roterad karta.
- Heading-up centrerar direkt på GPS-positionen när riktig Leaflet-rotation är aktiv.
- Fordonspilen hålls uppåt i heading-up för att undvika dubbelrotation.
- Grå/tomma hörn från CSS-rotationen ska försvinna.

## V6.6.1
- Fixa heading-up-rotationens centrum genom att sätta transform-origin dynamiskt till viewportens mitt i Leaflet-pane-koordinater.
- Lägg extra scale på kartlagret i heading-up för att undvika grå/tomma hörn vid rotation.
- Förenkla heading-up-kameran så GPS-markören ligger mer stabilt nära nedre/mellersta körpositionen.
- Uppdatera rotationens origin när Leaflet panorerar/zoomar kartan.
- Behåll Smart körvy och Färdriktning uppåt (beta) som enda kartlägen.

## V6.6
- Ta bort kartläget “Nord upp” från Inställningar.
- Körläge använder nu Smart körvy eller valbart Färdriktning uppåt (beta).
- Gamla sparade `north`-val migreras till Smart körvy.
- Heading-up centreras bättre på GPS-markören.
- Kameran kompenserar för kartrotation när GPS-markörens skärmposition räknas ut.
- Heading-up får egen enkel autozoom: mer överblick på raksträcka/off-route och lite mer inzoomning nära sväng.
- Ändringarna fungerar i både Cockpit och Klassisk design.

## V6.5
- Lägg till kartläge i Inställningar: Nord upp, Smart körvy och Färdriktning uppåt (beta).
- Standardkartläge är Smart körvy.
- Färdriktning uppåt beta roterar kartan efter beräknad färdriktning när navigation och följläge är aktivt.
- Kartrotation stängs av när navigation inte är aktiv.
- När man är framme stoppas följning av GPS och kartan fitBounds:as på den visade ursprungliga rutten.
- Vid felkörning/off-route byter fordonspilen till GPS-heading/rörelseriktning i stället för planerad ruttriktning.
- Kartläge-inställningen fungerar i både Cockpit och Klassisk design.

## V6.4
- Stegrutan görs mindre på telefon under aktiv navigation.
- Vid många steg visas ungefär 1–4 steg åt gången; resten scrollas.
- Stegrutan ligger fortsatt precis ovanför nedersta “km kvar”-kortet.
- Smart körvy beta införs: fordonspilens riktning tas i första hand från rutten framför bilen, med GPS-heading och rörelse som fallback.
- Riktningen mjukas ut för att minska ryck.
- Ändringarna fungerar i både Cockpit och Klassisk design.

## V6.3.1
- Lägg till designläge i Inställningar: 30maps Cockpit och Klassisk design.
- Första besök startar i Cockpit om inget annat val är sparat.
- Designval sparas lokalt med `localStorage`.
- Separera designläge från ljust/mörkt tema.
- Scope:a Cockpit-stilen till `body.design-cockpit` så Klassisk design kan använda gamla utseendet.
- Fixa versionsrutan så den inte blir felaktigt grön i något läge.
- Nya designreglaget stylas i både Cockpit och Klassisk design.
- Framtida UI ska fungera i både Cockpit och Klassisk design.

## V6.3
- Inför “30maps Cockpit”-designriktning.
- Ny mörkare palett med mörk asfalt, 30maps-grön, blå sekundärfärg och orange varning.
- Overlay-kort får mer instrumentpanel-/cockpit-känsla.
- Korten görs lite mer rektangulära men fortfarande rundade.
- Sök/favorit-panel, ruttkort, körkort, svängkort, stegkort, vald plats, inställningar, toast och versionsbadge får mer sammanhållen stil.
- Kortöppning/stängning får mer konsekventa cockpit-animationer.
- Manuell avslutning av aktiv navigation stänger även öppen stegruta, tar bort stegmarkörer och rensar `steps-open`.

## V6.2.5
- Stegkortet sänks så det ligger närmare nedersta “km kvar”-kortet på telefon.
- `steps-open`-klass används när stegrutan är öppen.
- “Tillbaka till körläge”-knappen flyttas ovanför stegkortet när stegrutan är öppen.
- Klick på steg zoomar ut lite mer för bättre överblick.

## V6.2.4
- Stegrutan öppnas inte längre automatiskt när navigation startar.
- `Stäng` döljer stegrutan på riktigt och tar bort stegmarkörer.
- Efter att man valt ett steg och kartan zoomat dit återgår `Stäng` automatiskt till körläge/följläge.
- Stegrutan placeras ovanför nedersta körkortet under aktiv navigation.
- När man trycker på ett steg placeras stegpunkten ovanför stegrutan i synlig kartyta.

## V6.2.3
- “Tillbaka till körläge”-knappen flyttas upp så den inte ligger ovanpå nedersta körkortet.
- Färgtemat för “Tillbaka till körläge” rättas: ljus knapp i ljust läge och mörk knapp i mörkt läge.
- Steglistan görs kompaktare på telefon under aktiv navigation.
- Stegrutan får lägre maxhöjd och listan scrollar, så kartan/rutten syns bättre.

## V6.2.2
- Distans/tid och bränsle/kostnad i ruttkortet flyttas till egen rad under toppområdet på mobil.
- Metaraden hamnar inte längre under eller bakom Dela/Stäng-knapparna.
- Dela-knappen på dator görs mindre när den bara visar ikonen `↗`.

Det här dokumentet följer med ZIP-packningarna från och med V6.2.1 och ska uppdateras vid varje ny version. Äldre historik är rekonstruerad från projektets tidigare byggen och anteckningar, så de tidigaste versionerna kan vara mindre detaljerade.

## V6.2.1
- Mobilpolish av ruttkortet.
- Målnamn i ruttkortet begränsas till max två rader.
- “Dela” i ruttkortet görs om till liten ikonknapp.
- Kortare rutt-underrad för att undvika onödig radbrytning.
- Kompaktare varningsruta.
- Mindre “Visa avancerat och bilrutt”.
- “Starta navigation” behålls stor och tydlig.
- `HISTORY.md` läggs till och ska följa med varje framtida ZIP.

## V6.2
- Numrerade stegmarkörer visas på kartan när “Visa steg” öppnas.
- Stegmarkörer tas bort när stegrutan stängs.
- Tryck på steg i listan flyttar/zoomar kartan till steget.
- Valt steg får highlight i både lista och kartmarkör.
- Ny inställningsknapp `⚙️`.
- Bränsleberäkning med manuell medelförbrukning i L/mil.
- Manuellt literpris i kr/L.
- Ruttkortets metayta växlar/fadear mellan distans/tid och bränsle/kostnad utan att förstora rutan.

## V6.1
- Ursprunglig OSRM/bilrutt sparas separat när första rutten räknas.
- Ursprunglig OSRM/bilrutt bevaras över felkörning/omruttning.
- När originalrutten visas igen kan den blå bilrutten komma från den ursprungliga OSRM-rutten.
- Delat mål öppnar med sök/favorit-panelen minimerad på telefon/liten skärm.

## V6
- Start på 6-serien.
- `config.js` införs med `APP_BASE_URL` för webbsidans basadress.
- Liten `↗ Dela`-knapp för mål.
- Delade länkar innehåller bara destinationens latitud, longitud och label.
- Delade mållänkar kan öppnas med formatet `#dest=lat,lon&label=namn`.

## V5.9
- Smart framför-vy utan kartrotation.
- Kartan är norr upp, men GPS-markören placeras lite bakom färdriktningen.
- Appen använder punkt längre fram på rutten för att visa mer väg framför fordonet.
- Om nästa sväng är långt bort används begränsad framför-buffert i stället för att visa hela vägen till svängen.
- När sväng närmar sig kikar kameran mer framåt och blir sedan mer exakt nära svängen.

## V5.8
- Starta navigation från utzoomad karta fixas.
- Zoom och körlägespanorering görs tillsammans så GPS-markören hamnar rätt.
- “Tillbaka till körläge”-knappen får stabil position och stabil klickyta.
- Knappen göms med kort fördröjning efter tryck.

## V5.7
- Stoppar onödig svängkortsanimation när svänglåset håller kvar samma instruktion.
- Om samma instruktion visas igen uppdateras bara avståndet, utan ny animation.

## V5.6
- Hårdare svängkortslås.
- Svänginstruktion hålls kvar innan och efter sväng så nästa instruktion inte visas för tidigt.
- Körstart zoomar in mer på mobil.
- Versionsrutan följer ljust/mörkt tema.
- Vanliga UI-kort får gemensam mjuk animation.

## V5.5
- “Räknar om...” och “Ny rutt klar” visas i gröna svängkortet vid omruttning.
- “Tillbaka till körläge” visas när följläge är av under navigation.
- Grön återstående rutt och grå körd rutt förbättras.

## V5.4
- Ursprunglig vald 30maps-rutt sparas separat från aktiv/reroutad rutt.
- Efter ankomst visas originalrutten igen.
- Långtryck/högerklick på karta förbättras med förhandsmarkör och bättre återgång.
- Markeringsfärger tydliggör start, mål och vald plats.
- Mobil följvy håller GPS-markören ovanför nedersta navigationsrutan.

## V5.3
- Dold testresa/fejk-GPS via långtryck på versionsrutan.
- Testresa kan göra realistisk felkörning och trigga riktig omruttning.
- Riktig GPS sparas i bakgrunden under testläge.
- Reroutad testresa fortsätter längs ny rutt.
- OSRM-bilrutt kan jämföras som kandidat i smart ruttval.
- Blå OSRM/bilrutt och avancerad info döljs tills avancerat öppnas.
- Snabbare omruttning och förbättrad grön återstående rutt under navigation.

## V5.1–V5.2
- Fortsatt stabilisering av V5-linjen.
- Förbättringar kring ruttkort, navigation, följläge och mobil layout.
- Justeringar efter test på telefon.

## V5
- Ny stabil V5-linje byggd vidare på snabb OSRM/Valhalla-bas.
- Fokus på mobilvänlig körvy, ruttkort och navigation.

## V4–V4.2
- Byggen där V3.8-basen återanvändes för bättre hastighet.
- Förbättringar av mobil layout och ruttkort.
- Fortsatt testning av snabbare ruttberäkning.

## V3.8 beta OSRM
- Snabbare OSRM/Valhalla-baserad linje.
- OSRM-bilrutt används som jämförelse och möjlig kandidat.
- Motorväg/motortrafikled nedprioriteras kraftigt i stället för tung filtrering.
- Denna linje blev grunden för senare stabila versioner.

## V3.7 beta carline
- Test med tydligare bilrutt/jämförelselinje.
- Fortsatt arbete med hur OSRM/bilrutt skulle visas mot 30maps-rutten.

## V3.3–V3.6
- Mobil UX förbättras stegvis.
- Panelminimering, sök/favoriter och ruttkort poleras.
- Långtryck på karta och kartinteraktion förbättras.
- Navigation och UI på iPhone prioriteras.

## V3–V3.2
- Tidiga beta-versioner med grundläggande rutt, karta, sök och mobil layout.
- Första större stegen mot ett A-traktor-anpassat navigeringsläge.

## V1–V2
- Tidiga prototyper.
- Grundidé: 30maps som mobilvänlig A-traktor-navigator med 30 km/h-tänk.
