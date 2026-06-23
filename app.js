(() => {
  "use strict";

  const VERSION = "4.2-v38base";
  const MAX_ATRAKTOR_KMH = 30;
  const DEFAULT_VIEW = [56.879, 14.805];
  const SWEDEN_BBOX = "10.0,55.0,24.5,69.2"; // lon_min,lat_min,lon_max,lat_max
  const OFF_ROUTE_METERS = 110;
  const REROUTE_COOLDOWN_MS = 25000;

  const el = {
    boot: document.getElementById("boot"),
    panel: document.getElementById("appPanel"),
    panelHandle: document.getElementById("panelHandle"),
    panelHandleText: document.getElementById("panelHandleText"),
    panelHandleChevron: document.getElementById("panelHandleChevron"),
    destInput: document.getElementById("destInput"),
    startInput: document.getElementById("startInput"),
    startSection: document.getElementById("startSection"),
    destSuggestions: document.getElementById("destSuggestions"),
    startSuggestions: document.getElementById("startSuggestions"),
    clearTextBtn: document.getElementById("clearTextBtn"),
    useGpsStartBtn: document.getElementById("useGpsStartBtn"),
    myLocationBtn: document.getElementById("myLocationBtn"),
    followBtn: document.getElementById("followBtn"),
    clearRouteBtn: document.getElementById("clearRouteBtn"),
    favoritesList: document.getElementById("favoritesList"),
    recentList: document.getElementById("recentList"),
    manageFavsBtn: document.getElementById("manageFavsBtn"),
    clearRecentsBtn: document.getElementById("clearRecentsBtn"),
    themeBtn: document.getElementById("themeBtn"),
    routeCard: document.getElementById("routeCard"),
    closeRouteBtn: document.getElementById("closeRouteBtn"),
    routeTitle: document.getElementById("routeTitle"),
    routeSubtitle: document.getElementById("routeSubtitle"),
    routeMeta: document.getElementById("routeMeta"),
    routeWarning: document.getElementById("routeWarning"),
    routeAdvancedBtn: document.getElementById("toggleAdvancedRouteBtn"),
    nextInstruction: document.getElementById("nextInstruction"),
    startNavigationBtn: document.getElementById("startNavigationBtn"),
    favoriteDestinationBtn: document.getElementById("favoriteDestinationBtn"),
    toggleStepsBtn: document.getElementById("toggleStepsBtn"),
    navTop: document.getElementById("navTop"),
    navDistanceToTurn: document.getElementById("navDistanceToTurn"),
    navInstruction: document.getElementById("navInstruction"),
    navRoad: document.getElementById("navRoad"),
    navBottom: document.getElementById("navBottom"),
    navRemaining: document.getElementById("navRemaining"),
    navDestination: document.getElementById("navDestination"),
    navStepsBtn: document.getElementById("navStepsBtn"),
    exitNavigationBtn: document.getElementById("exitNavigationBtn"),
    stepsSheet: document.getElementById("stepsSheet"),
    stepsList: document.getElementById("stepsList"),
    closeStepsBtn: document.getElementById("closeStepsBtn"),
    tapSheet: document.getElementById("tapSheet"),
    tapCoords: document.getElementById("tapCoords"),
    tapNavigateBtn: document.getElementById("tapNavigateBtn"),
    tapStartBtn: document.getElementById("tapStartBtn"),
    tapFavBtn: document.getElementById("tapFavBtn"),
    tapCopyBtn: document.getElementById("tapCopyBtn"),
    tapCloseBtn: document.getElementById("tapCloseBtn"),
    toast: document.getElementById("toast")
  };

  const state = {
    userPos: null,
    userAccuracy: null,
    userHeading: null,
    follow: true,
    panelCollapsed: false,
    navigating: false,
    destination: null,
    start: { mode: "gps", lat: null, lon: null, label: "Min position" },
    selectedTap: null,
    route: null,
    routeLayer: null,
    routeShadowLayer: null,
    carRouteLayer: null,
    destMarker: null,
    startMarker: null,
    tapPreviewMarker: null,
    userMarker: null,
    accuracyCircle: null,
    lastRerouteAt: 0,
    isRouting: false,
    routeUsedFallback: false,
    routeCardVisible: false,
    panelAnimationTimer: null,
    carRouteCoords: null,
    basicRouteInfo: "",
    advancedRouteInfo: "",
    advancedRouteShown: false
  };

  const map = L.map("map", {
    zoomControl: false,
    attributionControl: true
  }).setView(DEFAULT_VIEW, 10);

  L.control.zoom({ position: "bottomright" }).addTo(map);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);


  function isTypingInInput() {
    const active = document.activeElement;
    return active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA");
  }


  function isDesktopLayout() {
    return window.matchMedia && window.matchMedia("(min-width: 700px)").matches;
  }

  function autoMinimizeForDestination() {
    // Mobil: minimera alltid sök/favorit när mål valts så ruttkortet får plats.
    // Dator/större skärm: låt panelerna vara öppna, men manuell minimering fungerar.
    if (!isDesktopLayout()) {
      setPanelCollapsed(true, { force: true });
    } else {
      setRouteCompactMode();
    }
  }

  function setPanelCollapsed(collapsed, options = {}) {
    if (state.navigating) return;
    if (collapsed && isTypingInInput() && !options.force) return;

    const next = Boolean(collapsed);
    const changed = state.panelCollapsed !== next;
    clearTimeout(state.panelAnimationTimer);
    el.panel.classList.remove("panel-opening", "panel-closing", "panel-simple-opening", "panel-simple-closing");

    if (!changed) {
      document.body.classList.toggle("panel-collapsed", next);
      setRouteCompactMode();
      return;
    }

    state.panelCollapsed = next;

    if (el.panelHandleText) {
      el.panelHandleText.textContent = next ? "🔍 Sök / favoriter" : "🔍 Minimera";
    }

    if (next) {
      // V4.2: superenkel stängning. Bara snabb fade på innehållet innan panelen blir flärp.
      el.panel.classList.add("panel-simple-closing");
      setRouteCompactMode();

      state.panelAnimationTimer = window.setTimeout(() => {
        document.body.classList.add("panel-collapsed");
        el.panel.classList.remove("panel-simple-closing");
        el.destSuggestions.innerHTML = "";
        el.startSuggestions.innerHTML = "";
      }, 165);
    } else {
      // V4.2: öppna direkt och fadea in innehållet. Ingen clip-path/blur/scale.
      document.body.classList.remove("panel-collapsed");
      void el.panel.offsetWidth;
      el.panel.classList.add("panel-simple-opening");
      setRouteCompactMode();

      state.panelAnimationTimer = window.setTimeout(() => {
        el.panel.classList.remove("panel-simple-opening");
      }, 170);
    }
  }

  function togglePanelCollapsed() {
    setPanelCollapsed(!state.panelCollapsed, { force: true });
  }

  function showApp() {
    el.boot.classList.add("fade");
    setTimeout(() => el.boot.classList.add("hidden"), 480);
    el.panel.classList.remove("hidden");
    el.panel.classList.add("appear");
    setPanelCollapsed(false, { force: true });
    setTimeout(() => map.invalidateSize(), 140);
  }

  function toast(message) {
    el.toast.textContent = message;
    el.toast.classList.remove("hidden");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => el.toast.classList.add("hidden"), 2400);
  }

  function errorBox(title, detail) {
    showRouteCard();
    el.routeTitle.textContent = title;
    el.routeSubtitle.textContent = detail || "";
    el.routeMeta.textContent = "";
    el.nextInstruction.classList.add("hidden");
    el.routeWarning.textContent = detail || "Testa igen om en stund.";
    el.routeWarning.classList.remove("hidden");
  }

  function fmtCoord(lat, lon) {
    return `${Number(lat).toFixed(5)}, ${Number(lon).toFixed(5)}`;
  }

  function fmtDist(m) {
    if (!Number.isFinite(m)) return "-";
    if (m < 950) return `${Math.max(5, Math.round(m / 5) * 5)} m`;
    return `${(m / 1000).toFixed(m < 10000 ? 1 : 0)} km`;
  }

  function etaFromMeters(distanceMeters) {
    const km = distanceMeters / 1000;
    const min = Math.max(1, Math.round(km / MAX_ATRAKTOR_KMH * 60));
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h} h ${m} min` : `${h} h`;
  }

  function haversine(a, b) {
    const R = 6371000;
    const lat1 = a.lat * Math.PI / 180;
    const lat2 = b.lat * Math.PI / 180;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLon = (b.lon - a.lon) * Math.PI / 180;
    const x = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
    return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  }

  function storageGet(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function storageSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getFavorites() {
    return storageGet("30maps:favorites", []);
  }

  function setFavorites(items) {
    storageSet("30maps:favorites", items);
    renderFavorites();
    updateFavoriteButton();
  }

  function isFavorite(place) {
    if (!place) return false;
    return getFavorites().some(f => Math.abs(f.lat - place.lat) < 0.00001 && Math.abs(f.lon - place.lon) < 0.00001);
  }

  function getRecents() {
    return storageGet("30maps:recents", []);
  }

  function addRecent(place) {
    if (!place) return;
    const recents = getRecents().filter(x => Math.abs(x.lat - place.lat) > 0.00001 || Math.abs(x.lon - place.lon) > 0.00001);
    recents.unshift({ label: place.label, lat: place.lat, lon: place.lon, ts: Date.now() });
    storageSet("30maps:recents", recents.slice(0, 10));
    renderRecents();
  }

  function saveFavorite(place, suggestedName = "") {
    if (!place) return;
    if (isFavorite(place)) {
      toast("Målet finns redan som favorit");
      return;
    }
    const name = prompt("Namn på favorit:", suggestedName || shortName(place.label || "Ny favorit"));
    if (!name) return;
    const favs = getFavorites();
    favs.push({ name, lat: Number(place.lat), lon: Number(place.lon), label: place.label || name });
    setFavorites(favs);
    toast("Favorit sparad");
  }

  function renderFavorites() {
    const favs = getFavorites();
    el.favoritesList.innerHTML = "";
    if (!favs.length) {
      el.favoritesList.appendChild(makeChip("Inga favoriter än", null, true));
      return;
    }
    for (const fav of favs) {
      el.favoritesList.appendChild(makeChip(fav.name, () => setDestination({ lat: fav.lat, lon: fav.lon, label: fav.label || fav.name }, true)));
    }
  }

  function renderRecents() {
    const recents = getRecents();
    el.recentList.innerHTML = "";
    if (!recents.length) {
      el.recentList.appendChild(makeChip("Inga senaste platser", null, true));
      return;
    }
    for (const r of recents) {
      el.recentList.appendChild(makeChip(shortChip(r.label), () => setDestination(r, true)));
    }
  }

  function makeChip(text, fn, disabled = false) {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.textContent = text;
    btn.disabled = disabled;
    if (fn) btn.addEventListener("click", fn);
    return btn;
  }

  function manageFavorites() {
    const favs = getFavorites();
    if (!favs.length) return toast("Du har inga favoriter än");
    const list = favs.map((f, i) => `${i + 1}. ${f.name}`).join("\n");
    const answer = prompt(`Skriv numret på favoriten du vill ta bort:\n\n${list}`);
    const idx = Number(answer) - 1;
    if (Number.isInteger(idx) && favs[idx]) {
      const removed = favs.splice(idx, 1)[0];
      setFavorites(favs);
      toast(`Tog bort ${removed.name}`);
    }
  }

  function clearRecents() {
    storageSet("30maps:recents", []);
    renderRecents();
    toast("Senaste rensade");
  }

  function updateFavoriteButton() {
    if (!state.destination) {
      el.favoriteDestinationBtn.textContent = "⭐ Spara mål";
      return;
    }
    el.favoriteDestinationBtn.textContent = isFavorite(state.destination) ? "★ Sparad" : "⭐ Spara mål";
  }

  function makeUserIcon() {
    const heading = state.userHeading ?? 0;
    return L.divIcon({
      className: "",
      html: `<div class="user-dot-wrap" style="transform:rotate(${heading}deg)">
               <div class="user-heading"></div>
               <div class="user-dot"></div>
             </div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
  }

  function updateUserPosition(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    state.userPos = { lat, lon };
    state.userAccuracy = pos.coords.accuracy || null;

    if (typeof pos.coords.heading === "number" && !Number.isNaN(pos.coords.heading)) {
      state.userHeading = pos.coords.heading;
    }

    if (!state.userMarker) {
      state.userMarker = L.marker([lat, lon], { icon: makeUserIcon(), interactive: false }).addTo(map);
      state.accuracyCircle = L.circle([lat, lon], {
        radius: state.userAccuracy || 30,
        color: "#1e88ff",
        weight: 1,
        fillColor: "#1e88ff",
        fillOpacity: 0.12
      }).addTo(map);

      map.setView([lat, lon], 15);
      setTimeout(showApp, 550);
    } else {
      state.userMarker.setLatLng([lat, lon]);
      state.userMarker.setIcon(makeUserIcon());
      state.accuracyCircle.setLatLng([lat, lon]);
      state.accuracyCircle.setRadius(state.userAccuracy || 30);
      if (state.follow) map.panTo([lat, lon], { animate: true, duration: 0.55 });
    }

    if (state.start.mode === "gps") {
      state.start.lat = lat;
      state.start.lon = lon;
    }

    updateNavigationFromPosition();
  }

  function locationError(err) {
    console.warn("GPS error", err);
    map.setView(DEFAULT_VIEW, 10);
    setTimeout(showApp, 650);
    toast("GPS saknas. Tillåt platsåtkomst eller välj startpunkt på kartan.");
  }

  function startGeolocation() {
    if (!navigator.geolocation) {
      locationError(new Error("No geolocation support"));
      return;
    }

    navigator.geolocation.watchPosition(
      updateUserPosition,
      locationError,
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 12000 }
    );

    setTimeout(() => {
      if (!state.userPos && el.panel.classList.contains("hidden")) {
        map.setView(DEFAULT_VIEW, 10);
        showApp();
        toast("Väntar fortfarande på GPS...");
      }
    }, 4500);
  }


  function clearTapPreviewMarker() {
    if (state.tapPreviewMarker) {
      map.removeLayer(state.tapPreviewMarker);
      state.tapPreviewMarker = null;
    }
  }

  function showTapPreviewMarker(lat, lon) {
    clearTapPreviewMarker();
    state.tapPreviewMarker = L.marker([lat, lon]).addTo(map).bindPopup("Vald plats");
  }

  function placeMarker(kind, place) {
    const latlng = [place.lat, place.lon];
    if (kind === "dest") {
      if (state.destMarker) map.removeLayer(state.destMarker);
      state.destMarker = L.marker(latlng).addTo(map).bindPopup("Destination");
    } else {
      if (state.startMarker) map.removeLayer(state.startMarker);
    if (state.tapPreviewMarker) map.removeLayer(state.tapPreviewMarker);
      if (state.start.mode !== "gps") {
        state.startMarker = L.marker(latlng).addTo(map).bindPopup("Startpunkt");
      }
    }
  }

  function setDestination(place, routeNow = true) {
    state.destination = {
      lat: Number(place.lat),
      lon: Number(place.lon),
      label: place.label || fmtCoord(place.lat, place.lon)
    };

    // User asked that map-picked destination should appear as coordinates.
    if (place.fromMap || place.label === "Kartpunkt") {
      el.destInput.value = fmtCoord(state.destination.lat, state.destination.lon);
    } else {
      el.destInput.value = state.destination.label;
    }

    el.startSection.classList.remove("hidden");
    el.destSuggestions.innerHTML = "";
    el.tapSheet.classList.add("hidden");
    clearTapPreviewMarker();
    placeMarker("dest", state.destination);
    addRecent(state.destination);
    updateFavoriteButton();

    if (routeNow) {
      autoMinimizeForDestination();
    }

    if (routeNow) calculateRoute();
  }

  function setStart(place) {
    if (place.mode === "gps") {
      if (!state.userPos) return toast("Väntar på GPS");
      state.start = { mode: "gps", lat: state.userPos.lat, lon: state.userPos.lon, label: "Min position" };
      el.startInput.value = "Min position";
    } else {
      state.start = {
        mode: "custom",
        lat: Number(place.lat),
        lon: Number(place.lon),
        label: place.label || fmtCoord(place.lat, place.lon)
      };
      el.startInput.value = fmtCoord(state.start.lat, state.start.lon);
    }
    el.startSuggestions.innerHTML = "";
    el.tapSheet.classList.add("hidden");
    clearTapPreviewMarker();
    placeMarker("start", state.start);
    toast("Startpunkt vald");
    if (state.destination) calculateRoute();
  }

  function getStartForRoute() {
    if (state.start.mode === "gps") {
      if (!state.userPos) return null;
      return { ...state.userPos, label: "Min position" };
    }
    return state.start;
  }


  function setRouteCompactMode() {
    const shouldCompact = state.routeCardVisible && !state.panelCollapsed && !state.navigating && !isDesktopLayout();
    document.body.classList.toggle("route-compact", shouldCompact);
  }

  function showRouteCard() {
    if (state.routeCardVisible) {
      // Redan öppen: uppdatera bara. Starta inte om animationen.
      el.routeCard.classList.remove("hidden", "route-exit", "route-enter");
      setRouteCompactMode();
      return;
    }

    state.routeCardVisible = true;
    el.routeCard.classList.remove("hidden", "route-exit", "route-enter");
    void el.routeCard.offsetWidth;
    el.routeCard.classList.add("route-enter");
    setRouteCompactMode();

    window.setTimeout(() => {
      el.routeCard.classList.remove("route-enter");
    }, 360);
  }

  function hideRouteCard(animated = true) {
    if (!state.routeCardVisible && el.routeCard.classList.contains("hidden")) return;

    state.routeCardVisible = false;
    document.body.classList.remove("route-compact");

    if (!animated) {
      el.routeCard.classList.add("hidden");
      el.routeCard.classList.remove("route-enter", "route-exit");
      setAdvancedRouteVisible(false);
      return;
    }

    el.routeCard.classList.remove("route-enter", "route-exit");
    void el.routeCard.offsetWidth;
    el.routeCard.classList.add("route-exit");

    window.setTimeout(() => {
      el.routeCard.classList.add("hidden");
      el.routeCard.classList.remove("route-exit");
      setAdvancedRouteVisible(false);
    }, 300);
  }

  async function calculateRoute(options = {}) {
    const start = getStartForRoute();
    const dest = state.destination;
    if (!dest) return;
    if (!start) {
      errorBox("Väntar på GPS", "Tillåt platsåtkomst i Safari eller välj en startpunkt på kartan.");
      return;
    }
    if (state.isRouting) return;

    state.isRouting = true;
    showRouteCard();
    el.routeTitle.textContent = options.reroute ? "Beräknar om rutt..." : "Beräknar smart A-traktorrutt...";
    el.routeSubtitle.textContent = "Jämför bilväg mot kortare 30 km/h-rutter";
    el.routeMeta.textContent = "";
    el.nextInstruction.classList.add("hidden");
    el.routeWarning.classList.add("hidden");
    if (el.routeAdvancedBtn) el.routeAdvancedBtn.classList.add("hidden");

    try {
      let result = null;

      try {
        result = await getSmartAtraktorRoute(start, dest);
        state.routeUsedFallback = false;
      } catch (err) {
        console.warn("Smart Valhalla routing failed, using OSRM fallback", err);
      }

      if (!result || !result.route || !result.route.coords.length) {
        const fallback = await routeOsrmFallback(start, dest);
        result = {
          route: fallback,
          chosen: {
            name: "Reservrutt",
            summary: "OSRM-reserv",
            useHighways: null
          },
          alternatives: [],
          reason: "Valhalla svarade inte, så appen använder reservrutt."
        };
        state.routeUsedFallback = true;
      }

      const route = result.route;
      state.route = route;

      // Avancerad jämförelse:
      // Spara blå bilrutt, men visa den inte förrän användaren öppnar avancerad info.
      if (result.osrmCar && result.osrmCar.coords && result.osrmCar.coords.length) {
        state.carRouteCoords = result.osrmCar.coords;
      } else if (result.carLike && result.carLike.coords && result.carLike.coords.length) {
        state.carRouteCoords = result.carLike.coords;
      } else {
        state.carRouteCoords = null;
      }
      drawCarRoute(null);

      drawRoute(route.coords);

      const km = (route.distance / 1000).toFixed(1);
      const eta = etaFromMeters(route.distance);
      el.routeTitle.textContent = shortName(dest.label);
      el.routeSubtitle.textContent = `${result.chosen.summary || result.chosen.name} · A-traktor, 30 km/h`;
      el.routeMeta.textContent = `${km} km · ${eta}`;

      updateStepsUI();

      if (route.instructions.length) {
        const first = route.instructions[0];
        el.nextInstruction.textContent = `${fmtDist(first.distanceFromStart || 0)} · ${first.text}`;
        el.nextInstruction.classList.remove("hidden");
      }

      if (state.routeUsedFallback) {
        setRouteInfoText("Reservrutt används. Motorvägar och motortrafikleder är kraftigt nedprioriterade, men kontrollera rutten extra noga.", "");
      } else {
        setRouteInfoText(basicRouteSafetyText(), buildSmartRouteMessage(result));
      }

      fitRoute(start, dest, route.coords);
      updateFavoriteButton();
      setRouteCompactMode();
      if (state.navigating) enterNavigationMode(false);
    } catch (err) {
      console.error(err);
      errorBox("Kunde inte hitta rutt", "Testa att välja en punkt närmare en väg, kontrollera internet eller prova igen senare.");
    } finally {
      state.isRouting = false;
    }
  }

  function fitRoute(start, dest, coords) {
    const bounds = L.latLngBounds([[start.lat, start.lon], [dest.lat, dest.lon]]);
    for (const c of coords) bounds.extend(c);
    map.fitBounds(bounds, { paddingTopLeft: [20, 230], paddingBottomRight: [20, 150] });
  }

  async function getSmartAtraktorRoute(start, dest) {
    // V3.8 beta:
    // Lägg till OSRM:s vanliga bilrutt som egen kandidat.
    // Den visas i blått och får också vara med i 30 km/h-jämförelsen.
    const profiles = [
      {
        id: "car_like",
        name: "Valhalla bilväg",
        summary: "Valhalla bilväg",
        useHighways: 0.75,
        distancePreference: 0,
        profilePenalty: 0,
        description: "Valhalla bil-liknande rutt"
      },
      {
        id: "atraktor_short",
        name: "Kort 30-väg",
        summary: "Kortare 30 km/h-väg",
        useHighways: 0.30,
        distancePreference: 1,
        profilePenalty: 0,
        description: "prioriterar kortare väg för 30 km/h"
      },
      {
        id: "atraktor_direct",
        name: "Direkt 30-väg",
        summary: "Direkt 30 km/h-väg",
        useHighways: 0.45,
        distancePreference: 0.7,
        profilePenalty: 0,
        description: "balanserar direkt väg och kort distans"
      }
    ];

    const [valhallaSettled, osrmSettled] = await Promise.all([
      Promise.allSettled(profiles.map(profile => routeValhalla(start, dest, profile))),
      routeOsrmCarCandidate(start, dest).then(
        route => ({ status: "fulfilled", value: route }),
        error => ({ status: "rejected", reason: error })
      )
    ]);

    const alternatives = valhallaSettled
      .map(res => res.status === "fulfilled" ? res.value : null)
      .filter(Boolean)
      .filter(route => route.coords && route.coords.length);

    let osrmCar = null;
    if (osrmSettled.status === "fulfilled" && osrmSettled.value && osrmSettled.value.coords && osrmSettled.value.coords.length) {
      osrmCar = osrmSettled.value;
      alternatives.push(osrmCar);
    }

    if (!alternatives.length) throw new Error("Inga rutter hittades");

    const minDistance = Math.min(...alternatives.map(r => r.distance));
    const carLike = osrmCar || alternatives.find(r => r.profile.id === "car_like") || alternatives[0];

    for (const route of alternatives) {
      route.score = scoreThirtyKmhRoute(route, minDistance, carLike);
    }

    alternatives.sort((a, b) => a.score - b.score);

    let chosen = alternatives[0];

    // Om OSRM-bilrutten är både tydligt kortare/enklare i 30 km/h, låt den vinna.
    // Det hjälper fall där Valhalla inte föreslår t.ex. vägen via Linneryd men OSRM gör det.
    if (osrmCar) {
      const bestNonOsrm = alternatives.find(r => r.profile.id !== "osrm_car");
      if (bestNonOsrm) {
        const savedMeters = bestNonOsrm.distance - osrmCar.distance;
        const savedMinutes = savedMeters / 1000 / 30 * 60;
        const fewerOrSimilarTurns = osrmCar.turnCount <= bestNonOsrm.turnCount + 2;

        if (savedMinutes >= 1.5 && fewerOrSimilarTurns) {
          chosen = osrmCar;
          chosen.smartReason = `Valde OSRM-bilrutten eftersom den verkar kortare/enklare även vid 30 km/h.`;
        }
      }
    }

    // Kortare kandidat kan vinna även om den inte är OSRM.
    const reference = carLike;
    const shorter = alternatives
      .filter(r => r.distance < reference.distance - 250)
      .sort((a, b) => a.score - b.score)[0];

    if (shorter && chosen.profile.id !== "osrm_car") {
      const savedMeters = reference.distance - shorter.distance;
      const extraTurns = Math.max(0, shorter.turnCount - reference.turnCount);
      const savedMinutes = savedMeters / 1000 / 30 * 60;

      if (savedMinutes >= 2 || (savedMinutes >= 1 && extraTurns <= 2)) {
        chosen = shorter;
        chosen.smartReason = `Valde kortare väg som sparar cirka ${Math.round(savedMinutes)} min vid 30 km/h.`;
      }
    }

    return {
      route: chosen,
      chosen: chosen.profile,
      alternatives,
      carLike,
      osrmCar,
      reason: chosen.smartReason || "Valde rutten med bäst 30 km/h-balans mellan kort distans och få onödiga svängar."
    };
  }

  function scoreThirtyKmhRoute(route, minDistance, carLike) {
    const extraDistanceVsBest = Math.max(0, route.distance - minDistance);
    const extraTurnsVsCar = Math.max(0, route.turnCount - carLike.turnCount);
    const savesDistanceVsCar = Math.max(0, carLike.distance - route.distance);

    // A-traktor-tid = distans / 30 km/h.
    // Eftersom maxhastigheten är ungefär samma överallt blir distans viktigast.
    const atraktorTimeSeconds = route.distance / (30 / 3.6);

    // Svängar straffas lätt. Detta ska undvika onödiga kringelkrokar, men inte döda bra kortare vägar.
    const turnPenaltySeconds = route.turnCount * 12 + extraTurnsVsCar * 16;

    // Extra distans jämfört med kortaste kandidat kostar.
    const extraDistancePenaltySeconds = extraDistanceVsBest / (30 / 3.6) * 0.35;

    // Kortare än referens-bilrutten får bonus.
    const shorterBonusSeconds = savesDistanceVsCar / (30 / 3.6) * 0.18;

    // OSRM-bilrutt får bara en minimal försiktighetskostnad, eftersom den kan innehålla vägar som Valhalla försöker undvika.
    // Primary/riksväg/länsväg straffas inte separat.
    const sourcePenalty = route.profile.id === "osrm_car" ? 35 : 0;

    return atraktorTimeSeconds + turnPenaltySeconds + extraDistancePenaltySeconds - shorterBonusSeconds + sourcePenalty + route.profile.profilePenalty;
  }

  function buildSmartRouteMessage(result) {
    const alts = result.alternatives || [];
    const chosen = result.route;

    if (!chosen) {
      return "Optimerad för 30 km/h: kortare rimlig väg prioriteras före bilens snabbaste väg. Kontrollera alltid skyltning.";
    }

    const parts = [`30maps beta: ${result.reason}`];

    if (alts.length > 1) {
      const summary = alts
        .slice()
        .sort((a, b) => a.distance - b.distance)
        .map(r => `${r.profile.name}: ${(r.distance/1000).toFixed(1)} km, ${r.turnCount} svängar`)
        .join(" · ");
      parts.push(summary);
    }

    parts.push("Blå linje = OSRM:s vanliga bilrutt. Grön linje = vald 30 km/h-rutt. Riksväg/länsväg straffas inte automatiskt. Om OSRM-bilrutten är kortare/enklare vid 30 km/h kan den väljas. Kontrollera alltid skyltning.");
    return parts.join(" ");
  }

  async function routeValhalla(start, dest, profile = { id: "balanced", name: "Balanserad", summary: "30 km/h-rutt", useHighways: 0.25, profilePenalty: 220 }) {
    const payload = {
      locations: [
        { lat: start.lat, lon: start.lon, type: "break" },
        { lat: dest.lat, lon: dest.lon, type: "break" }
      ],
      costing: "auto",
      costing_options: {
        auto: {
          top_speed: 30,
          use_highways: profile.useHighways,
          use_tolls: 0,
          use_ferry: 0.15,
          country_crossing_penalty: 2000
        }
      },
      directions_options: {
        units: "kilometers",
        language: "sv-SE"
      }
    };

    const url = "https://valhalla1.openstreetmap.de/route?json=" + encodeURIComponent(JSON.stringify(payload));
    const res = await fetch(url);
    if (!res.ok) throw new Error("Valhalla svarade inte");
    const data = await res.json();
    if (!data.trip || !data.trip.legs || !data.trip.legs.length) return null;

    const leg = data.trip.legs[0];
    const coords = decodePolyline(leg.shape, 6);
    const cumulative = buildCumulative(coords);
    const maneuvers = leg.maneuvers || [];

    const instructions = maneuvers.map((m, i) => {
      const idx = Math.min(m.begin_shape_index || 0, coords.length - 1);
      return {
        text: cleanInstruction(m.instruction || "Fortsätt"),
        road: "",
        point: coords[idx],
        distanceFromStart: cumulative[idx] || 0,
        stepDistance: (m.length || 0) * 1000,
        index: i
      };
    }).filter(x => x.text);

    const turnCount = countMeaningfulTurns(instructions);

    return {
      source: "Valhalla",
      profile,
      coords,
      distance: (data.trip.summary?.length || 0) * 1000,
      cumulative,
      instructions,
      turnCount,
      score: 0
    };
  }

  function countMeaningfulTurns(instructions) {
    return (instructions || []).filter(step => {
      const t = String(step.text || "").toLowerCase();
      return (
        t.includes("sväng") ||
        t.includes("rondell") ||
        t.includes("avfart") ||
        t.includes("håll vänster") ||
        t.includes("håll höger") ||
        t.includes("turn") ||
        t.includes("roundabout")
      );
    }).length;
  }

  async function routeOsrmCarCandidate(start, dest) {
    const route = await routeOsrmRaw(start, dest);
    route.source = "OSRM";
    route.profile = {
      id: "osrm_car",
      name: "OSRM bilrutt",
      summary: "OSRM bilrutt",
      useHighways: null,
      profilePenalty: 0
    };
    route.score = 0;
    return route;
  }

  async function routeOsrmFallback(start, dest) {
    const route = await routeOsrmRaw(start, dest);
    route.source = "OSRM";
    route.profile = { id: "fallback", name: "Reservrutt", summary: "OSRM-reserv", useHighways: null, profilePenalty: 999 };
    route.score = 0;
    return route;
  }

  async function routeOsrmRaw(start, dest) {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${dest.lon},${dest.lat}?overview=full&geometries=geojson&steps=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Routingtjänsten svarar inte");
    const data = await res.json();
    if (!data.routes || !data.routes[0]) throw new Error("Ingen rutt hittades");

    const route = data.routes[0];
    const coords = [];
    const instructions = [];
    let distanceSoFar = 0;

    const steps = route.legs?.[0]?.steps || [];
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      const stepCoords = (s.geometry?.coordinates || []).map(c => [c[1], c[0]]);
      if (stepCoords.length) {
        if (!coords.length) coords.push(...stepCoords);
        else coords.push(...stepCoords.slice(1));
      }
      instructions.push({
        text: translateManeuver(s.maneuver?.type, s.maneuver?.modifier, s.name),
        road: s.name || "",
        point: stepCoords[0] || [start.lat, start.lon],
        distanceFromStart: distanceSoFar,
        stepDistance: s.distance || 0,
        index: i
      });
      distanceSoFar += s.distance || 0;
    }

    const finalCoords = coords.length ? coords : route.geometry.coordinates.map(c => [c[1], c[0]]);
    const filteredInstructions = instructions.filter(x => x.text);
    return {
      source: "OSRM",
      coords: finalCoords,
      distance: route.distance,
      cumulative: buildCumulative(finalCoords),
      instructions: filteredInstructions,
      turnCount: countMeaningfulTurns(filteredInstructions),
      score: 0
    };
  }

  function cleanInstruction(text) {
    return String(text).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  }

  function translateManeuver(type, modifier, road) {
    const onRoad = road ? ` på ${road}` : "";
    if (type === "arrive") return "Du är framme";
    if (type === "depart") return "Starta" + onRoad;
    if (type === "roundabout" || type === "rotary") return "Kör in i rondellen" + onRoad;
    if (modifier && modifier.includes("left")) return "Sväng vänster" + onRoad;
    if (modifier && modifier.includes("right")) return "Sväng höger" + onRoad;
    if (modifier === "straight") return "Fortsätt rakt fram" + onRoad;
    return "Fortsätt" + onRoad;
  }

  function decodePolyline(str, precision) {
    let index = 0, lat = 0, lng = 0;
    const coordinates = [];
    const factor = Math.pow(10, precision || 6);

    while (index < str.length) {
      let b, shift = 0, result = 0;
      do {
        b = str.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const deltaLat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += deltaLat;

      shift = 0;
      result = 0;
      do {
        b = str.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const deltaLng = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += deltaLng;

      coordinates.push([lat / factor, lng / factor]);
    }
    return coordinates;
  }

  function buildCumulative(coords) {
    const cum = [0];
    for (let i = 1; i < coords.length; i++) {
      cum[i] = cum[i - 1] + haversine(
        { lat: coords[i - 1][0], lon: coords[i - 1][1] },
        { lat: coords[i][0], lon: coords[i][1] }
      );
    }
    return cum;
  }

  function drawCarRoute(coords) {
    if (state.carRouteLayer) map.removeLayer(state.carRouteLayer);
    if (!coords || !coords.length) return;

    state.carRouteLayer = L.polyline(coords, {
      color: "#1e88ff",
      weight: 5,
      opacity: 0.72,
      dashArray: "10 10",
      lineCap: "round",
      lineJoin: "round"
    }).addTo(map);

    // Lägg blå bilrutt bakom grön vald A-traktorrutt om båda finns.
    if (state.routeShadowLayer) state.routeShadowLayer.bringToFront();
    if (state.routeLayer) state.routeLayer.bringToFront();
  }


  function basicRouteSafetyText() {
    return "Motorvägar och motortrafikleder är kraftigt nedprioriterade. Kontrollera alltid skyltning.";
  }

  function setRouteInfoText(basicText, advancedText) {
    state.basicRouteInfo = basicText || basicRouteSafetyText();
    state.advancedRouteInfo = advancedText || "";
    setAdvancedRouteVisible(false);
  }

  function setAdvancedRouteVisible(show) {
    state.advancedRouteShown = Boolean(show) && Boolean(state.advancedRouteInfo);

    if (el.routeWarning) {
      el.routeWarning.textContent = state.advancedRouteShown ? state.advancedRouteInfo : (state.basicRouteInfo || basicRouteSafetyText());
      el.routeWarning.classList.remove("hidden");
      el.routeWarning.classList.toggle("advanced-visible", state.advancedRouteShown);
    }

    if (el.routeAdvancedBtn) {
      el.routeAdvancedBtn.classList.toggle("hidden", !state.advancedRouteInfo);
      el.routeAdvancedBtn.textContent = state.advancedRouteShown ? "Dölj avancerat och blå bilrutt" : "Visa avancerat och blå bilrutt";
      el.routeAdvancedBtn.setAttribute("aria-expanded", state.advancedRouteShown ? "true" : "false");
    }

    // Blå OSRM/bilrutt visas bara när avancerad info är öppen.
    if (state.advancedRouteShown && state.carRouteCoords && state.carRouteCoords.length) {
      drawCarRoute(state.carRouteCoords);
    } else {
      drawCarRoute(null);
    }
  }

  function drawRoute(coords) {
    if (state.routeLayer) map.removeLayer(state.routeLayer);
    if (state.routeShadowLayer) map.removeLayer(state.routeShadowLayer);

    state.routeShadowLayer = L.polyline(coords, {
      color: "#ffffff",
      weight: 12,
      opacity: 0.88,
      lineCap: "round",
      lineJoin: "round"
    }).addTo(map);

    state.routeLayer = L.polyline(coords, {
      color: "#00a651",
      weight: 7,
      opacity: 0.96,
      lineCap: "round",
      lineJoin: "round"
    }).addTo(map);
  }

  function updateStepsUI() {
    const steps = state.route?.instructions || [];
    el.stepsList.innerHTML = "";
    if (!steps.length) {
      const li = document.createElement("li");
      li.textContent = "Inga svänginstruktioner tillgängliga.";
      el.stepsList.appendChild(li);
      return;
    }
    for (const step of steps) {
      const li = document.createElement("li");
      li.innerHTML = `${escapeHtml(step.text)}<small>${escapeHtml(fmtDist(step.stepDistance || 0))}</small>`;
      el.stepsList.appendChild(li);
    }
  }

  function showSteps() {
    updateStepsUI();
    el.stepsSheet.classList.remove("hidden");
  }

  function hideSteps() {
    el.stepsSheet.classList.add("hidden");
  }

  function enterNavigationMode(showToast = true) {
    if (!state.route || !state.destination) {
      toast("Välj en rutt först");
      return;
    }
    state.navigating = true;
    state.follow = true;
    document.body.classList.add("navigating");
    setRouteCompactMode();
    el.navTop.classList.remove("hidden");
    el.navBottom.classList.remove("hidden");
    el.followBtn.textContent = "🧭 Följ: på";
    updateNavigationFromPosition();
    if (showToast) toast("Navigation startad");
  }

  function exitNavigationMode() {
    state.navigating = false;
    document.body.classList.remove("navigating");
    setRouteCompactMode();
    el.navTop.classList.add("hidden");
    el.navBottom.classList.add("hidden");
    toast("Navigation avslutad");
  }

  function updateNavigationFromPosition() {
    if (!state.route || !state.route.coords.length) return;

    const pos = state.userPos || getStartForRoute();
    if (!pos) return;

    const progress = getRouteProgress(pos, state.route.coords, state.route.cumulative);
    const remaining = Math.max(0, state.route.distance - progress.distanceAlong);
    const next = findNextInstruction(progress.distanceAlong);

    if (state.navigating) {
      el.navRemaining.textContent = `${fmtDist(remaining)} kvar · ${etaFromMeters(remaining)}`;
      el.navDestination.textContent = shortName(state.destination?.label || "Destination");

      if (next) {
        const toTurn = Math.max(0, next.distanceFromStart - progress.distanceAlong);
        const parts = splitInstruction(next.text);
        el.navDistanceToTurn.textContent = `Om ${fmtDist(toTurn)}`;
        el.navInstruction.textContent = parts.main;
        el.navRoad.textContent = parts.road || "";
      } else {
        el.navDistanceToTurn.textContent = "Snart framme";
        el.navInstruction.textContent = "Följ vägen";
        el.navRoad.textContent = "";
      }

      if (progress.offRouteDistance > OFF_ROUTE_METERS) maybeReroute(progress.offRouteDistance);
    }

    if (next && !state.navigating) {
      const toTurn = Math.max(0, next.distanceFromStart - progress.distanceAlong);
      el.nextInstruction.textContent = `${fmtDist(toTurn)} · ${next.text}`;
    }
  }

  function getRouteProgress(pos, coords, cumulative) {
    let best = { distance: Infinity, index: 0, t: 0, distanceAlong: 0 };
    const p = latLonToXY(pos.lat, pos.lon, pos.lat);

    for (let i = 0; i < coords.length - 1; i++) {
      const aLL = { lat: coords[i][0], lon: coords[i][1] };
      const bLL = { lat: coords[i + 1][0], lon: coords[i + 1][1] };
      const a = latLonToXY(aLL.lat, aLL.lon, pos.lat);
      const b = latLonToXY(bLL.lat, bLL.lon, pos.lat);
      const abx = b.x - a.x, aby = b.y - a.y;
      const apx = p.x - a.x, apy = p.y - a.y;
      const ab2 = abx * abx + aby * aby || 1;
      const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / ab2));
      const x = a.x + abx * t, y = a.y + aby * t;
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < best.distance) {
        const segLen = haversine(aLL, bLL);
        best = {
          distance: d,
          index: i,
          t,
          distanceAlong: (cumulative[i] || 0) + segLen * t
        };
      }
    }
    return { distanceAlong: best.distanceAlong, offRouteDistance: best.distance };
  }

  function latLonToXY(lat, lon, refLat) {
    const R = 6371000;
    const x = lon * Math.PI / 180 * R * Math.cos(refLat * Math.PI / 180);
    const y = lat * Math.PI / 180 * R;
    return { x, y };
  }

  function findNextInstruction(distanceAlong) {
    const steps = state.route?.instructions || [];
    return steps.find(s => (s.distanceFromStart || 0) > distanceAlong + 18) || steps[steps.length - 1] || null;
  }

  function splitInstruction(text) {
    const m = String(text).match(/^(.*?)(?: på | mot )(.*)$/i);
    if (!m) return { main: text, road: "" };
    return { main: m[1], road: m[2] };
  }

  async function maybeReroute(offBy) {
    const now = Date.now();
    if (state.isRouting || now - state.lastRerouteAt < REROUTE_COOLDOWN_MS) return;
    state.lastRerouteAt = now;
    toast(`Utanför rutten (${fmtDist(offBy)}). Beräknar om...`);
    await calculateRoute({ reroute: true });
  }

  async function searchSweden(query) {
    const coord = parseCoord(query);
    if (coord) {
      return [{
        lat: coord.lat,
        lon: coord.lon,
        label: `Koordinater ${fmtCoord(coord.lat, coord.lon)}`,
        type: "koordinater",
        distance: state.userPos ? haversine(state.userPos, coord) : null
      }];
    }

    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", "10");
    url.searchParams.set("countrycodes", "se");
    url.searchParams.set("bounded", "1");
    url.searchParams.set("viewbox", SWEDEN_BBOX);
    url.searchParams.set("q", query);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Sökningen svarar inte");
    let items = await res.json();

    items = items
      .filter(p => p.lat && p.lon)
      .map(p => ({
        lat: Number(p.lat),
        lon: Number(p.lon),
        label: p.display_name,
        type: p.type || p.class || "plats",
        distance: state.userPos ? haversine(state.userPos, { lat: Number(p.lat), lon: Number(p.lon) }) : null
      }));

    if (state.userPos) items.sort((a, b) => a.distance - b.distance);
    return items;
  }

  function setupSearch(input, container, onPick) {
    let timer = null;
    input.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const q = input.value.trim();
        if (q.length < 2) {
          container.innerHTML = "";
          return;
        }

        container.innerHTML = `<div class="suggestion"><strong>Söker...</strong><small>Visar bara träffar i Sverige</small></div>`;

        try {
          const results = await searchSweden(q);
          renderSuggestions(container, results, onPick);
        } catch (err) {
          console.error(err);
          container.innerHTML = `<div class="suggestion"><strong>Sökningen misslyckades</strong><small>Kontrollera internet och försök igen.</small></div>`;
        }
      }, 280);
    });

    input.addEventListener("focus", () => {
      setPanelCollapsed(false, { force: true });
      if (input.value.trim().length >= 2) input.dispatchEvent(new Event("input"));
    });
  }

  function renderSuggestions(container, items, onPick) {
    container.innerHTML = "";
    if (!items.length) {
      container.innerHTML = `<div class="suggestion"><strong>Inga träffar i Sverige</strong><small>Testa en mer exakt sökning.</small></div>`;
      return;
    }
    for (const item of items) {
      const div = document.createElement("div");
      div.className = "suggestion";
      const dist = item.distance == null ? "" : item.distance < 1000 ? `${Math.round(item.distance)} m bort` : `${(item.distance/1000).toFixed(1)} km bort`;
      div.innerHTML = `<strong>${escapeHtml(shortName(item.label))}</strong><small>${escapeHtml(dist ? dist + " · " + item.label : item.label)}</small>`;
      div.addEventListener("click", () => {
        container.innerHTML = "";
        onPick(item);
      });
      container.appendChild(div);
    }
  }

  function parseCoord(text) {
    const m = text.trim().match(/^(-?\d+(?:[.,]\d+)?)\s*,\s*(-?\d+(?:[.,]\d+)?)$/);
    if (!m) return null;
    const lat = Number(m[1].replace(",", "."));
    const lon = Number(m[2].replace(",", "."));
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    if (lat < 55 || lat > 69.2 || lon < 10 || lon > 24.5) return null;
    return { lat, lon };
  }

  function shortName(label) {
    const text = String(label || "Destination");
    return text.split(",").slice(0, 2).join(",").trim() || text;
  }

  function shortChip(label) {
    const text = shortName(label);
    return text.length > 24 ? text.slice(0, 24) + "…" : text;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[s]));
  }

  function clearAll() {
    el.destInput.value = "";
    el.startInput.value = "";
    el.destSuggestions.innerHTML = "";
    el.startSuggestions.innerHTML = "";
    el.startSection.classList.add("hidden");
    hideRouteCard(true);
    el.routeWarning.classList.add("hidden");
    if (el.routeAdvancedBtn) el.routeAdvancedBtn.classList.add("hidden");
    el.nextInstruction.classList.add("hidden");
    el.stepsSheet.classList.add("hidden");
    el.tapSheet.classList.add("hidden");
    exitNavigationModeSilently();

    state.destination = null;
    state.route = null;
    state.carRouteCoords = null;
    state.basicRouteInfo = "";
    state.advancedRouteInfo = "";
    state.advancedRouteShown = false;
    state.start = { mode: "gps", lat: state.userPos?.lat ?? null, lon: state.userPos?.lon ?? null, label: "Min position" };

    if (state.routeLayer) map.removeLayer(state.routeLayer);
    if (state.routeShadowLayer) map.removeLayer(state.routeShadowLayer);
    if (state.carRouteLayer) map.removeLayer(state.carRouteLayer);
    if (state.destMarker) map.removeLayer(state.destMarker);
    if (state.startMarker) map.removeLayer(state.startMarker);
    if (state.tapPreviewMarker) map.removeLayer(state.tapPreviewMarker);
    state.routeLayer = null;
    state.routeShadowLayer = null;
    state.carRouteLayer = null;
    state.destMarker = null;
    state.startMarker = null;
    state.tapPreviewMarker = null;
    toast("Rensat");
    setPanelCollapsed(false, { force: true });
  }

  function exitNavigationModeSilently() {
    state.navigating = false;
    document.body.classList.remove("navigating");
    setRouteCompactMode();
    el.navTop.classList.add("hidden");
    el.navBottom.classList.add("hidden");
  }

  function showTapSheet(lat, lon) {
    state.selectedTap = { lat, lon, label: fmtCoord(lat, lon), fromMap: true };
    showTapPreviewMarker(lat, lon);
    el.tapCoords.textContent = fmtCoord(lat, lon);
    el.tapSheet.classList.remove("hidden");
  }


  function setupLongPress() {
    let timer = null;
    let moved = false;
    let startTouch = null;
    const container = map.getContainer();

    container.addEventListener("touchstart", (ev) => {
      if (ev.touches.length !== 1) return;
      moved = false;
      startTouch = ev.touches[0];
      timer = setTimeout(() => {
        if (moved || !startTouch) return;
        const latlng = map.mouseEventToLatLng(startTouch);
        showTapSheet(latlng.lat, latlng.lng);
        if (navigator.vibrate) navigator.vibrate(20);
      }, 650);
    }, { passive: true });

    container.addEventListener("touchmove", () => {
      moved = true;
      clearTimeout(timer);
    }, { passive: true });

    container.addEventListener("touchend", () => {
      clearTimeout(timer);
      startTouch = null;
    }, { passive: true });

    map.on("contextmenu", e => showTapSheet(e.latlng.lat, e.latlng.lng));
  }

  function copyText(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => toast("Kopierat")).catch(() => prompt("Kopiera koordinater:", text));
    } else {
      prompt("Kopiera koordinater:", text);
    }
  }

  function initEvents() {
    el.panelHandle.addEventListener("click", togglePanelCollapsed);
    setupSearch(el.destInput, el.destSuggestions, p => setDestination(p, true));
    setupSearch(el.startInput, el.startSuggestions, p => setStart(p));

    el.clearTextBtn.addEventListener("click", () => {
      el.destInput.value = "";
      el.destSuggestions.innerHTML = "";
    });

    el.useGpsStartBtn.addEventListener("click", () => setStart({ mode: "gps" }));

    el.myLocationBtn.addEventListener("click", () => {
      if (!state.userPos) return toast("Väntar på GPS");
      map.flyTo([state.userPos.lat, state.userPos.lon], 16);
    });

    el.followBtn.addEventListener("click", () => {
      state.follow = !state.follow;
      el.followBtn.textContent = state.follow ? "🧭 Följ: på" : "🧭 Följ: av";
      toast(state.follow ? "Följläge på" : "Följläge av");
    });

    el.clearRouteBtn.addEventListener("click", clearAll);
    el.closeRouteBtn.addEventListener("click", clearAll);
    el.manageFavsBtn.addEventListener("click", manageFavorites);
    el.clearRecentsBtn.addEventListener("click", clearRecents);

    el.favoriteDestinationBtn.addEventListener("click", () => saveFavorite(state.destination));
    el.startNavigationBtn.addEventListener("click", () => enterNavigationMode(true));
    el.toggleStepsBtn.addEventListener("click", showSteps);
    if (el.routeAdvancedBtn) el.routeAdvancedBtn.addEventListener("click", () => setAdvancedRouteVisible(!state.advancedRouteShown));
    el.navStepsBtn.addEventListener("click", showSteps);
    el.closeStepsBtn.addEventListener("click", hideSteps);
    el.exitNavigationBtn.addEventListener("click", exitNavigationMode);

    el.tapNavigateBtn.addEventListener("click", () => {
      if (!state.selectedTap) return;
      setDestination({ ...state.selectedTap, label: "Kartpunkt", fromMap: true }, true);
    });

    el.tapStartBtn.addEventListener("click", () => {
      if (!state.selectedTap) return;
      el.startSection.classList.remove("hidden");
      setStart({ ...state.selectedTap, label: "Kartpunkt", mode: "custom" });
    });

    el.tapFavBtn.addEventListener("click", () => {
      if (!state.selectedTap) return;
      saveFavorite({ ...state.selectedTap, label: "Kartpunkt" }, "Kartpunkt");
    });

    el.tapCopyBtn.addEventListener("click", () => {
      if (!state.selectedTap) return;
      copyText(fmtCoord(state.selectedTap.lat, state.selectedTap.lon));
    });

    el.tapCloseBtn.addEventListener("click", () => {
      el.tapSheet.classList.add("hidden");
      clearTapPreviewMarker();
    });

    el.themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      storageSet("30maps:dark", document.body.classList.contains("dark"));
    });

    map.on("dragstart", () => {
      if (state.follow) {
        state.follow = false;
        el.followBtn.textContent = "🧭 Följ: av";
      }

      // Auto-minimera bara på telefon/liten skärm när kartan dras.
      // På dator/större skärm ska sök/favoriter vara kvar öppen.
      if (!isDesktopLayout()) {
        setPanelCollapsed(true);
      }
    });

    setupLongPress();
  }

  function exitNavigationMode() {
    exitNavigationModeSilently();
    setPanelCollapsed(false, { force: true });
    toast("Navigation avslutad");
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./service-worker.js").catch(console.warn);
    }
  }

  function init() {
    if (storageGet("30maps:dark", false)) document.body.classList.add("dark");
    renderFavorites();
    renderRecents();
    initEvents();
    registerServiceWorker();
    window.addEventListener("resize", setRouteCompactMode);
    startGeolocation();
    console.log(`30maps V${VERSION} loaded`);
  }

  init();
})();
