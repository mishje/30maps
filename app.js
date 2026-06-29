(() => {
  "use strict";

  const VERSION = "6.6.8";
  const MAX_ATRAKTOR_KMH = 30;
  const DEFAULT_VIEW = [56.879, 14.805];
  const SWEDEN_BBOX = "10.0,55.0,24.5,69.2"; // lon_min,lat_min,lon_max,lat_max
  const OFF_ROUTE_METERS = 80;
  const REROUTE_COOLDOWN_MS = 10000;
  const ARRIVAL_METERS = 28;
  const TURN_HOLD_AFTER_METERS = 30;
  const CLOSE_NEXT_TURN_METERS = 115;
  const REROUTE_STATUS_MS = 1200;
  const TURN_LOCK_BEFORE_METERS = 50;
  const TURN_LOCK_AFTER_METERS = 60;
  const TURN_LOCK_CLOSE_AFTER_METERS = 10;
  const DRIVE_START_ZOOM_MOBILE = 18;
  const DRIVE_START_ZOOM_DESKTOP = 16;
  const CAMERA_LOOKAHEAD_MIN_M = 140;
  const CAMERA_LOOKAHEAD_NORMAL_M = 330;
  const CAMERA_LOOKAHEAD_MAX_M = 650;
  const CAMERA_LOOKAHEAD_TURN_MARGIN_M = 90;
  const CAMERA_LEAD_MIN_PX = 76;
  const CAMERA_LEAD_MAX_PX = 168;

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
    settingsBtn: document.getElementById("settingsBtn"),
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
    shareDestinationBtn: document.getElementById("shareDestinationBtn"),
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
    settingsSheet: document.getElementById("settingsSheet"),
    closeSettingsBtn: document.getElementById("closeSettingsBtn"),
    designModeSelect: document.getElementById("designModeSelect"),
    mapModeSelect: document.getElementById("mapModeSelect"),
    fuelConsumptionInput: document.getElementById("fuelConsumptionInput"),
    fuelPriceInput: document.getElementById("fuelPriceInput"),
    saveFuelSettingsBtn: document.getElementById("saveFuelSettingsBtn"),
    clearFuelSettingsBtn: document.getElementById("clearFuelSettingsBtn"),
    tapSheet: document.getElementById("tapSheet"),
    tapCoords: document.getElementById("tapCoords"),
    tapNavigateBtn: document.getElementById("tapNavigateBtn"),
    tapStartBtn: document.getElementById("tapStartBtn"),
    tapFavBtn: document.getElementById("tapFavBtn"),
    tapCopyBtn: document.getElementById("tapCopyBtn"),
    tapShareBtn: document.getElementById("tapShareBtn"),
    tapCloseBtn: document.getElementById("tapCloseBtn"),
    toast: document.getElementById("toast"),
    betaBadge: document.getElementById("betaBadge"),
    resumeFollowBtn: document.getElementById("resumeFollowBtn")
  };

  const state = {
    userPos: null,
    userAccuracy: null,
    userHeading: null,
    gpsHeading: null,
    displayHeading: null,
    headingTarget: null,
    lastCorridorHeading: null,
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
    advancedRouteShown: false,
    offRouteHits: 0,
    lastNavStepKey: "",
    lastRemainingRouteIndex: -1,
    demoActive: false,
    demoTimer: null,
    demoLongPressTimer: null,
    demoLongPressFired: false,
    demoWrongAnnounced: false,
    demoReturnAnnounced: false,
    demoWrongPlan: null,
    demoPath: [],
    demoIndex: 0,
    demoRerouting: false,
    demoRerouted: false,
    realUserPos: null,
    realUserAccuracy: null,
    realUserHeading: null,
    originalRoute: null,
    originalStart: null,
    originalCarRouteCoords: null,
    beforeTapPickView: null,
    navDisplayedStepKey: "",
    navVisibleInstructionSig: "",
    navStepAnimationTimer: null,
    arrivedHandled: false,
    drivenRouteLayer: null,
    navMaxDistanceAlong: 0,
    navRerouteStatusUntil: 0,
    turnLock: null,
    turnLockReleasedKey: "",
    navStepAnimationCleanupTimer: null,
    navStepAnimationSeq: 0,
    resumeFollowHideTimer: null,
    stepMarkers: [],
    highlightedStepIndex: -1,
    fuelSettings: { consumptionLPerMil: 0, pricePerLiter: 0 },
    designMode: "cockpit",
    mapMode: "smart",
    mapRotation: 0,
    targetMapRotation: 0,
    mapRotationAnimFrame: null,
    lastMapRotationFrameAt: 0,
    mapBearingApplied: false,
    lastMapRotationAt: 0,
    lastHeadingUpdateAt: 0,
    routeMetaPrimary: "",
    routeMetaFuel: "",
    routeMetaCycleTimer: null,
    routeMetaShowingFuel: false,
    sharedDestinationAutoRoute: false,
    sharedDestinationOpened: false,
    lastSharedDestinationHash: "",
    wakeLock: null,
    manualMapModeTimer: null
  };

  const map = L.map("map", {
    zoomControl: false,
    attributionControl: true,
    rotate: true,
    touchRotate: false,
    rotateControl: false,
    bearing: 0
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

  function animateUiCard(node, direction = "in") {
    if (!node) return;
    clearTimeout(node._uiCardTimer);
    node.classList.remove("ui-card-in", "ui-card-out", "route-enter", "route-exit", "panel-opening", "panel-closing", "panel-simple-opening", "panel-simple-closing");
    void node.offsetWidth;
    node.classList.add(direction === "out" ? "ui-card-out" : "ui-card-in");
    node._uiCardTimer = window.setTimeout(() => {
      node.classList.remove("ui-card-in", "ui-card-out");
    }, 360);
  }

  function showUiCard(node) {
    if (!node) return;
    const wasHidden = node.classList.contains("hidden");
    node.classList.remove("hidden");
    if (wasHidden) animateUiCard(node, "in");
  }

  function hideUiCard(node, afterHide = null, animated = true) {
    if (!node) {
      if (afterHide) afterHide();
      return;
    }
    clearTimeout(node._uiCardTimer);
    if (!animated || node.classList.contains("hidden")) {
      node.classList.add("hidden");
      node.classList.remove("ui-card-in", "ui-card-out");
      if (afterHide) afterHide();
      return;
    }

    animateUiCard(node, "out");
    node._uiCardTimer = window.setTimeout(() => {
      node.classList.add("hidden");
      node.classList.remove("ui-card-in", "ui-card-out");
      if (afterHide) afterHide();
    }, 245);
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

    const wasCollapsed = state.panelCollapsed;
    state.panelCollapsed = Boolean(collapsed);
    clearTimeout(state.panelAnimationTimer);
    el.panel.classList.remove("panel-opening", "panel-closing", "panel-simple-opening", "panel-simple-closing");

    if (wasCollapsed !== state.panelCollapsed) {
      animateUiCard(el.panel, state.panelCollapsed ? "out" : "in");
    }

    document.body.classList.toggle("panel-collapsed", state.panelCollapsed);

    if (el.panelHandleText) {
      el.panelHandleText.textContent = state.panelCollapsed ? "🔍 Sök / favoriter" : "🔍 Minimera";
    }

    if (state.panelCollapsed) {
      el.destSuggestions.innerHTML = "";
      el.startSuggestions.innerHTML = "";
    }

    setRouteCompactMode();
  }

  function togglePanelCollapsed() {
    setPanelCollapsed(!state.panelCollapsed, { force: true });
  }

  function showApp() {
    el.boot.classList.add("fade");
    setTimeout(() => el.boot.classList.add("hidden"), 480);
    showUiCard(el.panel);

    if (state.sharedDestinationOpened && !isDesktopLayout()) {
      setPanelCollapsed(true, { force: true });
      window.setTimeout(() => setPanelCollapsed(true, { force: true }), 220);
    } else {
      setPanelCollapsed(false, { force: true });
    }

    setTimeout(() => map.invalidateSize(), 140);
  }

  function toast(message) {
    el.toast.textContent = message;
    el.toast.classList.remove("hidden");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => el.toast.classList.add("hidden"), 2400);
  }

  function parseFuelNumber(value) {
    const cleaned = String(value || "")
      .replace(",", ".")
      .replace(/[^\d.]/g, "");
    const num = Number(cleaned);
    return Number.isFinite(num) && num > 0 ? num : 0;
  }

  function formatFuelNumber(value, decimals = 2) {
    if (!Number.isFinite(value) || value <= 0) return "";
    return value.toFixed(decimals).replace(".", ",").replace(/,?0+$/, "");
  }

  function normalizeDesignMode(value) {
    return value === "classic" ? "classic" : "cockpit";
  }

  function applyDesignMode(mode) {
    state.designMode = normalizeDesignMode(mode);
    document.body.classList.toggle("design-classic", state.designMode === "classic");
    document.body.classList.toggle("design-cockpit", state.designMode === "cockpit");

    if (el.designModeSelect) {
      el.designModeSelect.value = state.designMode;
    }
  }

  function loadDesignMode() {
    // Första besök: Cockpit. Om användaren byter sparas valet lokalt.
    applyDesignMode(normalizeDesignMode(storageGet("30maps:designMode", "cockpit")));
  }

  function saveDesignMode(mode) {
    const normalized = normalizeDesignMode(mode);
    storageSet("30maps:designMode", normalized);
    applyDesignMode(normalized);
    toast(normalized === "classic" ? "Klassisk design vald" : "30maps Cockpit vald");
  }

  function normalizeMapMode(value) {
    // V6.6: Nord upp är borttaget som val. Gamla sparade "north" migreras till Smart körvy.
    return value === "heading" ? "heading" : "smart";
  }

  function mapModeLabel(mode) {
    if (mode === "heading") return "Färdriktning uppåt beta";
    return "Smart körvy";
  }

  function applyMapMode(mode) {
    state.mapMode = normalizeMapMode(mode);
    document.body.classList.toggle("map-mode-smart", state.mapMode === "smart");
    document.body.classList.toggle("map-mode-heading", state.mapMode === "heading");

    if (el.mapModeSelect) {
      el.mapModeSelect.value = state.mapMode;
    }

    if (map) map.invalidateSize();
    updateMapRotation(true);

    if (state.follow && state.userPos) {
      window.setTimeout(() => followUserPosition(state.userPos.lat, state.userPos.lon, { duration: 0.2 }), 40);
    }
  }

  function loadMapMode() {
    // Standard är säkra Smart körvy. Äkta heading-up är valbar beta.
    applyMapMode(normalizeMapMode(storageGet("30maps:mapMode", "smart")));
  }

  function saveMapMode(mode) {
    const normalized = normalizeMapMode(mode);
    storageSet("30maps:mapMode", normalized);
    applyMapMode(normalized);
    if (normalized === "heading" && !hasNativeMapRotation()) {
      toast("Heading-up kunde inte laddas, Smart körvy används");
    } else {
      toast(`${mapModeLabel(normalized)} vald`);
    }
  }

  function hasNativeMapRotation() {
    return Boolean(map && typeof map.setBearing === "function");
  }

  function shouldRotateMap() {
    return (
      state.mapMode === "heading" &&
      hasNativeMapRotation() &&
      state.navigating &&
      state.follow &&
      !state.arrivedHandled &&
      Number.isFinite(state.displayHeading)
    );
  }

  function applyNativeMapBearing(value, active = shouldRotateMap()) {
    const nativeRotation = hasNativeMapRotation();
    state.mapBearingApplied = false;

    if (nativeRotation) {
      try {
        map.setBearing(normalizeHeading(value || 0) || 0);
        state.mapBearingApplied = Boolean(active);
      } catch (err) {
        console.warn("Heading-up rotation failed", err);
      }
    }

    document.documentElement.style.setProperty("--map-rotation", "0deg");
    document.documentElement.style.setProperty("--map-marker-counter", "0deg");
    document.documentElement.style.setProperty("--heading-up-scale", "1");
    document.body.classList.toggle("heading-up-active", Boolean(active && state.mapBearingApplied));
    document.body.classList.toggle("heading-up-fallback", state.mapMode === "heading" && (!nativeRotation || !state.mapBearingApplied));
  }

  function stopMapRotationAnimation() {
    if (state.mapRotationAnimFrame) {
      cancelAnimationFrame(state.mapRotationAnimFrame);
      state.mapRotationAnimFrame = null;
    }
    state.lastMapRotationFrameAt = 0;
  }

  async function requestWakeLock() {
    if (!("wakeLock" in navigator) || !state.navigating || state.arrivedHandled) return;
    try {
      if (state.wakeLock) return;
      state.wakeLock = await navigator.wakeLock.request("screen");
      state.wakeLock.addEventListener("release", () => {
        state.wakeLock = null;
      });
    } catch (err) {
      console.warn("Wake Lock kunde inte aktiveras", err);
    }
  }

  async function releaseWakeLock() {
    const lock = state.wakeLock;
    state.wakeLock = null;
    if (lock) {
      try {
        await lock.release();
      } catch (err) {
        console.warn("Wake Lock kunde inte släppas", err);
      }
    }
  }

  function animateMapRotationFrame(timestamp) {
    state.mapRotationAnimFrame = null;

    const active = shouldRotateMap();
    const nativeRotation = hasNativeMapRotation();

    if (!active || !nativeRotation) {
      state.mapRotation = 0;
      state.targetMapRotation = 0;
      applyNativeMapBearing(0, false);
      state.lastMapRotationFrameAt = 0;
      return;
    }

    const now = Number.isFinite(timestamp) ? timestamp : (performance && performance.now ? performance.now() : Date.now());
    const elapsed = state.lastMapRotationFrameAt ? Math.max(16, now - state.lastMapRotationFrameAt) : 16;
    state.lastMapRotationFrameAt = now;

    const current = normalizeHeading(state.mapRotation || 0) || 0;
    const target = normalizeHeading(state.targetMapRotation || 0) || 0;
    const delta = headingDelta(current, target);
    const absDelta = Math.abs(delta);

    if (absDelta < 0.18) {
      state.mapRotation = target;
      applyNativeMapBearing(state.mapRotation, true);
      return;
    }

    // Adaptiv rotationshastighet: små svängar glider lugnt, större riktningsbyte
    // får komma ikapp snabbare men utan synliga hopp.
    const maxDegPerSec = clamp(22 + absDelta * 1.55, 26, 54);
    const maxStep = Math.max(0.45, maxDegPerSec * (elapsed / 1000));
    const easedStep = Math.min(absDelta, Math.max(maxStep, absDelta * 0.105));
    const next = normalizeHeading(current + Math.sign(delta) * easedStep);

    state.mapRotation = next || 0;
    applyNativeMapBearing(state.mapRotation, true);

    state.mapRotationAnimFrame = requestAnimationFrame(animateMapRotationFrame);
  }

  function startMapRotationAnimation() {
    if (state.mapRotationAnimFrame) return;
    state.mapRotationAnimFrame = requestAnimationFrame(animateMapRotationFrame);
  }

  function updateHeadingUpMapOrigin() {
    // V6.6.2: gammal CSS-rotation är borttagen. Funktionen finns kvar som no-op
    // för äldre event hooks.
  }

  function updateMapRotation(force = false) {
    const nativeRotation = hasNativeMapRotation();
    const active = shouldRotateMap();

    // leaflet-rotate använder motsatt tecken jämfört med vår GPS/bearing-vinkel:
    // för att färdriktningen ska hamna uppåt måste kartans bearing inverteras.
    const target = active ? (normalizeHeading(-(state.displayHeading || 0)) || 0) : 0;
    const current = normalizeHeading(state.mapRotation || 0) || 0;
    const delta = Math.abs(headingDelta(current, target));
    const now = performance && performance.now ? performance.now() : Date.now();

    if (!active || !nativeRotation) {
      state.targetMapRotation = 0;
      stopMapRotationAnimation();
      state.mapRotation = 0;
      applyNativeMapBearing(0, false);
      return;
    }

    // V6.6.7: route-corridor bestämmer target-bearing. Själva kartan glider
    // mot target via requestAnimationFrame så rotationen inte sker i steg.
    if (!force && delta < 1.0) return;
    if (!force && now - (state.lastMapRotationAt || 0) < 90) return;

    state.targetMapRotation = target;
    state.lastMapRotationAt = now;

    if (force) {
      state.mapRotation = target;
      state.lastMapRotationFrameAt = 0;
      applyNativeMapBearing(state.mapRotation, true);
      return;
    }

    startMapRotationAnimation();
  }

  function loadFuelSettings() {
    const saved = storageGet("30maps:fuelSettings", {});
    state.fuelSettings = {
      consumptionLPerMil: Number(saved.consumptionLPerMil) > 0 ? Number(saved.consumptionLPerMil) : 0,
      pricePerLiter: Number(saved.pricePerLiter) > 0 ? Number(saved.pricePerLiter) : 0
    };
  }

  function saveFuelSettings(settings) {
    state.fuelSettings = {
      consumptionLPerMil: Number(settings.consumptionLPerMil) > 0 ? Number(settings.consumptionLPerMil) : 0,
      pricePerLiter: Number(settings.pricePerLiter) > 0 ? Number(settings.pricePerLiter) : 0
    };
    storageSet("30maps:fuelSettings", state.fuelSettings);
  }

  function renderSettingsForm() {
    if (el.designModeSelect) {
      el.designModeSelect.value = state.designMode || "cockpit";
    }

    if (el.mapModeSelect) {
      el.mapModeSelect.value = state.mapMode || "smart";
    }

    if (!el.fuelConsumptionInput || !el.fuelPriceInput) return;
    el.fuelConsumptionInput.value = state.fuelSettings.consumptionLPerMil
      ? formatFuelNumber(state.fuelSettings.consumptionLPerMil, 2)
      : "";
    el.fuelPriceInput.value = state.fuelSettings.pricePerLiter
      ? formatFuelNumber(state.fuelSettings.pricePerLiter, 2)
      : "";
  }

  function renderFuelSettingsForm() {
    renderSettingsForm();
  }

  function showSettings() {
    renderSettingsForm();
    showUiCard(el.settingsSheet);
  }

  function hideSettings() {
    hideUiCard(el.settingsSheet);
  }

  function saveFuelSettingsFromForm() {
    const consumption = parseFuelNumber(el.fuelConsumptionInput?.value);
    const price = parseFuelNumber(el.fuelPriceInput?.value);
    saveFuelSettings({ consumptionLPerMil: consumption, pricePerLiter: price });

    if (consumption) {
      toast("Bränsleberäkning sparad");
    } else {
      toast("Bränsleberäkning avstängd");
    }

    updateCurrentRouteMeta();
    hideSettings();
  }

  function clearFuelSettings() {
    saveFuelSettings({ consumptionLPerMil: 0, pricePerLiter: 0 });
    renderFuelSettingsForm();
    updateCurrentRouteMeta();
    toast("Bränsleberäkning avstängd");
    hideSettings();
  }

  function buildFuelMetaText(distanceMeters) {
    const consumption = state.fuelSettings?.consumptionLPerMil || 0;
    if (!consumption || !Number.isFinite(distanceMeters)) return "";

    const km = Math.max(0, distanceMeters / 1000);
    const liters = (km / 10) * consumption;
    if (!Number.isFinite(liters) || liters <= 0) return "";

    const literText = `ca ${formatFuelNumber(liters, liters < 1 ? 2 : 1)} L`;
    const price = state.fuelSettings?.pricePerLiter || 0;

    if (price) {
      const cost = Math.round(liters * price);
      return `${literText} · ca ${cost} kr`;
    }

    return literText;
  }

  function clearRouteMetaCycle() {
    clearInterval(state.routeMetaCycleTimer);
    state.routeMetaCycleTimer = null;
    state.routeMetaShowingFuel = false;
  }

  function writeRouteMeta(text, animate = false) {
    if (!el.routeMeta) return;

    if (!animate) {
      el.routeMeta.classList.remove("route-meta-fade");
      el.routeMeta.textContent = text || "";
      return;
    }

    el.routeMeta.classList.add("route-meta-fade");
    window.setTimeout(() => {
      el.routeMeta.textContent = text || "";
      el.routeMeta.classList.remove("route-meta-fade");
    }, 130);
  }

  function setRouteMeta(primaryText, distanceMeters = null) {
    clearRouteMetaCycle();

    state.routeMetaPrimary = primaryText || "";
    state.routeMetaFuel = buildFuelMetaText(distanceMeters);
    state.routeMetaShowingFuel = false;

    writeRouteMeta(state.routeMetaPrimary, false);

    if (!state.routeMetaFuel) return;

    state.routeMetaCycleTimer = window.setInterval(() => {
      state.routeMetaShowingFuel = !state.routeMetaShowingFuel;
      writeRouteMeta(state.routeMetaShowingFuel ? state.routeMetaFuel : state.routeMetaPrimary, true);
    }, 3400);
  }

  function updateCurrentRouteMeta() {
    if (state.route && Number.isFinite(state.route.distance)) {
      const km = (state.route.distance / 1000).toFixed(1);
      setRouteMeta(`${km} km · ${etaFromMeters(state.route.distance)}`, state.route.distance);
    } else {
      setRouteMeta(state.routeMetaPrimary || "");
    }
  }


  function errorBox(title, detail) {
    showRouteCard();
    el.routeTitle.textContent = title;
    el.routeSubtitle.textContent = detail || "";
    setRouteMeta("");
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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizeHeading(deg) {
    if (!Number.isFinite(deg)) return null;
    return ((deg % 360) + 360) % 360;
  }

  function headingDelta(from, to) {
    return ((to - from + 540) % 360) - 180;
  }

  function bearingBetween(a, b) {
    if (!a || !b) return null;
    const lat1 = a.lat * Math.PI / 180;
    const lat2 = b.lat * Math.PI / 180;
    const dLon = (b.lon - a.lon) * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return normalizeHeading(Math.atan2(y, x) * 180 / Math.PI);
  }

  function weightedAverageHeading(headings) {
    if (!headings || !headings.length) return null;

    let x = 0;
    let y = 0;
    let total = 0;

    headings.forEach(item => {
      const heading = normalizeHeading(item.heading);
      const weight = Number(item.weight) > 0 ? Number(item.weight) : 1;
      if (heading === null) return;
      const rad = heading * Math.PI / 180;
      x += Math.sin(rad) * weight;
      y += Math.cos(rad) * weight;
      total += weight;
    });

    if (!total || Math.hypot(x, y) < 0.001) return null;
    return normalizeHeading(Math.atan2(x, y) * 180 / Math.PI);
  }

  function smoothRouteBearingAhead(progress) {
    if (!progress || progress.offRouteDistance > OFF_ROUTE_METERS) return null;

    const base = progress.point
      ? { lat: progress.point[0], lon: progress.point[1] }
      : null;
    if (!base) return null;

    // V6.6.8: turn-gate. På rak väg tittar korridoren långt fram, men när en
    // tydlig sväng närmar sig får den inte titta för långt förbi svängen för tidigt.
    const toTurn = nextCameraInstructionDistance(progress.distanceAlong);
    const nearTurn = Number.isFinite(toTurn) && toTurn < 125;

    let samples = [
      { meters: 32, weight: 0.70 },
      { meters: 62, weight: 1.00 },
      { meters: 105, weight: 1.45 },
      { meters: 155, weight: 1.20 },
      { meters: 210, weight: 0.75 }
    ];

    if (nearTurn) {
      const gate = clamp(toTurn + 18, 38, 128);
      const afterWeight = toTurn < 42 ? 0.95 : toTurn < 75 ? 0.48 : 0.18;
      samples = [
        { meters: Math.min(28, gate), weight: 1.10 },
        { meters: Math.min(52, gate), weight: 1.35 },
        { meters: Math.min(82, gate), weight: 1.00 },
        { meters: Math.min(126, gate + 28), weight: afterWeight }
      ];
    }

    const headings = [];
    for (const s of samples) {
      const point = routePointAtDistanceAlong(progress.distanceAlong + s.meters);
      if (!point) continue;
      const b = bearingBetween(base, point);
      if (b === null) continue;
      headings.push({ heading: b, weight: s.weight, meters: s.meters });
    }

    if (!headings.length) return null;

    const avg = weightedAverageHeading(headings);
    if (avg === null) return null;

    const short = headings[0]?.heading ?? avg;
    const mid = headings[Math.min(2, headings.length - 1)]?.heading ?? avg;
    const long = headings[headings.length - 1]?.heading ?? avg;
    const current = normalizeHeading(state.displayHeading);
    const previous = normalizeHeading(state.lastCorridorHeading);
    const spread = Math.max(
      Math.abs(headingDelta(short, mid)),
      Math.abs(headingDelta(mid, long)),
      Math.abs(headingDelta(short, long))
    );

    const corridorDelta = current === null ? 999 : Math.abs(headingDelta(current, avg));
    const longDelta = current === null ? 999 : Math.abs(headingDelta(current, long));
    const returnsBack = Math.abs(headingDelta(short, long)) < 7 && Math.abs(headingDelta(short, mid)) > 8;

    // Före sväng: håll kvar den nuvarande vägkänslan längre och blanda inte in
    // vägen efter svängen förrän man faktiskt är nära.
    if (current !== null && nearTurn && toTurn > 55 && corridorDelta < 28) {
      const preTurn = weightedAverageHeading([
        { heading: short, weight: 1.55 },
        { heading: mid, weight: 1.10 },
        { heading: current, weight: 1.20 }
      ]);
      return preTurn ?? current;
    }

    if (current !== null && returnsBack && corridorDelta < 18) {
      return current;
    }

    if (current !== null && spread > 18 && longDelta < 12) {
      return current;
    }

    let result = avg;
    if (spread > 14) {
      const longWeighted = weightedAverageHeading([
        { heading: mid, weight: nearTurn ? 1.30 : 0.85 },
        { heading: long, weight: nearTurn ? 0.75 : 1.45 },
        { heading: avg, weight: 0.70 }
      ]);
      if (longWeighted !== null) result = longWeighted;
    }

    if (previous !== null && Math.abs(headingDelta(previous, result)) < (nearTurn ? 3.5 : 5.5)) {
      result = previous;
    }

    state.lastCorridorHeading = result;
    return result;
  }

  function smoothHeading(current, target, factor = 0.34) {
    const normalizedTarget = normalizeHeading(target);
    if (normalizedTarget === null) return current;
    const normalizedCurrent = normalizeHeading(current);
    if (normalizedCurrent === null) return normalizedTarget;
    return normalizeHeading(normalizedCurrent + headingDelta(normalizedCurrent, normalizedTarget) * factor);
  }

  function routeBearingAhead(lat, lon) {
    if (!state.navigating || !state.route || !state.route.coords || state.route.coords.length < 2) return null;

    const progress = getCameraRouteProgress(lat, lon);
    // Vid felkörning/off-route ska pilen visa verklig färdriktning, inte vägen man skulle kört.
    if (!progress || progress.offRouteDistance > OFF_ROUTE_METERS) return null;

    // V6.6.6: använd route-corridor så små böjar som går tillbaka inte roterar kartan.
    const smoothed = smoothRouteBearingAhead(progress);
    if (smoothed !== null) return smoothed;

    const base = progress.point
      ? { lat: progress.point[0], lon: progress.point[1] }
      : { lat, lon };
    const lookahead = clamp(cameraLookaheadMeters(progress.distanceAlong) * 0.18, 28, 76);
    const ahead = routePointAtDistanceAlong(progress.distanceAlong + lookahead);
    return bearingBetween(base, ahead);
  }

  function updateSmartUserHeading(lat, lon, previousPos = null) {
    const routeHeading = routeBearingAhead(lat, lon);
    let target = routeHeading;

    if (target === null && typeof state.gpsHeading === "number" && Number.isFinite(state.gpsHeading)) {
      target = state.gpsHeading;
    }

    if (target === null && previousPos && haversine(previousPos, { lat, lon }) > 5) {
      target = bearingBetween(previousPos, { lat, lon });
    }

    if (target === null) return;

    const now = performance && performance.now ? performance.now() : Date.now();
    const elapsedMs = state.lastHeadingUpdateAt ? Math.max(16, now - state.lastHeadingUpdateAt) : 180;
    state.lastHeadingUpdateAt = now;

    const current = normalizeHeading(state.displayHeading);
    const normalizedTarget = normalizeHeading(target);
    if (normalizedTarget === null) return;

    // V6.6.5: låg deadband. Vägen ska fortfarande ligga uppåt, men små jitter
    // i ruttens geometri ska inte ge synliga ryck.
    if (current !== null && Math.abs(headingDelta(current, normalizedTarget)) < 2.8) {
      state.headingTarget = normalizedTarget;
      return;
    }

    state.headingTarget = normalizedTarget;

    const maxDegPerSec = routeHeading !== null ? 34 : 46;
    const maxStep = Math.max(1.2, maxDegPerSec * (elapsedMs / 1000));
    const delta = current === null ? 0 : headingDelta(current, normalizedTarget);

    let next;
    if (current === null) {
      next = normalizedTarget;
    } else if (Math.abs(delta) <= maxStep) {
      next = normalizedTarget;
    } else {
      next = normalizeHeading(current + Math.sign(delta) * maxStep);
    }

    // Lätt extra smoothing efter maxhastigheten så kurvor inte känns hackiga.
    const blend = routeHeading !== null ? 0.64 : 0.76;
    state.displayHeading = current === null ? next : smoothHeading(current, next, blend);
    state.userHeading = state.displayHeading;
    updateMapRotation(false);
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

  function getAppBaseUrl() {
    const configured = window.MAPS_CONFIG && typeof window.MAPS_CONFIG.APP_BASE_URL === "string"
      ? window.MAPS_CONFIG.APP_BASE_URL.trim()
      : "";

    try {
      const url = new URL(configured || "./", window.location.href);
      url.hash = "";
      url.search = "";
      let out = url.toString();
      if (!out.endsWith("/")) out += "/";
      return out;
    } catch {
      return new URL("./", window.location.href).toString();
    }
  }

  function makeDestinationShareUrl(place) {
    const url = new URL(getAppBaseUrl());
    const params = new URLSearchParams();
    params.set("dest", `${Number(place.lat).toFixed(6)},${Number(place.lon).toFixed(6)}`);
    if (place.label) params.set("label", String(place.label).slice(0, 160));
    url.hash = params.toString();
    return url.toString();
  }

  async function copyShareLink(text) {
    if (navigator.clipboard && window.isSecureContext !== false) {
      try {
        await navigator.clipboard.writeText(text);
        toast("Länk kopierad");
        return;
      } catch {
        // Faller vidare till prompt.
      }
    }
    prompt("Kopiera länken:", text);
  }

  async function shareDestination(place) {
    if (!place || !Number.isFinite(Number(place.lat)) || !Number.isFinite(Number(place.lon))) {
      toast("Inget mål att dela");
      return;
    }

    const label = place.label || fmtCoord(place.lat, place.lon);
    const url = makeDestinationShareUrl({ ...place, label });
    const title = "Mål i 30maps";
    const text = `Mål i 30maps: ${shortName(label)}\nÖppna och räkna A-traktor-rutt dit.`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
        console.warn("Share failed, copying link instead", err);
      }
    }

    await copyShareLink(url);
  }

  function parseSharedDestinationFromHash() {
    const hash = String(window.location.hash || "").replace(/^#/, "");
    if (!hash) return null;

    const params = new URLSearchParams(hash);
    const rawDest = params.get("dest") || params.get("mål") || "";
    const parts = rawDest.split(",").map(v => Number(v.trim()));

    if (parts.length !== 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) return null;

    const lat = parts[0];
    const lon = parts[1];
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;

    const label = params.get("label") || params.get("namn") || `Delat mål ${fmtCoord(lat, lon)}`;
    return { lat, lon, label, shared: true };
  }

  function showSharedDestinationPendingCard(place) {
    showRouteCard();
    el.routeTitle.textContent = shortName(place.label || "Delat mål");
    el.routeSubtitle.textContent = "Delat mål · väntar på GPS";
    setRouteMeta(fmtCoord(place.lat, place.lon));
    el.nextInstruction.classList.add("hidden");
    el.routeWarning.classList.add("hidden");
    if (el.routeAdvancedBtn) el.routeAdvancedBtn.classList.add("hidden");
    updateShareButtons();
    setRouteCompactMode();
  }

  function handleSharedDestinationLink({ force = false } = {}) {
    const hash = String(window.location.hash || "");
    if (!force && hash === state.lastSharedDestinationHash) return false;

    const place = parseSharedDestinationFromHash();
    if (!place) return false;

    state.lastSharedDestinationHash = hash;
    state.sharedDestinationAutoRoute = true;
    state.sharedDestinationOpened = true;

    setDestination(place, false);
    showSharedDestinationPendingCard(place);
    if (!isDesktopLayout()) {
      setPanelCollapsed(true, { force: true });
      window.setTimeout(() => setPanelCollapsed(true, { force: true }), 260);
      window.setTimeout(() => setPanelCollapsed(true, { force: true }), 850);
    } else {
      setRouteCompactMode();
    }

    map.flyTo([place.lat, place.lon], Math.max(map.getZoom(), 15), { animate: true, duration: 0.35 });
    toast("Delat mål öppnat");

    if (state.userPos && !state.isRouting) {
      state.sharedDestinationAutoRoute = false;
      window.setTimeout(() => calculateRoute(), 180);
    }

    return true;
  }

  function updateShareButtons() {
    if (el.shareDestinationBtn) {
      el.shareDestinationBtn.classList.toggle("hidden", !state.destination);
    }
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
    const heading = (shouldRotateMap() && state.mapBearingApplied)
      ? 0
      : (normalizeHeading(state.displayHeading ?? state.userHeading ?? 0) ?? 0);
    const smart = state.navigating && state.route ? " smart-heading" : "";
    return L.divIcon({
      className: "",
      html: `<div class="user-dot-wrap${smart}" style="transform:rotate(${heading}deg)">
               <div class="user-heading"></div>
               <div class="user-dot"></div>
             </div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
  }

  function makePinIcon(kind) {
    const label = kind === "start" ? "S" : kind === "preview" ? "•" : "M";
    return L.divIcon({
      className: "",
      html: `<div class="map-pin map-pin-${kind}"><span>${label}</span></div>`,
      iconSize: [34, 42],
      iconAnchor: [17, 38],
      popupAnchor: [0, -38]
    });
  }

  function routePointAtDistanceAlong(distanceAlong) {
    const route = state.route;
    const coords = route?.coords || [];
    if (!coords.length) return null;
    if (coords.length === 1) return { lat: coords[0][0], lon: coords[0][1] };

    const target = clamp(distanceAlong || 0, 0, route.distance || Infinity);
    const cumulative = route.cumulative || [];

    for (let i = 0; i < coords.length - 1; i++) {
      const a = coords[i];
      const b = coords[i + 1];
      const aDist = cumulative[i] || 0;
      const bDist = cumulative[i + 1] ?? (aDist + haversine({ lat: a[0], lon: a[1] }, { lat: b[0], lon: b[1] }));

      if (target <= bDist) {
        const segLen = Math.max(1, bDist - aDist);
        const t = clamp((target - aDist) / segLen, 0, 1);
        return {
          lat: a[0] + (b[0] - a[0]) * t,
          lon: a[1] + (b[1] - a[1]) * t
        };
      }
    }

    const last = coords[coords.length - 1];
    return { lat: last[0], lon: last[1] };
  }

  function nextCameraInstructionDistance(distanceAlong) {
    const steps = state.route?.instructions || [];
    if (!steps.length) return Infinity;

    const d = Math.max(0, distanceAlong || 0);
    const turnStep = steps.find(s => isTurnLikeInstruction(s) && (s.distanceFromStart || 0) > d + 15);
    const step = turnStep || steps.find(s => (s.distanceFromStart || 0) > d + 15);
    return step ? Math.max(0, (step.distanceFromStart || 0) - d) : Infinity;
  }

  function cameraLookaheadMeters(distanceAlong) {
    const toTurn = nextCameraInstructionDistance(distanceAlong);

    // Viktigt: om nästa sväng är flera km bort ska vi inte zooma/kika flera km fram.
    if (!Number.isFinite(toTurn) || toTurn > 1200) return CAMERA_LOOKAHEAD_NORMAL_M;

    // När en sväng börjar närma sig får kameran kika lite längre,
    // men alltid med maxgräns så körläget inte blir för utzoomat.
    if (toTurn > 520) {
      return clamp(toTurn + CAMERA_LOOKAHEAD_TURN_MARGIN_M, CAMERA_LOOKAHEAD_NORMAL_M, CAMERA_LOOKAHEAD_MAX_M);
    }

    if (toTurn > 135) {
      return clamp(toTurn + CAMERA_LOOKAHEAD_TURN_MARGIN_M, 260, CAMERA_LOOKAHEAD_MAX_M);
    }

    // Nära sväng: håll vyn mer exakt igen så man inte tappar känslan i korsningen.
    if (toTurn > 55) return clamp(toTurn + 70, CAMERA_LOOKAHEAD_MIN_M, 285);

    return CAMERA_LOOKAHEAD_MIN_M;
  }

  function getCameraRouteProgress(lat, lon) {
    if (!state.route || !state.route.coords || state.route.coords.length < 2) return null;
    try {
      return getRouteProgress({ lat, lon }, state.route.coords, state.route.cumulative || []);
    } catch {
      return null;
    }
  }

  function getCameraAheadVector(lat, lon, zoom, progress) {
    const projected = map.project([lat, lon], zoom);

    if (progress && progress.offRouteDistance < OFF_ROUTE_METERS * 2.5) {
      const lookahead = cameraLookaheadMeters(progress.distanceAlong);
      const aheadPoint = routePointAtDistanceAlong(progress.distanceAlong + lookahead);
      if (aheadPoint) {
        const aheadProjected = map.project([aheadPoint.lat, aheadPoint.lon], zoom);
        const vx = aheadProjected.x - projected.x;
        const vy = aheadProjected.y - projected.y;
        const len = Math.hypot(vx, vy);
        if (len > 4) {
          return {
            x: vx / len,
            y: vy / len,
            meters: lookahead,
            toTurn: nextCameraInstructionDistance(progress.distanceAlong)
          };
        }
      }
    }

    // Fallback om ruttriktning saknas: använd GPS-heading om den finns.
    if (typeof state.userHeading === "number" && Number.isFinite(state.userHeading)) {
      const rad = state.userHeading * Math.PI / 180;
      return {
        x: Math.sin(rad),
        y: -Math.cos(rad),
        meters: CAMERA_LOOKAHEAD_NORMAL_M,
        toTurn: Infinity
      };
    }

    return null;
  }

  function getHeadingUpTargetZoom(lat, lon, progress = null) {
    const p = progress || getCameraRouteProgress(lat, lon);
    const current = Number.isFinite(map.getZoom()) ? map.getZoom() : DRIVE_START_ZOOM_MOBILE;

    if (!state.navigating || state.mapMode !== "heading") {
      return current;
    }

    const mobile = !isDesktopLayout();
    let target = mobile ? 17.15 : 16.15;

    if (p && p.offRouteDistance > OFF_ROUTE_METERS) {
      // Vid felkörning: lite mer överblick tills ny rutt räknats fram.
      target = mobile ? 16.55 : 15.85;
    } else if (p) {
      const toTurn = nextCameraInstructionDistance(p.distanceAlong);

      if (Number.isFinite(toTurn) && toTurn <= 85) {
        target = mobile ? 17.55 : 16.65;
      } else if (Number.isFinite(toTurn) && toTurn <= 220) {
        target = mobile ? 17.30 : 16.35;
      } else if (Number.isFinite(toTurn) && toTurn >= 900) {
        target = mobile ? 16.95 : 16.0;
      }
    }

    // Undvik stora plötsliga hopp, men låt heading-up få egen zoom jämfört med Smart körvy.
    const maxStep = 0.12;
    return clamp(target, current - maxStep, current + maxStep);
  }

  function getFollowTargetCenter(lat, lon, zoom = map.getZoom(), options = {}) {
    if (!state.navigating || isDesktopLayout()) return L.latLng(lat, lon);

    const size = map.getSize();

    // V6.6.4: med riktig Leaflet-bearing placerar vi GPS-markören längre ner
    // genom att flytta kamerans centrum framåt i färdriktningen. Det ger mer väg
    // framför fordonet utan att återinföra den gamla CSS-pane-rotationen.
    if (state.mapMode === "heading" && hasNativeMapRotation()) {
      const navTopRect = el.navTop && !el.navTop.classList.contains("hidden") ? el.navTop.getBoundingClientRect() : null;
      const navBottomRect = el.navBottom && !el.navBottom.classList.contains("hidden") ? el.navBottom.getBoundingClientRect() : null;
      const topLimit = navTopRect ? navTopRect.bottom + 74 : size.y * 0.18;
      const bottomTop = navBottomRect ? navBottomRect.top : size.y - 105;
      const desiredY = clamp(size.y * 0.70, topLimit + 62, bottomTop - 88);
      const screenOffsetY = Math.max(0, desiredY - size.y / 2);

      const heading = normalizeHeading(state.displayHeading ?? state.userHeading ?? 0) ?? 0;
      const rad = heading * Math.PI / 180;
      const projected = map.project([lat, lon], zoom);

      return map.unproject(L.point(
        projected.x + Math.sin(rad) * screenOffsetY,
        projected.y - Math.cos(rad) * screenOffsetY
      ), zoom);
    }

    const navTopRect = el.navTop && !el.navTop.classList.contains("hidden") ? el.navTop.getBoundingClientRect() : null;
    const navBottomRect = el.navBottom && !el.navBottom.classList.contains("hidden") ? el.navBottom.getBoundingClientRect() : null;

    const topLimit = navTopRect ? navTopRect.bottom + 95 : size.y * 0.22;
    const bottomTop = navBottomRect ? navBottomRect.top : size.y - 105;

    // Grundläge: markören ligger ovanför nedersta navigationsrutan.
    let desiredX = size.x * 0.5;
    let desiredY = Math.max(topLimit, Math.min(bottomTop - 86, size.y * 0.72));

    // Smart körvy, eller fallback om heading-up-plugin saknas.
    const progress = options.progress || getCameraRouteProgress(lat, lon);
    const ahead = getCameraAheadVector(lat, lon, zoom, progress);

    if (ahead) {
      const nearTurn = Number.isFinite(ahead.toTurn) && ahead.toTurn <= 650;
      const veryNearTurn = Number.isFinite(ahead.toTurn) && ahead.toTurn <= 90;

      let leadPx = Math.min(CAMERA_LEAD_MAX_PX, size.x * 0.31, size.y * 0.23);
      if (!nearTurn) leadPx *= 0.84;
      if (veryNearTurn) leadPx *= 0.78;
      leadPx = clamp(leadPx, CAMERA_LEAD_MIN_PX, CAMERA_LEAD_MAX_PX);

      const minX = Math.max(54, size.x * 0.18);
      const maxX = Math.min(size.x - 54, size.x * 0.82);
      const minY = topLimit + 16;
      const maxY = bottomTop - 74;

      desiredX = clamp(desiredX - ahead.x * leadPx, minX, maxX);
      desiredY = clamp(desiredY - ahead.y * leadPx, minY, maxY);
    }

    const projected = map.project([lat, lon], zoom);
    const desiredCenterPoint = L.point(
      projected.x + size.x / 2 - desiredX,
      projected.y + size.y / 2 - desiredY
    );
    return map.unproject(desiredCenterPoint, zoom);
  }

  function followUserPosition(lat, lon, options = {}) {
    if (!state.follow) return;

    const progress = options.progress || getCameraRouteProgress(lat, lon);
    const zoom = options.zoom ?? (
      state.mapMode === "heading" && hasNativeMapRotation()
        ? getHeadingUpTargetZoom(lat, lon, progress)
        : map.getZoom()
    );
    const targetCenter = getFollowTargetCenter(lat, lon, zoom, { ...options, progress });

    if (options.setView) {
      map.setView(targetCenter, zoom, { animate: true });
      return;
    }

    if (state.mapMode === "heading" && hasNativeMapRotation() && Math.abs(map.getZoom() - zoom) > 0.38) {
      map.setView(targetCenter, zoom, { animate: true });
      return;
    }

    map.panTo(targetCenter, { animate: true, duration: options.duration ?? 0.38 });
  }


  function enterDrivingView(options = {}) {
    const pos = state.userPos || getStartForRoute();
    if (!pos) return;

    const minZoom = isDesktopLayout() ? DRIVE_START_ZOOM_DESKTOP : DRIVE_START_ZOOM_MOBILE;
    const targetZoom = state.mapMode === "heading" && hasNativeMapRotation()
      ? Math.max(getHeadingUpTargetZoom(pos.lat, pos.lon), isDesktopLayout() ? 16.25 : 17.55)
      : Math.max(map.getZoom(), minZoom);

    // Räkna ut körläges-centrum med målzoomen och gör zoom+pan samtidigt.
    // V6.6.8: starta körläget närmare vägen på telefon.
    map.invalidateSize();
    followUserPosition(pos.lat, pos.lon, { zoom: targetZoom, setView: true });

    const settleFollow = () => {
      if (state.follow) followUserPosition(pos.lat, pos.lon, { duration: options.returning ? 0.38 : 0.22 });
    };
    map.once("moveend", settleFollow);
    window.setTimeout(settleFollow, options.returning ? 520 : 360);
  }

  function cloneRoute(route) {
    if (!route) return null;
    return {
      ...route,
      coords: (route.coords || []).map(c => [c[0], c[1]]),
      cumulative: (route.cumulative || []).slice(),
      instructions: (route.instructions || []).map(s => ({ ...s, point: s.point ? [s.point[0], s.point[1]] : s.point }))
    };
  }

  function clonePlace(place) {
    return place ? { ...place } : null;
  }

  function updateResumeFollowButton(options = {}) {
    if (!el.resumeFollowBtn) return;
    const shouldShow = state.navigating && !state.follow && !state.arrivedHandled;
    clearTimeout(state.resumeFollowHideTimer);

    if (shouldShow) {
      el.resumeFollowBtn.classList.remove("hidden", "resume-follow-hiding");
      return;
    }

    if (options.delayHide && !el.resumeFollowBtn.classList.contains("hidden")) {
      el.resumeFollowBtn.classList.add("resume-follow-hiding");
      state.resumeFollowHideTimer = window.setTimeout(() => {
        el.resumeFollowBtn.classList.add("hidden");
        el.resumeFollowBtn.classList.remove("resume-follow-hiding");
      }, 220);
      return;
    }

    el.resumeFollowBtn.classList.add("hidden");
    el.resumeFollowBtn.classList.remove("resume-follow-hiding");
  }

  function enterManualMapMode() {
    if (!state.navigating || !state.follow) return;
    clearTimeout(state.manualMapModeTimer);
    document.body.classList.add("manual-map-transition");
    setFollowMode(false, false, { manualPan: true });
    state.manualMapModeTimer = window.setTimeout(() => {
      document.body.classList.remove("manual-map-transition");
      document.body.classList.add("manual-map-mode");
    }, 260);
  }

  function leaveManualMapMode() {
    clearTimeout(state.manualMapModeTimer);
    document.body.classList.remove("manual-map-mode");
    document.body.classList.add("manual-map-returning");
    window.setTimeout(() => {
      document.body.classList.remove("manual-map-returning");
    }, 420);
  }

  function setFollowMode(on, showToast = true, options = {}) {
    const nextFollow = Boolean(on);
    state.follow = nextFollow;
    el.followBtn.textContent = state.follow ? "🧭 Följ: på" : "🧭 Följ: av";

    if (state.follow) {
      leaveManualMapMode();
    }

    updateResumeFollowButton({ delayHide: options.delayResumeHide });
    updateMapRotation(true);

    if (state.follow && state.userPos) {
      enterDrivingView({ returning: Boolean(options.delayResumeHide) });
    }

    if (showToast) toast(state.follow ? "Följläge på" : "Följläge av");
  }

  function showNavStatus(key, distanceText, instructionText, roadText = "", durationMs = 0) {
    if (!state.navigating) return;
    if (durationMs) state.navRerouteStatusUntil = Date.now() + durationMs;
    setNavInstructionContent(key, distanceText, instructionText, roadText);
  }

  function updateUserPosition(pos) {
    const isDemo = Boolean(pos.__demo);
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    // Under testläge ska riktig GPS sparas i bakgrunden men inte flytta kartmarkören.
    if (!isDemo) {
      state.realUserPos = { lat, lon };
      state.realUserAccuracy = pos.coords.accuracy || null;
      if (typeof pos.coords.heading === "number" && !Number.isNaN(pos.coords.heading)) {
        state.realUserHeading = pos.coords.heading;
      }
      if (state.demoActive) return;
    }

    const previousPos = state.userPos ? { ...state.userPos } : null;
    state.userPos = { lat, lon };
    state.userAccuracy = pos.coords.accuracy || null;

    if (typeof pos.coords.heading === "number" && !Number.isNaN(pos.coords.heading)) {
      state.gpsHeading = normalizeHeading(pos.coords.heading);
    }

    updateSmartUserHeading(lat, lon, previousPos);

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
      followUserPosition(lat, lon);
    }

    if (state.start.mode === "gps") {
      state.start.lat = lat;
      state.start.lon = lon;
    }

    if (state.sharedDestinationAutoRoute && state.destination && !state.route && !state.isRouting) {
      state.sharedDestinationAutoRoute = false;
      window.setTimeout(() => calculateRoute(), 120);
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
    state.tapPreviewMarker = L.marker([lat, lon], { icon: makePinIcon("preview") }).addTo(map).bindPopup("Vald plats");
  }

  function placeMarker(kind, place) {
    const latlng = [place.lat, place.lon];
    if (kind === "dest") {
      if (state.destMarker) map.removeLayer(state.destMarker);
      clearTapPreviewMarker();
      state.destMarker = L.marker(latlng, { icon: makePinIcon("dest") }).addTo(map).bindPopup("Destination");
    } else {
      if (state.startMarker) map.removeLayer(state.startMarker);
      clearTapPreviewMarker();
      if (state.start.mode !== "gps") {
        state.startMarker = L.marker(latlng, { icon: makePinIcon("start") }).addTo(map).bindPopup("Startpunkt");
      }
    }
  }

  function setDestination(place, routeNow = true) {
    state.originalRoute = null;
    state.originalStart = null;
    state.originalCarRouteCoords = null;
    state.arrivedHandled = false;
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
    hideUiCard(el.tapSheet);
    clearTapPreviewMarker();
    placeMarker("dest", state.destination);
    addRecent(state.destination);
    updateFavoriteButton();
    updateShareButtons();

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
    hideUiCard(el.tapSheet);
    placeMarker("start", state.start);
    toast("Startpunkt vald");

    if (!state.destination && state.beforeTapPickView) {
      const v = state.beforeTapPickView;
      map.setView(v.center, v.zoom, { animate: true });
      state.beforeTapPickView = null;
    }

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
    state.routeCardVisible = true;
    el.routeCard.classList.remove("route-enter", "route-exit");
    showUiCard(el.routeCard);
    setRouteCompactMode();
  }

  function hideRouteCard(animated = true) {
    state.routeCardVisible = false;
    document.body.classList.remove("route-compact");
    el.routeCard.classList.remove("route-enter", "route-exit");
    hideUiCard(el.routeCard, null, animated);
    if (typeof setAdvancedRouteVisible === "function") setAdvancedRouteVisible(false);
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
    el.routeSubtitle.textContent = options.reroute ? "Letar lagligare väg framåt" : "Jämför enklare 30 km/h-rutter";
    setRouteMeta("");
    el.nextInstruction.classList.add("hidden");
    el.routeWarning.classList.add("hidden");
    if (el.routeAdvancedBtn) el.routeAdvancedBtn.classList.add("hidden");

    try {
      let result = null;
      let routeStart = start;

      try {
        const starts = options.reroute ? buildRerouteStartCandidates(start) : [start];
        const settled = await Promise.allSettled(starts.map(candidate =>
          getSmartAtraktorRoute(candidate, dest, { reroute: Boolean(options.reroute) })
            .then(r => ({ ...r, routeStart: candidate }))
        ));

        const valid = settled
          .map(res => res.status === "fulfilled" ? res.value : null)
          .filter(Boolean)
          .filter(r => r.route && r.route.coords && r.route.coords.length);

        if (valid.length) {
          valid.forEach(r => {
            r.route.score = (r.route.score || 0) + (r.routeStart.forwardMeters || 0) * 0.22;
          });
          valid.sort((a, b) => (a.route.score || 0) - (b.route.score || 0));
          result = valid[0];
          routeStart = result.routeStart || start;
        }

        state.routeUsedFallback = false;
        state.turnLock = null;
        state.turnLockReleasedKey = "";
        state.navMaxDistanceAlong = 0;
      } catch (err) {
        console.warn("Smart Valhalla routing failed, using OSRM fallback", err);
      }

      if (!result || !result.route || !result.route.coords.length) {
        const fallbackStart = options.reroute ? (buildRerouteStartCandidates(start)[0] || start) : start;
        const fallback = await routeOsrmFallback(fallbackStart, dest);
        result = {
          route: fallback,
          chosen: {
            name: "Reservrutt",
            summary: "OSRM-reserv",
            useHighways: null
          },
          alternatives: [],
          reason: "Valhalla svarade inte, så appen använder reservrutt.",
          routeStart: fallbackStart
        };
        routeStart = fallbackStart;
        state.routeUsedFallback = true;
      }

      const route = result.route;
      state.route = route;
      state.arrivedHandled = false;
      state.navMaxDistanceAlong = 0;
      state.turnLock = null;
      state.turnLockReleasedKey = "";
      state.lastRemainingRouteIndex = -1;
      clearDrivenRoute();

      if (!options.reroute || !state.originalRoute) {
        state.originalRoute = cloneRoute(route);
        state.originalStart = clonePlace(start);
      }

      const currentCarRouteCoords =
        result.osrmCar && result.osrmCar.coords && result.osrmCar.coords.length
          ? result.osrmCar.coords
          : result.carLike && result.carLike.coords && result.carLike.coords.length
            ? result.carLike.coords
            : null;

      state.carRouteCoords = currentCarRouteCoords;

      if (!options.reroute || !state.originalCarRouteCoords) {
        state.originalCarRouteCoords = currentCarRouteCoords
          ? currentCarRouteCoords.map(c => Array.isArray(c) ? [c[0], c[1]] : c)
          : null;
      }

      drawCarRoute(null);
      drawRoute(route.coords);
      if (el.stepsSheet.classList.contains("hidden")) clearStepMarkers();

      const km = (route.distance / 1000).toFixed(1);
      const eta = etaFromMeters(route.distance);
      el.routeTitle.textContent = shortName(dest.label);
      el.routeSubtitle.textContent = `🚜 ${result.chosen.summary || result.chosen.name} · 30 km/h`;
      setRouteMeta(`${km} km · ${eta}`, route.distance);

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

      fitRoute(routeStart, dest, route.coords);
      window.setTimeout(() => {
        if (!state.navigating && state.route === route) fitRoute(routeStart, dest, route.coords);
      }, 80);
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

    const mapEl = map.getContainer();
    const mapH = mapEl.clientHeight || window.innerHeight || 700;

    if (isDesktopLayout()) {
      map.fitBounds(bounds, {
        paddingTopLeft: [90, 90],
        paddingBottomRight: [90, 90]
      });
      return;
    }

    const panelRect = el.panel && !el.panel.classList.contains("hidden") ? el.panel.getBoundingClientRect() : { bottom: 0 };
    const routeRect = el.routeCard && !el.routeCard.classList.contains("hidden") ? el.routeCard.getBoundingClientRect() : { height: 0 };

    const topPad = Math.min(Math.max(90, panelRect.bottom + 18), Math.round(mapH * 0.28));
    const bottomPad = Math.min(Math.max(170, routeRect.height + 36), Math.round(mapH * 0.62));

    map.fitBounds(bounds, {
      paddingTopLeft: [20, topPad],
      paddingBottomRight: [20, bottomPad]
    });
  }

  async function getSmartAtraktorRoute(start, dest, context = {}) {
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
        id: "atraktor_comfort",
        name: "Komfort 30-väg",
        summary: "Komfort 30 km/h-väg",
        useHighways: 0.55,
        distancePreference: 0.25,
        profilePenalty: -35,
        description: "prioriterar rakare och enklare körväg"
      },
      {
        id: "atraktor_direct",
        name: "Direkt 30-väg",
        summary: "Direkt 30 km/h-väg",
        useHighways: 0.45,
        distancePreference: 0.7,
        profilePenalty: 0,
        description: "balanserar direkt väg och kort distans"
      },
      {
        id: "atraktor_short",
        name: "Kort 30-väg",
        summary: "Kortare 30 km/h-väg",
        useHighways: 0.30,
        distancePreference: 1,
        profilePenalty: 35,
        description: "prioriterar kortare väg för 30 km/h"
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
      route.comfort = analyzeRouteComfort(route);
      route.score = scoreThirtyKmhRoute(route, minDistance, carLike, { ...context, start });
    }

    alternatives.sort((a, b) => a.score - b.score);

    let chosen = alternatives[0];

    // V6.6.8: välj bara tydligt kortare väg om den inte är klart jobbigare.
    const reference = carLike;
    const shorter = alternatives
      .filter(r => r.distance < reference.distance - 350)
      .sort((a, b) => a.score - b.score)[0];

    if (shorter && chosen.profile.id !== "osrm_car") {
      const savedMeters = reference.distance - shorter.distance;
      const extraTurns = Math.max(0, shorter.turnCount - reference.turnCount);
      const savedMinutes = savedMeters / 1000 / 30 * 60;
      const comfortGap = (shorter.comfort?.comfortPenalty || 0) - (reference.comfort?.comfortPenalty || 0);

      if ((savedMinutes >= 2.5 && comfortGap < 80) || (savedMinutes >= 1.4 && extraTurns <= 1 && comfortGap < 35)) {
        chosen = shorter;
        chosen.smartReason = `Valde kortare väg som sparar cirka ${Math.round(savedMinutes)} min utan att bli tydligt krångligare.`;
      }
    }

    // OSRM-bilrutten kan vinna om den är både kortare/enklare, men inte om den kräver tydlig U-sväng vid omruttning.
    if (osrmCar) {
      const bestNonOsrm = alternatives.find(r => r.profile.id !== "osrm_car");
      if (bestNonOsrm) {
        const savedMeters = bestNonOsrm.distance - osrmCar.distance;
        const savedMinutes = savedMeters / 1000 / 30 * 60;
        const fewerOrSimilarTurns = osrmCar.turnCount <= bestNonOsrm.turnCount + 1;
        const notWorseComfort = (osrmCar.comfort?.comfortPenalty || 0) <= (bestNonOsrm.comfort?.comfortPenalty || 0) + 45;
        const legalEnough = !context.reroute || rerouteStartPenalty(osrmCar, start) < 180;

        if (savedMinutes >= 1.8 && fewerOrSimilarTurns && notWorseComfort && legalEnough) {
          chosen = osrmCar;
          chosen.smartReason = `Valde OSRM-bilrutten eftersom den verkar kortare och minst lika enkel vid 30 km/h.`;
        }
      }
    }

    if (!chosen.smartReason) {
      const c = chosen.comfort || {};
      chosen.smartReason = context.reroute
        ? "Valde omruttning som prioriterar fortsatt färdriktning, färre U-svängar och enklare väg."
        : `Valde rutten med bäst 30 km/h-komfort: färre onödiga svängar, rakare väg och rimlig distans.`;
    }

    return {
      route: chosen,
      chosen: chosen.profile,
      alternatives,
      carLike,
      osrmCar,
      reason: chosen.smartReason
    };
  }

  function analyzeRouteComfort(route) {
    const coords = route?.coords || [];
    const cumulative = route?.cumulative || buildCumulative(coords);
    if (coords.length < 3) {
      return { curvePenalty: 0, shortSegmentPenalty: 0, directnessPenalty: 0, hairpinPenalty: 0, comfortPenalty: 0 };
    }

    let curvePenalty = 0;
    let shortSegmentPenalty = 0;
    let hairpinPenalty = 0;
    let bearingSamples = 0;

    for (let i = 1; i < coords.length - 1; i++) {
      const a = { lat: coords[i - 1][0], lon: coords[i - 1][1] };
      const b = { lat: coords[i][0], lon: coords[i][1] };
      const c = { lat: coords[i + 1][0], lon: coords[i + 1][1] };
      const ab = haversine(a, b);
      const bc = haversine(b, c);
      if (ab < 4 || bc < 4) continue;
      const h1 = bearingBetween(a, b);
      const h2 = bearingBetween(b, c);
      if (h1 === null || h2 === null) continue;
      const d = Math.abs(headingDelta(h1, h2));
      if (d > 10) curvePenalty += Math.max(0, d - 10) * Math.min(1.8, (ab + bc) / 70);
      if (d > 120 && ab < 85 && bc < 85) hairpinPenalty += 1;
      if (ab < 55 && d > 22) shortSegmentPenalty += 1;
      bearingSamples += 1;
    }

    const total = route.distance || cumulative[cumulative.length - 1] || 0;
    const straight = haversine(
      { lat: coords[0][0], lon: coords[0][1] },
      { lat: coords[coords.length - 1][0], lon: coords[coords.length - 1][1] }
    );
    const directness = straight > 0 ? total / straight : 1;
    const directnessPenalty = Math.max(0, directness - 1.23) * 150;

    const comfortPenalty =
      curvePenalty * 0.62 +
      shortSegmentPenalty * 10 +
      hairpinPenalty * 65 +
      directnessPenalty;

    return {
      curvePenalty,
      shortSegmentPenalty,
      directnessPenalty,
      hairpinPenalty,
      comfortPenalty,
      bearingSamples
    };
  }

  function initialRouteBearing(route) {
    const coords = route?.coords || [];
    if (coords.length < 2) return null;
    const a = { lat: coords[0][0], lon: coords[0][1] };
    for (let i = 1; i < Math.min(coords.length, 8); i++) {
      const b = { lat: coords[i][0], lon: coords[i][1] };
      if (haversine(a, b) > 12) return bearingBetween(a, b);
    }
    return null;
  }

  function rerouteStartPenalty(route, start) {
    const heading = normalizeHeading(start?.heading ?? state.displayHeading ?? state.gpsHeading ?? state.userHeading);
    if (heading === null) return 0;

    const first = initialRouteBearing(route);
    if (first === null) return 0;

    const delta = Math.abs(headingDelta(heading, first));
    let penalty = 0;

    // Lagligare omruttning: direkt bakåt/U-sväng ska nästan aldrig vinna.
    if (delta > 150) penalty += 780;
    else if (delta > 120) penalty += 430;
    else if (delta > 90) penalty += 210;
    else if (delta > 65) penalty += 80;

    const firstStep = (route.instructions || [])[0];
    const firstText = String(firstStep?.text || "").toLowerCase();
    const firstRoad = String(firstStep?.road || "").toLowerCase();
    if ((firstText.includes("vänd") || firstText.includes("u-turn") || firstText.includes("uturn")) && delta > 90) {
      penalty += 900;
    }
    if (/service|driveway|private|track|tomt|gård|garage|parkering/.test(firstRoad)) {
      penalty += 320;
    }

    return penalty;
  }

  function routePointFromHeading(origin, heading, meters) {
    const h = normalizeHeading(heading);
    if (!origin || h === null) return null;
    const R = 6371000;
    const brng = h * Math.PI / 180;
    const lat1 = origin.lat * Math.PI / 180;
    const lon1 = origin.lon * Math.PI / 180;
    const d = meters / R;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(d) +
      Math.cos(lat1) * Math.sin(d) * Math.cos(brng)
    );
    const lon2 = lon1 + Math.atan2(
      Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
    );

    return {
      lat: lat2 * 180 / Math.PI,
      lon: lon2 * 180 / Math.PI,
      label: `Framåt ${Math.round(meters)} m`,
      heading: h,
      forwardCandidate: true,
      forwardMeters: meters
    };
  }

  function buildRerouteStartCandidates(start) {
    const heading = normalizeHeading(state.displayHeading ?? state.gpsHeading ?? state.userHeading);
    if (heading === null || !state.navigating) return [start];

    const candidates = [{ ...start, heading, forwardCandidate: false, forwardMeters: 0 }];
    [70, 130, 220].forEach(m => {
      const p = routePointFromHeading(start, heading, m);
      if (p) candidates.push(p);
    });
    return candidates;
  }

  function scoreThirtyKmhRoute(route, minDistance, carLike, context = {}) {
    const extraDistanceVsBest = Math.max(0, route.distance - minDistance);
    const extraTurnsVsCar = Math.max(0, route.turnCount - carLike.turnCount);
    const savesDistanceVsCar = Math.max(0, carLike.distance - route.distance);
    const comfort = route.comfort || analyzeRouteComfort(route);
    route.comfort = comfort;

    // A-traktor-tid = distans / 30 km/h.
    const atraktorTimeSeconds = route.distance / (30 / 3.6);

    // V6.6.8: fler svängar, korta segment och krokig geometri straffas tydligare.
    const turnPenaltySeconds = route.turnCount * 18 + extraTurnsVsCar * 24;
    const comfortPenaltySeconds = clamp(comfort.comfortPenalty || 0, 0, 420);

    // Extra distans jämfört med kortaste kandidat kostar, men inte så hårt att en
    // krokig genväg automatiskt vinner.
    const extraDistancePenaltySeconds = extraDistanceVsBest / (30 / 3.6) * 0.30;

    // Kortare än referens-bilrutten får mindre bonus än tidigare, för att inte välja
    // jobbiga småvägsgenvägar bara för några hundra meter.
    const shorterBonusSeconds = savesDistanceVsCar / (30 / 3.6) * 0.10;

    const sourcePenalty = route.profile.id === "osrm_car" ? 25 : 0;
    const reroutePenalty = context.reroute ? rerouteStartPenalty(route, context.start || {}) : 0;

    return atraktorTimeSeconds + turnPenaltySeconds + comfortPenaltySeconds + extraDistancePenaltySeconds - shorterBonusSeconds + sourcePenalty + reroutePenalty + route.profile.profilePenalty;
  }

  function buildSmartRouteMessage(result) {
    const alts = result.alternatives || [];
    const chosen = result.route;

    if (!chosen) {
      return "Optimerad för 30 km/h: enklare och rakare körväg prioriteras före kortaste genväg. Kontrollera alltid skyltning.";
    }

    const parts = [`30maps beta: ${result.reason}`];

    if (alts.length > 1) {
      const summary = alts
        .slice()
        .sort((a, b) => a.score - b.score)
        .map(r => `${r.profile.name}: ${(r.distance/1000).toFixed(1)} km, ${r.turnCount} svängar, komfort ${Math.round(r.comfort?.comfortPenalty || 0)}`)
        .join(" · ");
      parts.push(summary);
    }

    parts.push("Blå linje = OSRM:s vanliga bilrutt. Grön linje = vald 30 km/h-rutt. V6.6.8 prioriterar rakare/enklare vägar, undviker onödiga småvägsgenvägar och försöker göra omruttning utan direkt U-sväng. Kontrollera alltid skyltning.");
    return parts.join(" ");
  }

  async function routeValhalla(start, dest, profile = { id: "balanced", name: "Balanserad", summary: "30 km/h-rutt", useHighways: 0.25, profilePenalty: 220 }) {
    const startLocation = { lat: start.lat, lon: start.lon, type: "break" };
    if (Number.isFinite(start.heading)) {
      startLocation.heading = normalizeHeading(start.heading);
      startLocation.heading_tolerance = 55;
      startLocation.minimum_reachability = 40;
    }

    const payload = {
      locations: [
        startLocation,
        { lat: dest.lat, lon: dest.lon, type: "break" }
      ],
      costing: "auto",
      costing_options: {
        auto: {
          top_speed: 30,
          use_highways: profile.useHighways,
          use_tolls: 0,
          use_ferry: 0.15,
          use_tracks: 0.02,
          service_penalty: 180,
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
    const bearing = Number.isFinite(start.heading) ? `&bearings=${Math.round(normalizeHeading(start.heading))},70;` : "";
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${dest.lon},${dest.lat}?overview=full&geometries=geojson&steps=true${bearing}`;
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
    if (state.drivenRouteLayer) map.removeLayer(state.drivenRouteLayer);
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
    return "⚠ Motorvägar/motortrafikleder nedprioriterade. Kontrollera skyltning.";
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
      el.routeAdvancedBtn.textContent = state.advancedRouteShown ? "Dölj avancerat" : "Visa avancerat och bilrutt";
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



  function clearDrivenRoute() {
    if (state.drivenRouteLayer) {
      map.removeLayer(state.drivenRouteLayer);
      state.drivenRouteLayer = null;
    }
  }

  function drawDrivenRoute(coords) {
    clearDrivenRoute();
    if (!coords || coords.length < 2) return;

    state.drivenRouteLayer = L.polyline(coords, {
      color: "#6b7280",
      weight: 5,
      opacity: 0.48,
      lineCap: "round",
      lineJoin: "round"
    }).addTo(map);

    if (state.drivenRouteLayer.bringToBack) state.drivenRouteLayer.bringToBack();
    if (state.routeShadowLayer) state.routeShadowLayer.bringToFront();
    if (state.routeLayer) state.routeLayer.bringToFront();
  }

  function getDrivenRouteCoords(progress) {
    if (!state.route || !state.route.coords || !state.route.coords.length) return [];
    const coords = state.route.coords;
    const endIndex = Math.max(0, Math.min(progress.index || 0, coords.length - 1));
    const driven = coords.slice(0, endIndex + 1);
    if (progress.point) driven.push(progress.point);
    return driven.length >= 2 ? driven : [];
  }

  function getRemainingRouteCoords(progress) {
    if (!state.route || !state.route.coords || !state.route.coords.length) return [];
    const coords = state.route.coords;
    const startIndex = Math.max(0, Math.min(progress.index || 0, coords.length - 1));
    const remaining = [];

    if (progress.point) remaining.push(progress.point);
    remaining.push(...coords.slice(startIndex + 1));

    if (remaining.length < 2) return coords.slice(-2);
    return remaining;
  }

  function updateRemainingRouteLine(progress) {
    if (!state.navigating || !state.route) return;

    const idx = progress.index || 0;
    const shouldUpdate =
      state.lastRemainingRouteIndex < 0 ||
      idx >= state.lastRemainingRouteIndex + 2 ||
      idx < state.lastRemainingRouteIndex;

    if (!shouldUpdate) return;
    state.lastRemainingRouteIndex = idx;

    const drivenCoords = getDrivenRouteCoords(progress);
    if (drivenCoords.length >= 2) drawDrivenRoute(drivenCoords);

    const remainingCoords = getRemainingRouteCoords(progress);
    if (remainingCoords.length >= 2) drawRoute(remainingCoords);
  }

  function restoreFullRouteLine() {
    state.lastRemainingRouteIndex = -1;
    clearDrivenRoute();
    if (state.route && state.route.coords && state.route.coords.length) {
      drawRoute(state.route.coords);
    }
  }

  function showOriginalRouteAfterArrival() {
    const original = state.originalRoute || state.route;
    if (!original || !original.coords || !original.coords.length) return;

    state.route = cloneRoute(original);
    state.carRouteCoords = state.originalCarRouteCoords
      ? state.originalCarRouteCoords.map(c => Array.isArray(c) ? [c[0], c[1]] : c)
      : state.carRouteCoords;
    state.lastRemainingRouteIndex = -1;
    clearDrivenRoute();
    drawRoute(state.route.coords);
    if (state.advancedRouteShown && state.carRouteCoords && state.carRouteCoords.length) {
      drawCarRoute(state.carRouteCoords);
    } else {
      drawCarRoute(null);
    }
    updateStepsUI();

    // V6.6.6: på telefon ska sök/favoritkortet vara minimerat när mål är klart,
    // så den visade ursprungliga rutten får plats på skärmen.
    if (!isDesktopLayout()) {
      setPanelCollapsed(true, { force: true });
    }

    const km = ((state.route.distance || 0) / 1000).toFixed(1);
    el.routeTitle.textContent = shortName(state.destination?.label || "Destination");
    el.routeSubtitle.textContent = "Ursprunglig rutt";
    setRouteMeta(`${km} km · ${etaFromMeters(state.route.distance || 0)}`, state.route.distance || 0);

    const start = state.originalStart || getStartForRoute() || {
      lat: state.route.coords[0][0],
      lon: state.route.coords[0][1],
      label: "Start"
    };
    if (state.destination) {
      map.invalidateSize();
      fitRoute(start, state.destination, state.route.coords);
      window.setTimeout(() => {
        if (!state.navigating && state.arrivedHandled) fitRoute(start, state.destination, state.route.coords);
      }, 90);
      window.setTimeout(() => {
        if (!state.navigating && state.arrivedHandled) fitRoute(start, state.destination, state.route.coords);
      }, 360);
      window.setTimeout(() => {
        if (!state.navigating && state.arrivedHandled) fitRoute(start, state.destination, state.route.coords);
      }, 720);
    }
  }

  function handleDestinationReached() {
    if (state.arrivedHandled) return;
    state.arrivedHandled = true;
    state.navigating = false;
    state.follow = false;
    stopMapRotationAnimation();
    if (el.followBtn) el.followBtn.textContent = "🧭 Följ: av";
    updateMapRotation(true);
    if (state.userMarker) state.userMarker.setIcon(makeUserIcon());
    state.offRouteHits = 0;
    state.lastNavStepKey = "";
    state.lastCorridorHeading = null;
    state.navDisplayedStepKey = "";
    state.navVisibleInstructionSig = "";
    state.turnLock = null;
    state.turnLockReleasedKey = "";
    document.body.classList.remove("navigating");
    updateResumeFollowButton();
    el.navTop.classList.add("hidden");
    el.navBottom.classList.add("hidden");
    showRouteCard();
    showOriginalRouteAfterArrival();
    setRouteCompactMode();
    releaseWakeLock();
    toast("Du är framme");
  }

  function setNavInstructionContent(stepKey, distanceText, mainText, roadText) {
    if (!state.navigating) return;

    stepKey = String(stepKey || "nav");
    const cleanRoadText = roadText || "";
    const contentSig = `${mainText}|||${cleanRoadText}`;
    const sameStep = state.navDisplayedStepKey === stepKey;
    const sameVisibleInstruction = state.navVisibleInstructionSig === contentSig;

    state.navStepAnimationSeq = (state.navStepAnimationSeq || 0) + 1;
    const seq = state.navStepAnimationSeq;
    clearTimeout(state.navStepAnimationTimer);
    clearTimeout(state.navStepAnimationCleanupTimer);

    const applyContent = () => {
      el.navDistanceToTurn.textContent = distanceText;
      el.navInstruction.textContent = mainText;
      el.navRoad.textContent = cleanRoadText;
      state.navVisibleInstructionSig = contentSig;
    };

    // Om låset håller kvar samma sväng/instruktion ska kortet inte animera.
    // Då uppdateras bara avståndet, t.ex. "Om 15 m" eller "Nu".
    if (!state.navDisplayedStepKey || sameStep || sameVisibleInstruction) {
      state.navDisplayedStepKey = stepKey;
      el.navTop.classList.remove("nav-step-in", "nav-step-out");
      applyContent();
      return;
    }

    state.navDisplayedStepKey = stepKey;

    el.navTop.classList.remove("nav-step-in", "nav-step-out");
    void el.navTop.offsetWidth;
    el.navTop.classList.add("nav-step-out");

    state.navStepAnimationTimer = window.setTimeout(() => {
      if (seq !== state.navStepAnimationSeq || state.navDisplayedStepKey !== stepKey) return;
      applyContent();

      el.navTop.classList.remove("nav-step-out");
      void el.navTop.offsetWidth;
      el.navTop.classList.add("nav-step-in");

      state.navStepAnimationCleanupTimer = window.setTimeout(() => {
        if (seq === state.navStepAnimationSeq) el.navTop.classList.remove("nav-step-in");
      }, 285);
    }, 150);
  }

  function isTurnLikeInstruction(step) {
    const t = String(step?.text || "").toLowerCase();
    return (
      t.includes("sväng") ||
      t.includes("håll vänster") ||
      t.includes("håll höger") ||
      t.includes("rondell") ||
      t.includes("avfart") ||
      t.includes("turn") ||
      t.includes("left") ||
      t.includes("right")
    );
  }

  function instructionStableKey(step, index = "") {
    return `${step?.index ?? index}:${step?.text ?? ""}`;
  }

  function findLockedTurnStep(steps) {
    if (!state.turnLock) return { index: -1, step: null };
    let index = state.turnLock.index;
    let step = steps[index];

    if (!step || instructionStableKey(step, index) !== state.turnLock.key) {
      index = steps.findIndex((s, i) => instructionStableKey(s, i) === state.turnLock.key);
      step = index >= 0 ? steps[index] : null;
    }

    return { index, step };
  }

  function releaseTurnLock() {
    if (state.turnLock) state.turnLockReleasedKey = state.turnLock.key;
    state.turnLock = null;
  }

  function acquireTurnLock(step, index) {
    const key = instructionStableKey(step, index);
    state.turnLock = {
      key,
      index,
      distanceFromStart: step.distanceFromStart || 0,
      text: step.text,
      acquiredAt: Date.now()
    };
    return state.turnLock;
  }

  function currentLockedTurnInstruction(steps, d) {
    if (!state.turnLock) return null;

    const found = findLockedTurnStep(steps);
    const step = found.step;
    const index = found.index;

    if (!step) {
      releaseTurnLock();
      return null;
    }

    const turnDistance = step.distanceFromStart || state.turnLock.distanceFromStart || 0;
    const passedBy = d - turnDistance;
    const nextTurn = steps.slice(index + 1).find(isTurnLikeInstruction);
    const nextDistance = nextTurn ? (nextTurn.distanceFromStart || 0) - d : Infinity;
    const releaseAfter = nextDistance <= CLOSE_NEXT_TURN_METERS ? TURN_LOCK_CLOSE_AFTER_METERS : TURN_LOCK_AFTER_METERS;

    // Om rutten räknats om eller GPS-hoppen gör låset orimligt gammalt, släpp.
    if (passedBy > Math.max(releaseAfter, TURN_LOCK_AFTER_METERS) + 60 || d < turnDistance - 120) {
      releaseTurnLock();
      return null;
    }

    const minHoldMs = nextDistance <= CLOSE_NEXT_TURN_METERS ? 1200 : 4200;
    const heldLongEnough = Date.now() - (state.turnLock.acquiredAt || 0) >= minHoldMs;

    if (passedBy >= releaseAfter && heldLongEnough) {
      releaseTurnLock();
      return null;
    }

    return {
      step,
      toTurn: Math.max(0, turnDistance - d),
      key: `${instructionStableKey(step, index)}:locked`
    };
  }

  function findNavigationInstruction(distanceAlong, remaining) {
    const steps = state.route?.instructions || [];
    if (!steps.length) return null;

    const d = Math.max(0, distanceAlong || 0);

    const locked = currentLockedTurnInstruction(steps, d);
    if (locked) return locked;

    // Skaffa lås innan svängen börjar. Då får nästa instruktion aldrig
    // "sticka fram huvudet" mitt i svängen.
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (!isTurnLikeInstruction(step)) continue;

      const turnDistance = step.distanceFromStart || 0;
      const delta = turnDistance - d;
      const key = instructionStableKey(step, i);

      if (delta <= TURN_LOCK_BEFORE_METERS && delta >= -8) {
        if (key === state.turnLockReleasedKey && d >= turnDistance - 5) continue;
        acquireTurnLock(step, i);
        return currentLockedTurnInstruction(steps, d);
      }
    }

    const upcoming = steps.find(s => (s.distanceFromStart || 0) > d + 18) || null;

    if (upcoming) {
      return {
        step: upcoming,
        toTurn: Math.max(0, (upcoming.distanceFromStart || 0) - d),
        key: `${instructionStableKey(upcoming, "")}`
      };
    }

    const last = steps[steps.length - 1];
    return {
      step: last,
      toTurn: Math.max(0, remaining),
      key: `${instructionStableKey(last, "last")}`
    };
  }

  function getStepLatLng(step) {
    if (!step) return null;

    if (Array.isArray(step.point) && step.point.length >= 2) {
      return { lat: Number(step.point[0]), lon: Number(step.point[1]) };
    }

    const coords = state.route?.coords || [];
    if (Number.isInteger(step.index) && coords[step.index]) {
      return { lat: Number(coords[step.index][0]), lon: Number(coords[step.index][1]) };
    }

    if (Number.isFinite(step.distanceFromStart)) {
      return routePointAtDistanceAlong(step.distanceFromStart);
    }

    return null;
  }

  function makeStepMarkerIcon(number, active = false) {
    return L.divIcon({
      className: "",
      html: `<div class="step-map-marker${active ? " active" : ""}">${number}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  }

  function clearStepMarkers() {
    for (const marker of state.stepMarkers || []) {
      map.removeLayer(marker);
    }
    state.stepMarkers = [];
    state.highlightedStepIndex = -1;
  }

  function showStepMarkers() {
    clearStepMarkers();

    const steps = state.route?.instructions || [];
    if (!steps.length) return;

    steps.forEach((step, index) => {
      const p = getStepLatLng(step);
      if (!p || !Number.isFinite(p.lat) || !Number.isFinite(p.lon)) return;

      const marker = L.marker([p.lat, p.lon], {
        icon: makeStepMarkerIcon(index + 1, false),
        zIndexOffset: 2400,
        keyboard: false
      }).addTo(map);

      marker.on("click", () => highlightStepMarker(index, true));
      state.stepMarkers[index] = marker;
    });
  }

  function focusStepPointOnMap(point, targetZoom) {
    if (!point || !Number.isFinite(point.lat) || !Number.isFinite(point.lon)) return;

    if (!state.navigating || isDesktopLayout()) {
      map.flyTo([point.lat, point.lon], targetZoom, { animate: true, duration: 0.35 });
      return;
    }

    map.invalidateSize();

    const size = map.getSize();
    const navTopRect = el.navTop && !el.navTop.classList.contains("hidden")
      ? el.navTop.getBoundingClientRect()
      : null;
    const stepsRect = el.stepsSheet && !el.stepsSheet.classList.contains("hidden")
      ? el.stepsSheet.getBoundingClientRect()
      : null;

    const topLimit = navTopRect ? navTopRect.bottom + 28 : Math.max(104, size.y * 0.18);
    const bottomLimit = stepsRect ? stepsRect.top - 24 : size.y * 0.56;
    const desiredY = clamp((topLimit + bottomLimit) / 2, topLimit + 20, Math.max(topLimit + 42, bottomLimit - 30));
    const desiredX = size.x * 0.5;

    const projected = map.project([point.lat, point.lon], targetZoom);
    const centerPoint = L.point(
      projected.x + size.x / 2 - desiredX,
      projected.y + size.y / 2 - desiredY
    );
    const targetCenter = map.unproject(centerPoint, targetZoom);
    map.setView(targetCenter, targetZoom, { animate: true });
  }

  function highlightStepMarker(index, focusMap = false) {
    const steps = state.route?.instructions || [];
    const step = steps[index];
    const p = getStepLatLng(step);
    if (!step || !p) return;

    state.highlightedStepIndex = index;

    (state.stepMarkers || []).forEach((marker, markerIndex) => {
      if (!marker) return;
      marker.setIcon(makeStepMarkerIcon(markerIndex + 1, markerIndex === index));
      marker.setZIndexOffset(markerIndex === index ? 3200 : 2400);
    });

    const items = el.stepsList ? el.stepsList.querySelectorAll("li") : [];
    items.forEach((li, liIndex) => li.classList.toggle("active-step", liIndex === index));

    if (focusMap) {
      if (state.navigating && state.follow) setFollowMode(false, false);
      const targetZoom = isDesktopLayout()
        ? Math.min(Math.max(map.getZoom(), 15), 16)
        : Math.min(Math.max(map.getZoom(), 15), 16);
      focusStepPointOnMap(p, targetZoom);
    }
  }

  function updateStepsUI() {
    const steps = state.route?.instructions || [];
    el.stepsList.innerHTML = "";

    if (!steps.length) {
      const li = document.createElement("li");
      li.textContent = "Inga svänginstruktioner tillgängliga.";
      el.stepsList.appendChild(li);
      clearStepMarkers();
      return;
    }

    steps.forEach((step, index) => {
      const li = document.createElement("li");

      const btn = document.createElement("button");
      btn.className = "step-list-btn";
      btn.type = "button";
      btn.innerHTML = `<span class="step-list-number">${index + 1}</span><span class="step-list-text">${escapeHtml(step.text)}<small>${escapeHtml(fmtDist(step.stepDistance || 0))}</small></span>`;
      btn.addEventListener("click", () => highlightStepMarker(index, true));

      li.appendChild(btn);
      el.stepsList.appendChild(li);
    });

    if (!el.stepsSheet.classList.contains("hidden")) {
      showStepMarkers();
      if (state.highlightedStepIndex >= 0) highlightStepMarker(state.highlightedStepIndex, false);
    }
  }

  function showSteps() {
    updateStepsUI();
    showStepMarkers();
    document.body.classList.add("steps-open");
    showUiCard(el.stepsSheet);
  }

  function hideSteps() {
    clearStepMarkers();
    document.body.classList.remove("steps-open");
    hideUiCard(el.stepsSheet);

    // Om man har tryckt på ett steg och kartan zoomat dit ska Stäng återgå till körläge.
    if (state.navigating) {
      state.highlightedStepIndex = -1;
      setFollowMode(true, false, { delayResumeHide: true });
      window.setTimeout(() => {
        if (state.follow && state.userPos) enterDrivingView();
      }, 80);
    }
  }

  function enterNavigationMode(showToast = true) {
    if (!state.route || !state.destination) {
      toast("Välj en rutt först");
      return;
    }
    state.navigating = true;
    state.follow = true;
    state.lastNavStepKey = "";
    state.navDisplayedStepKey = "";
    state.navVisibleInstructionSig = "";
    state.turnLock = null;
    state.turnLockReleasedKey = "";
    state.navMaxDistanceAlong = 0;
    state.navRerouteStatusUntil = 0;
    state.navStepAnimationSeq = (state.navStepAnimationSeq || 0) + 1;
    state.lastRemainingRouteIndex = -1;
    state.offRouteHits = 0;
    state.arrivedHandled = false;
    document.body.classList.add("navigating");
    if (state.userPos) updateSmartUserHeading(state.userPos.lat, state.userPos.lon, state.userPos);
    updateMapRotation(true);
    if (state.userMarker) state.userMarker.setIcon(makeUserIcon());
    setRouteCompactMode();
    el.navTop.classList.remove("hidden");
    el.navBottom.classList.remove("hidden");
    el.followBtn.textContent = "🧭 Följ: på";
    updateResumeFollowButton();
    enterDrivingView();
    updateNavigationFromPosition();
    requestWakeLock();
    if (showToast) toast("Navigation startad");
  }

  function exitNavigationMode() {
    clearStepMarkers();
    hideUiCard(el.stepsSheet, null, false);
    document.body.classList.remove("steps-open");
    state.navigating = false;
    stopMapRotationAnimation();
    updateMapRotation(true);
    if (state.userMarker) state.userMarker.setIcon(makeUserIcon());
    state.offRouteHits = 0;
    state.lastNavStepKey = "";
    state.navDisplayedStepKey = "";
    state.navVisibleInstructionSig = "";
    state.turnLock = null;
    state.turnLockReleasedKey = "";
    document.body.classList.remove("navigating");
    document.body.classList.remove("steps-open");
    state.navRerouteStatusUntil = 0;
    updateResumeFollowButton();
    restoreFullRouteLine();
    setRouteCompactMode();
    el.navTop.classList.add("hidden");
    el.navBottom.classList.add("hidden");
    releaseWakeLock();
    toast("Navigation avslutad");
  }

  function updateNavigationFromPosition() {
    if (!state.route || !state.route.coords.length) return;

    const pos = state.userPos || getStartForRoute();
    if (!pos) return;

    const progress = getRouteProgress(pos, state.route.coords, state.route.cumulative);
    const rawRemaining = Math.max(0, state.route.distance - progress.distanceAlong);
    const next = findNextInstruction(progress.distanceAlong);

    if (state.navigating) {
      state.navMaxDistanceAlong = Math.max(state.navMaxDistanceAlong || 0, progress.distanceAlong || 0);
      const navDistanceAlong = state.navMaxDistanceAlong;
      const remaining = Math.max(0, state.route.distance - navDistanceAlong);

      updateRemainingRouteLine({ ...progress, distanceAlong: navDistanceAlong });

      el.navRemaining.textContent = `${fmtDist(rawRemaining)} kvar · ${etaFromMeters(rawRemaining)}`;
      el.navDestination.textContent = shortName(state.destination?.label || "Destination");

      if (rawRemaining <= ARRIVAL_METERS && progress.offRouteDistance < OFF_ROUTE_METERS) {
        showNavStatus("arrival", "Framme", "Du är framme", "");
        handleDestinationReached();
        return;
      }

      // Om omräkning/ny rutt precis visats ska den gröna rutan få ligga kvar kort.
      if (state.navRerouteStatusUntil && Date.now() < state.navRerouteStatusUntil) {
        return;
      }

      const nav = findNavigationInstruction(navDistanceAlong, remaining);

      if (nav && nav.step) {
        const parts = splitInstruction(nav.step.text);
        const distanceText = nav.toTurn <= 3 ? "Nu" : `Om ${fmtDist(nav.toTurn)}`;
        setNavInstructionContent(nav.key, distanceText, parts.main, parts.road || "");
      } else {
        setNavInstructionContent("follow", "Snart framme", "Följ vägen", "");
      }

      if (progress.offRouteDistance > OFF_ROUTE_METERS) {
        state.offRouteHits += 1;
        if (state.offRouteHits >= 2) maybeReroute(progress.offRouteDistance);
      } else {
        state.offRouteHits = 0;
      }
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
    const i = best.index;
    const t = best.t;
    const a = coords[i] || coords[0];
    const b = coords[i + 1] || a;
    const point = [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t
    ];
    return { distanceAlong: best.distanceAlong, offRouteDistance: best.distance, index: i, t, point };
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
    if (state.demoActive && (state.demoRerouting || state.demoRerouted)) return;

    state.lastRerouteAt = now;
    state.offRouteHits = 0;

    showNavStatus("rerouting", "Räknar om...", "Letar laglig väg framåt", "", REROUTE_STATUS_MS);
    toast(`Utanför rutten (${fmtDist(offBy)}). Letar väg framåt...`);

    if (state.demoActive) {
      state.demoRerouting = true;
      if (el.betaBadge) el.betaBadge.textContent = "TESTLÄGE · räknar om";

      try {
        await calculateRoute({ reroute: true });

        if (state.demoActive && state.route && state.route.coords && state.route.coords.length >= 2) {
          state.demoRerouted = true;
          state.demoPath = interpolateDemoPath(state.route.coords, null);
          state.demoIndex = 0;
          state.lastRemainingRouteIndex = -1;
          state.navMaxDistanceAlong = 0;
          if (el.betaBadge) el.betaBadge.textContent = "TESTLÄGE · fejk-GPS";
          showNavStatus("reroute-ready", "Ny rutt klar", "Följ nya rutten", "Testläge", REROUTE_STATUS_MS);
          window.setTimeout(updateNavigationFromPosition, REROUTE_STATUS_MS + 80);
          toast("Testresa: ny rutt klar");
        }
      } catch (err) {
        console.error(err);
        showNavStatus("reroute-failed", "Omräkning misslyckades", "Följ skyltning", "", REROUTE_STATUS_MS);
        toast("Testresa: omräkning misslyckades");
      } finally {
        state.demoRerouting = false;
      }
      return;
    }

    try {
      await calculateRoute({ reroute: true });
      showNavStatus("reroute-ready", "Ny rutt klar", "Följ nya rutten", "", REROUTE_STATUS_MS);
      window.setTimeout(updateNavigationFromPosition, REROUTE_STATUS_MS + 80);
    } catch (err) {
      console.error(err);
      showNavStatus("reroute-failed", "Omräkning misslyckades", "Följ skyltning", "", REROUTE_STATUS_MS);
      throw err;
    }
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
    if (state.demoActive) stopDemoTrip("");
    el.destInput.value = "";
    el.startInput.value = "";
    el.destSuggestions.innerHTML = "";
    el.startSuggestions.innerHTML = "";
    el.startSection.classList.add("hidden");
    hideRouteCard(true);
    el.routeWarning.classList.add("hidden");
    if (el.routeAdvancedBtn) el.routeAdvancedBtn.classList.add("hidden");
    el.nextInstruction.classList.add("hidden");
    hideUiCard(el.stepsSheet, null, false);
    document.body.classList.remove("steps-open");
    clearStepMarkers();
    hideUiCard(el.tapSheet, null, false);
    hideUiCard(el.settingsSheet, null, false);
    exitNavigationModeSilently();

    state.destination = null;
    state.sharedDestinationAutoRoute = false;
    state.sharedDestinationOpened = false;
    state.route = null;
    clearRouteMetaCycle();
    state.routeMetaPrimary = "";
    state.routeMetaFuel = "";
    state.originalRoute = null;
    state.originalStart = null;
    state.originalCarRouteCoords = null;
    state.beforeTapPickView = null;
    state.navDisplayedStepKey = "";
    state.navVisibleInstructionSig = "";
    state.navMaxDistanceAlong = 0;
    state.navRerouteStatusUntil = 0;
    state.turnLock = null;
    state.turnLockReleasedKey = "";
    state.navStepAnimationSeq = (state.navStepAnimationSeq || 0) + 1;
    state.arrivedHandled = false;
    updateMapRotation(true);
    state.offRouteHits = 0;
    state.lastNavStepKey = "";
    state.lastRemainingRouteIndex = -1;
    state.carRouteCoords = null;
    state.basicRouteInfo = "";
    state.advancedRouteInfo = "";
    state.advancedRouteShown = false;
    state.start = { mode: "gps", lat: state.userPos?.lat ?? null, lon: state.userPos?.lon ?? null, label: "Min position" };

    if (state.routeLayer) map.removeLayer(state.routeLayer);
    if (state.routeShadowLayer) map.removeLayer(state.routeShadowLayer);
    if (state.carRouteLayer) map.removeLayer(state.carRouteLayer);
    if (state.drivenRouteLayer) map.removeLayer(state.drivenRouteLayer);
    if (state.destMarker) map.removeLayer(state.destMarker);
    if (state.startMarker) map.removeLayer(state.startMarker);
    if (state.tapPreviewMarker) map.removeLayer(state.tapPreviewMarker);
    state.routeLayer = null;
    state.routeShadowLayer = null;
    state.carRouteLayer = null;
    state.drivenRouteLayer = null;
    state.destMarker = null;
    state.startMarker = null;
    state.tapPreviewMarker = null;
    updateShareButtons();
    toast("Rensat");
    setPanelCollapsed(false, { force: true });
  }

  function exitNavigationModeSilently() {
    clearStepMarkers();
    hideUiCard(el.stepsSheet, null, false);
    document.body.classList.remove("steps-open");
    state.navigating = false;
    stopMapRotationAnimation();
    state.offRouteHits = 0;
    state.lastNavStepKey = "";
    state.navDisplayedStepKey = "";
    state.navVisibleInstructionSig = "";
    state.turnLock = null;
    state.turnLockReleasedKey = "";
    document.body.classList.remove("navigating");
    state.navRerouteStatusUntil = 0;
    updateResumeFollowButton();
    restoreFullRouteLine();
    setRouteCompactMode();
    el.navTop.classList.add("hidden");
    el.navBottom.classList.add("hidden");
    releaseWakeLock();
  }

  function showTapSheet(lat, lon) {
    state.beforeTapPickView = {
      center: map.getCenter(),
      zoom: map.getZoom()
    };
    state.selectedTap = { lat, lon, label: fmtCoord(lat, lon), fromMap: true };
    showTapPreviewMarker(lat, lon);
    el.tapCoords.textContent = fmtCoord(lat, lon);
    showUiCard(el.tapSheet);
    updateShareButtons();

    const targetZoom = Math.max(map.getZoom(), 16);
    map.flyTo([lat, lon], targetZoom, { animate: true, duration: 0.35 });
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


  function demoPosition(lat, lon, heading = 0, accuracy = 7) {
    updateUserPosition({
      __demo: true,
      coords: {
        latitude: lat,
        longitude: lon,
        accuracy,
        heading
      }
    });
  }


  function restoreRealGpsAfterDemo() {
    if (state.realUserPos) {
      updateUserPosition({
        coords: {
          latitude: state.realUserPos.lat,
          longitude: state.realUserPos.lon,
          accuracy: state.realUserAccuracy || 30,
          heading: typeof state.realUserHeading === "number" ? state.realUserHeading : undefined
        }
      });
      if (state.follow && state.realUserPos) {
        map.panTo([state.realUserPos.lat, state.realUserPos.lon], { animate: true, duration: 0.45 });
      }
      return;
    }

    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      updateUserPosition,
      () => toast("Testläge stoppat. Väntar på riktig GPS..."),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 8000 }
    );
  }

  function makeDemoRoute() {
    const coords = [
      [56.87900, 14.80500],
      [56.87955, 14.80625],
      [56.88035, 14.80710],
      [56.88110, 14.80855],
      [56.88195, 14.80925],
      [56.88255, 14.81065],
      [56.88335, 14.81145],
      [56.88415, 14.81285]
    ];
    const cumulative = buildCumulative(coords);

    const instructions = [
      {
        text: "Starta på Testvägen",
        road: "Testvägen",
        point: coords[0],
        distanceFromStart: 0,
        stepDistance: cumulative[1] || 0,
        index: 0
      },
      {
        text: "Sväng höger på Demogatan",
        road: "Demogatan",
        point: coords[2],
        distanceFromStart: cumulative[2] || 0,
        stepDistance: (cumulative[3] || 0) - (cumulative[2] || 0),
        index: 1
      },
      {
        text: "Sväng vänster på Målvägen",
        road: "Målvägen",
        point: coords[5],
        distanceFromStart: cumulative[5] || 0,
        stepDistance: (cumulative[6] || 0) - (cumulative[5] || 0),
        index: 2
      },
      {
        text: "Du är framme",
        road: "",
        point: coords[coords.length - 1],
        distanceFromStart: cumulative[cumulative.length - 1] || 0,
        stepDistance: 0,
        index: 3
      }
    ];

    const destination = {
      lat: coords[coords.length - 1][0],
      lon: coords[coords.length - 1][1],
      label: "Testmål · fejkresa"
    };

    state.destination = destination;
    state.start = { mode: "gps", lat: coords[0][0], lon: coords[0][1], label: "Fejk-GPS" };
    el.destInput.value = destination.label;
    el.startInput.value = "Fejk-GPS";
    el.startSection.classList.remove("hidden");
    clearTapPreviewMarker();
    placeMarker("dest", destination);

    state.route = {
      source: "Demo",
      profile: { id: "demo", name: "Testresa", summary: "Fejk-GPS", useHighways: null, profilePenalty: 0 },
      coords,
      distance: cumulative[cumulative.length - 1] || 0,
      cumulative,
      instructions,
      turnCount: 2,
      score: 0
    };
    state.originalRoute = cloneRoute(state.route);
    state.originalStart = clonePlace(state.start);

    state.routeUsedFallback = false;
    state.turnLock = null;
    state.turnLockReleasedKey = "";
    state.navMaxDistanceAlong = 0;
    state.carRouteCoords = null;
    drawCarRoute(null);
    drawRoute(coords);
    showRouteCard();

    el.routeTitle.textContent = destination.label;
    el.routeSubtitle.textContent = "Testresa · fejk-GPS";
    setRouteMeta(`${(state.route.distance / 1000).toFixed(1)} km · ${etaFromMeters(state.route.distance)}`, state.route.distance);
    setRouteInfoText("TESTLÄGE: fejk-GPS kör en kort testresa. Riktig GPS ignoreras tills testet stoppas.", "Testresan simulerar GPS längs rutten, kör av rutten en gång och fortsätter sedan mot målet. Den testar nästa-steg-rutan, kvarvarande grön ruttlinje och snabb omräkning.");
    updateStepsUI();
    fitRoute(state.start, destination, coords);
  }


  function interpolateDemoPath(coords, wrongPlan = null) {
    const path = [];
    let wrongInserted = false;
    const insertAt = wrongPlan ? Math.max(0, Math.min(wrongPlan.routeIndex || 0, coords.length - 2)) : -1;

    const addSegment = (a, b, wrong = false) => {
      const d = haversine({ lat: a[0], lon: a[1] }, { lat: b[0], lon: b[1] });
      const steps = Math.max(2, Math.min(12, Math.ceil(d / 18)));
      for (let j = 0; j < steps; j++) {
        const t = j / steps;
        path.push([
          a[0] + (b[0] - a[0]) * t,
          a[1] + (b[1] - a[1]) * t,
          wrong
        ]);
      }
    };

    const addWrongPath = () => {
      if (!wrongPlan || !wrongPlan.wrongCoords || wrongPlan.wrongCoords.length < 2) return;
      wrongInserted = true;

      const wrong = wrongPlan.wrongCoords;
      for (let i = 0; i < wrong.length - 1; i++) {
        addSegment(wrong[i], wrong[i + 1], true);
      }

      // V5.4: backa/vänd inte manuellt. När fejk-GPS hamnat fel ska riktig
      // omruttning ta över och bygga ny rutt från den felaktiga positionen.
    };

    for (let i = 0; i < coords.length - 1; i++) {
      if (wrongPlan && !wrongInserted && i >= insertAt) {
        addWrongPath();
      }
      addSegment(coords[i], coords[i + 1], false);
    }

    path.push([coords[coords.length - 1][0], coords[coords.length - 1][1], false]);
    return path;
  }

  function bearingBetweenPoints(a, b) {
    if (!a || !b) return 0;
    const lat1 = a[0] * Math.PI / 180;
    const lat2 = b[0] * Math.PI / 180;
    const dLon = (b[1] - a[1]) * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }

  function angleDiff(a, b) {
    return Math.abs(((a - b + 540) % 360) - 180);
  }

  function signedAngleDiff(from, to) {
    return ((to - from + 540) % 360) - 180;
  }

  function offsetPoint(point, bearing, meters) {
    const R = 6371000;
    const brng = bearing * Math.PI / 180;
    const lat1 = point[0] * Math.PI / 180;
    const lon1 = point[1] * Math.PI / 180;
    const d = meters / R;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(d) +
      Math.cos(lat1) * Math.sin(d) * Math.cos(brng)
    );
    const lon2 = lon1 + Math.atan2(
      Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
    );

    return [lat2 * 180 / Math.PI, lon2 * 180 / Math.PI];
  }

  function closestCoordIndex(coords, point) {
    let best = { index: 0, distance: Infinity };
    for (let i = 0; i < coords.length; i++) {
      const d = haversine({ lat: coords[i][0], lon: coords[i][1] }, { lat: point[0], lon: point[1] });
      if (d < best.distance) best = { index: i, distance: d };
    }
    return best.index;
  }

  function coordIndexAtDistance(cumulative, distance) {
    if (!cumulative || !cumulative.length) return 0;
    for (let i = 1; i < cumulative.length; i++) {
      if ((cumulative[i] || 0) >= distance) return i;
    }
    return cumulative.length - 1;
  }

  function findDemoTurnCandidates(route) {
    const coords = route?.coords || [];
    const cumulative = route?.cumulative || buildCumulative(coords);
    const steps = route?.instructions || [];
    if (coords.length < 4) return [];

    const routeDistance = cumulative[cumulative.length - 1] || route.distance || 0;

    const candidates = [];
    for (const step of steps) {
      const text = String(step.text || "").toLowerCase();
      const isTurn =
        text.includes("sväng") ||
        text.includes("håll vänster") ||
        text.includes("håll höger") ||
        text.includes("avfart") ||
        text.includes("rondell") ||
        text.includes("turn") ||
        text.includes("right") ||
        text.includes("left");

      if (!isTurn) continue;
      if (text.includes("framme") || text.includes("arrive")) continue;

      let idx = 0;
      if (typeof step.distanceFromStart === "number") idx = coordIndexAtDistance(cumulative, step.distanceFromStart);
      if (step.point) idx = closestCoordIndex(coords, step.point);

      if (idx < 2 || idx > coords.length - 3) continue;

      const dist = cumulative[idx] || 0;
      if (routeDistance && (dist < routeDistance * 0.12 || dist > routeDistance * 0.88)) continue;

      const beforeIdx = Math.max(0, idx - 3);
      const afterIdx = Math.min(coords.length - 1, idx + 3);
      const before = coords[beforeIdx];
      const turn = coords[idx];
      const after = coords[afterIdx];

      const inBearing = bearingBetweenPoints(before, turn);
      const outBearing = bearingBetweenPoints(turn, after);
      const turnAngle = signedAngleDiff(inBearing, outBearing);
      if (Math.abs(turnAngle) < 25) continue;

      candidates.push({
        routeIndex: idx,
        point: turn,
        inBearing,
        outBearing,
        turnAngle,
        stepText: step.text || "Sväng",
        score: Math.abs(turnAngle) + Math.min(80, dist / 20)
      });
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates;
  }

  async function fetchOsmRoadsNear(point, radius = 95) {
    const [lat, lon] = point;
    const query = `
      [out:json][timeout:14];
      way(around:${radius},${lat},${lon})["highway"]
        ["highway"!~"footway|path|cycleway|bridleway|steps|pedestrian|corridor|platform|construction|proposed"];
      out tags geom;
    `;

    const endpoints = [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter"
    ];

    let lastError = null;
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
          body: "data=" + encodeURIComponent(query)
        });
        if (!res.ok) throw new Error("Overpass svarade inte");
        const data = await res.json();
        return (data.elements || [])
          .filter(elm => elm.type === "way" && elm.geometry && elm.geometry.length >= 2)
          .map(elm => ({
            id: elm.id,
            name: elm.tags?.name || elm.tags?.ref || elm.tags?.highway || "väg",
            highway: elm.tags?.highway || "",
            coords: elm.geometry.map(g => [g.lat, g.lon])
          }));
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error("Kunde inte hämta vägdata");
  }

  function buildWayWrongCoords(way, nearestIndex, direction, turnPoint) {
    const coords = way.coords || [];
    const out = [turnPoint];
    let travelled = 0;
    let prev = coords[nearestIndex] || turnPoint;

    if (haversine({ lat: turnPoint[0], lon: turnPoint[1] }, { lat: prev[0], lon: prev[1] }) > 4) {
      out.push(prev);
    }

    let i = nearestIndex + direction;
    while (i >= 0 && i < coords.length && travelled < 180) {
      const c = coords[i];
      travelled += haversine({ lat: prev[0], lon: prev[1] }, { lat: c[0], lon: c[1] });
      out.push(c);
      prev = c;
      i += direction;
    }

    return { coords: out, travelled };
  }

  function chooseWrongRoadFromOsm(candidate, roads) {
    let best = null;

    for (const way of roads) {
      const coords = way.coords || [];
      for (let i = 0; i < coords.length; i++) {
        const nearDist = haversine(
          { lat: candidate.point[0], lon: candidate.point[1] },
          { lat: coords[i][0], lon: coords[i][1] }
        );
        if (nearDist > 45) continue;

        for (const direction of [-1, 1]) {
          const n = coords[i + direction];
          if (!n) continue;

          const heading = bearingBetweenPoints(coords[i], n);
          const correctDiff = angleDiff(heading, candidate.outBearing);
          const backDiff = angleDiff(heading, (candidate.inBearing + 180) % 360);

          // Inte den rätta vägen, och inte tillbaka där testbilen kom ifrån.
          if (correctDiff < 35 || backDiff < 30) continue;

          const signedFromIncoming = signedAngleDiff(candidate.inBearing, heading);
          const straightScore = Math.max(0, 55 - angleDiff(heading, candidate.inBearing));
          const oppositeTurnScore =
            (candidate.turnAngle > 25 && signedFromIncoming < -25) ||
            (candidate.turnAngle < -25 && signedFromIncoming > 25) ? 45 : 0;

          const built = buildWayWrongCoords(way, i, direction, candidate.point);
          if (!built.coords || built.coords.length < 3 || built.travelled < 70) continue;

          const score =
            correctDiff * 1.5 +
            straightScore +
            oppositeTurnScore -
            nearDist * 0.6 +
            Math.min(45, built.travelled / 4);

          if (!best || score > best.score) {
            best = {
              routeIndex: candidate.routeIndex,
              point: candidate.point,
              wrongCoords: built.coords,
              stepText: candidate.stepText,
              source: `OSM: ${way.name}`,
              score
            };
          }
        }
      }
    }

    return best;
  }

  function fallbackWrongTurnPlan(route) {
    const candidates = findDemoTurnCandidates(route);
    if (!candidates.length) return null;

    const c = candidates[0];
    const wrongBearing = c.inBearing; // Missad sväng: fortsätt i tidigare riktning.
    const wrongCoords = [
      c.point,
      offsetPoint(c.point, wrongBearing, 55),
      offsetPoint(c.point, wrongBearing, 115),
      offsetPoint(c.point, wrongBearing, 175)
    ];

    return {
      routeIndex: c.routeIndex,
      point: c.point,
      wrongCoords,
      stepText: c.stepText,
      source: "fallback: missad sväng"
    };
  }

  async function prepareDemoWrongTurnPlan(route) {
    const candidates = findDemoTurnCandidates(route);
    if (!candidates.length) return null;

    for (const candidate of candidates.slice(0, 5)) {
      if (!state.demoActive) return null;

      try {
        const roads = await fetchOsmRoadsNear(candidate.point, 105);
        const plan = chooseWrongRoadFromOsm(candidate, roads);
        if (plan) return plan;
      } catch (err) {
        console.warn("Kunde inte hämta OSM-vägar för testfelsväng", err);
      }
    }

    return fallbackWrongTurnPlan(route);
  }

  async function startDemoTrip() {
    if (state.demoActive) return;

    state.demoActive = true;
    state.demoWrongAnnounced = false;
    state.demoReturnAnnounced = false;
    state.demoWrongPlan = null;
    state.demoPath = [];
    state.demoIndex = 0;
    state.demoRerouting = false;
    state.demoRerouted = false;
    state.demoPath = [];
    state.demoIndex = 0;
    state.demoRerouting = false;
    state.demoRerouted = false;
    state.offRouteHits = 0;
    state.lastRerouteAt = 0;
    state.lastNavStepKey = "";
    state.lastRemainingRouteIndex = -1;

    document.body.classList.add("demo-active");
    if (el.betaBadge) {
      el.betaBadge.classList.remove("hidden");
      el.betaBadge.textContent = "TESTLÄGE · förbereder";
      el.betaBadge.title = "Klicka för att stoppa testresan";
    }

    if (!state.route || !state.route.coords || state.route.coords.length < 2) {
      makeDemoRoute();
    } else {
      showRouteCard();
      drawRoute(state.route.coords);
      updateStepsUI();
    }

    toast("Testresa: analyserar möjlig felsväng...");

    const plan = await prepareDemoWrongTurnPlan(state.route);
    if (!state.demoActive) return;

    state.demoWrongPlan = plan;

    if (el.betaBadge) {
      el.betaBadge.textContent = "TESTLÄGE · fejk-GPS";
    }

    if (plan) {
      toast(`Testresa: felsväng förberedd vid “${plan.stepText}”`);
    } else {
      toast("Testresa: ingen tydlig felsväng hittades, kör utan fel");
    }

    state.demoPath = interpolateDemoPath(state.route.coords, plan);
    state.demoIndex = 0;

    if (!state.demoPath.length) {
      stopDemoTrip("Kunde inte starta testresa.");
      return;
    }

    demoPosition(state.demoPath[0][0], state.demoPath[0][1], bearingBetweenPoints(state.demoPath[0], state.demoPath[1]));
    enterNavigationMode(false);
    toast("Testresa startad");

    clearInterval(state.demoTimer);
    state.demoTimer = window.setInterval(() => {
      if (!state.demoActive) return;
      if (state.demoRerouting) return;

      const path = state.demoPath || [];
      if (!path.length) {
        stopDemoTrip("Testresa klar");
        return;
      }

      const i = Math.min(state.demoIndex, path.length - 1);
      const current = path[i];
      const next = path[Math.min(i + 1, path.length - 1)];
      const heading = bearingBetweenPoints(current, next);

      if (current[2] && !state.demoWrongAnnounced) {
        state.demoWrongAnnounced = true;
        toast("Testresa: tar en realistisk felsväng");
      }

      demoPosition(current[0], current[1], heading);
      state.demoIndex = i + 1;

      if (state.demoRerouted && !state.demoReturnAnnounced && state.demoIndex > 2) {
        state.demoReturnAnnounced = true;
        toast("Testresa: följer ny omruttad väg");
      }

      if (state.demoIndex >= path.length) {
        stopDemoTrip("Testresa klar");
      }
    }, 720);
  }

  function stopDemoTrip(message = "Testresa stoppad") {
    clearInterval(state.demoTimer);
    state.demoTimer = null;
    state.demoActive = false;
    state.demoLongPressFired = false;
    state.demoWrongAnnounced = false;
    state.demoReturnAnnounced = false;
    state.demoWrongPlan = null;
    state.demoPath = [];
    state.demoIndex = 0;
    state.demoRerouting = false;
    state.demoRerouted = false;
    document.body.classList.remove("demo-active");

    if (el.betaBadge) {
      el.betaBadge.textContent = "BETA · v6.6.8";
      el.betaBadge.title = "Klicka för att dölja. Håll inne för testresa.";
    }

    if (state.navigating) exitNavigationModeSilently();
    restoreRealGpsAfterDemo();
    if (message) toast(message);
  }

  function setupBetaBadgeSecret() {
    if (!el.betaBadge) return;

    el.betaBadge.title = "Klicka för att dölja. Håll inne för testresa.";

    const startHold = (ev) => {
      state.demoLongPressFired = false;
      clearTimeout(state.demoLongPressTimer);
      state.demoLongPressTimer = window.setTimeout(() => {
        state.demoLongPressFired = true;
        if (ev && ev.preventDefault) ev.preventDefault();
        startDemoTrip();
      }, 1500);
    };

    const cancelHold = () => {
      clearTimeout(state.demoLongPressTimer);
    };

    el.betaBadge.addEventListener("pointerdown", startHold);
    el.betaBadge.addEventListener("pointerup", cancelHold);
    el.betaBadge.addEventListener("pointercancel", cancelHold);
    el.betaBadge.addEventListener("pointerleave", cancelHold);

    el.betaBadge.addEventListener("click", (ev) => {
      if (state.demoLongPressFired) {
        ev.preventDefault();
        state.demoLongPressFired = false;
        return;
      }

      if (state.demoActive) {
        stopDemoTrip("Testresa stoppad");
        return;
      }

      el.betaBadge.classList.add("hidden");
    });
  }

  function initEvents() {
    el.panelHandle.addEventListener("click", togglePanelCollapsed);
    setupBetaBadgeSecret();
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
      setFollowMode(!state.follow, true);
    });

    if (el.resumeFollowBtn) {
      const resumeDriving = (ev) => {
        if (ev) {
          ev.preventDefault();
          ev.stopPropagation();
        }
        setFollowMode(true, true, { delayResumeHide: true });
      };
      el.resumeFollowBtn.addEventListener("pointerdown", resumeDriving);
      el.resumeFollowBtn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      });
    }

    el.clearRouteBtn.addEventListener("click", clearAll);
    el.closeRouteBtn.addEventListener("click", clearAll);
    el.manageFavsBtn.addEventListener("click", manageFavorites);
    el.clearRecentsBtn.addEventListener("click", clearRecents);

    el.favoriteDestinationBtn.addEventListener("click", () => saveFavorite(state.destination));
    if (el.shareDestinationBtn) {
      el.shareDestinationBtn.addEventListener("click", () => shareDestination(state.destination));
    }
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

    if (el.tapShareBtn) {
      el.tapShareBtn.addEventListener("click", () => {
        if (!state.selectedTap) return;
        shareDestination({ ...state.selectedTap, label: "Kartpunkt" });
      });
    }

    el.tapCloseBtn.addEventListener("click", () => {
      el.tapSheet.classList.add("hidden");
      clearTapPreviewMarker();
    });

    if (el.settingsBtn) el.settingsBtn.addEventListener("click", showSettings);
    if (el.closeSettingsBtn) el.closeSettingsBtn.addEventListener("click", hideSettings);
    if (el.designModeSelect) el.designModeSelect.addEventListener("change", () => saveDesignMode(el.designModeSelect.value));
    if (el.mapModeSelect) el.mapModeSelect.addEventListener("change", () => saveMapMode(el.mapModeSelect.value));
    if (el.saveFuelSettingsBtn) el.saveFuelSettingsBtn.addEventListener("click", saveFuelSettingsFromForm);
    if (el.clearFuelSettingsBtn) el.clearFuelSettingsBtn.addEventListener("click", clearFuelSettings);

    el.themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      storageSet("30maps:dark", document.body.classList.contains("dark"));
    });

    map.on("resize moveend zoomend viewreset", () => {
      if (state.mapMode === "heading") updateMapRotation(true);
    });

    map.on("dragstart", () => {
      if (state.follow) {
        enterManualMapMode();
      }

      // Auto-minimera bara på telefon/liten skärm när kartan dras.
      // På dator/större skärm ska sök/favoriter vara kvar öppen.
      if (!isDesktopLayout()) {
        setPanelCollapsed(true);
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && state.navigating && !state.arrivedHandled) {
        requestWakeLock();
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
    loadDesignMode();
    loadMapMode();
    if (storageGet("30maps:dark", false)) document.body.classList.add("dark");
    loadFuelSettings();
    renderFuelSettingsForm();
    renderFavorites();
    renderRecents();
    initEvents();
    registerServiceWorker();
    window.addEventListener("resize", setRouteCompactMode);
    window.addEventListener("hashchange", () => handleSharedDestinationLink({ force: true }));
    startGeolocation();
    handleSharedDestinationLink({ force: true });
    updateShareButtons();
    console.log(`30maps V${VERSION} loaded`);
  }

  init();
})();
