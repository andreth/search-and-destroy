<template>
  <div class="tactical-map">
    <!-- Titre type HUD militaire -->
    <div class="map-header">
      <span class="map-label">SECTEUR — ACCÈS</span>
      <span class="map-status">RADAR ACTIF</span>
    </div>

    <!-- Carte avec tous les effets à l'intérieur -->
    <div class="map-viewport">
      <!-- Fond dégradé type scope -->
      <div class="map-bg"></div>

      <!-- Grille tactique (lignes + cercles) -->
      <div class="grid-lines"></div>
      <div class="grid-circles"></div>

      <!-- Balayage radar (ligne qui tourne) -->
      <div class="radar-sweep"></div>

      <!-- Lueur verte type scope -->
      <div class="scope-glow"></div>

      <!-- Marqueurs base militaire -->
      <div class="marker marker-hq" title="HQ">HQ</div>
      <div class="marker marker-outpost" title="Outpost">OP</div>
      <div class="marker marker-alpha" title="Alpha">A</div>
      <div class="marker marker-bravo" title="Bravo">B</div>

      <!-- Courbes de liaison (trajectoires) -->
      <svg class="trajectories" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path class="path path-1" d="M 20 50 Q 50 30 80 50" />
        <path class="path path-2" d="M 50 20 Q 70 50 50 80" />
      </svg>

      <!-- Coins cadre type HUD -->
      <div class="corner corner-tl"></div>
      <div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div>
      <div class="corner corner-br"></div>
    </div>

    <!-- Pied avec coordonnées factices -->
    <div class="map-footer">
      <span>GRID 44-72</span>
      <span class="blink">REC</span>
    </div>
  </div>
</template>

<style scoped>
.tactical-map {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 320px;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 10px;
  border: 1px solid rgba(74, 222, 128, 0.25);
  border-left-width: 3px;
  background: rgba(0, 0, 0, 0.4);
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(74, 222, 128, 0.9);
}

.map-status {
  color: rgba(74, 222, 128, 0.6);
  font-weight: 600;
}

.map-viewport {
  position: relative;
  flex: 1;
  min-height: 360px;
  background: radial-gradient(ellipse 80% 80% at 50% 50%, #0b1210, #030504 70%);
  border: 1px solid rgba(74, 222, 128, 0.15);
  overflow: hidden;
}

.map-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.6) 100%);
  pointer-events: none;
}

/* Grille lignes horizontales / verticales */
.grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(74, 222, 128, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(74, 222, 128, 0.06) 1px, transparent 1px);
  background-size: 12% 12%;
  pointer-events: none;
}

/* Cercles concentriques type radar */
.grid-circles {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at center, transparent 15%, rgba(74, 222, 128, 0.08) 15%, transparent 30%),
    radial-gradient(circle at center, transparent 30%, rgba(74, 222, 128, 0.08) 30%, transparent 45%),
    radial-gradient(circle at center, transparent 45%, rgba(74, 222, 128, 0.06) 45%, transparent 60%),
    radial-gradient(circle at center, transparent 60%, rgba(74, 222, 128, 0.05) 60%, transparent 75%);
  pointer-events: none;
}

/* Balayage radar rotatif */
.radar-sweep {
  position: absolute;
  inset: 0;
  background: conic-gradient(
    from 0deg at 50% 50%,
    transparent 0deg,
    rgba(74, 222, 128, 0.12) 15deg,
    transparent 30deg
  );
  animation: sweep 4s linear infinite;
  pointer-events: none;
}

@keyframes sweep {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Lueur verte type scope */
.scope-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 50%,
    transparent 50%,
    rgba(74, 222, 128, 0.04) 80%,
    transparent 100%
  );
  pointer-events: none;
}

/* Marqueurs base / unités */
.marker {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #4ade80;
  background: rgba(10, 13, 12, 0.9);
  border: 1px solid rgba(74, 222, 128, 0.5);
  box-shadow:
    0 0 8px rgba(74, 222, 128, 0.3),
    inset 0 0 8px rgba(74, 222, 128, 0.05);
  pointer-events: none;
}

.marker-hq   { top: 28%;  left: 22%; }
.marker-outpost { top: 55%; right: 25%; }
.marker-alpha { top: 40%; left: 50%; transform: translateX(-50%); }
.marker-bravo { bottom: 30%; left: 35%; }

/* Trajectoires en pointillés */
.trajectories {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.trajectories .path {
  fill: none;
  stroke: rgba(74, 222, 128, 0.35);
  stroke-width: 0.5;
  stroke-dasharray: 4 4;
  stroke-dashoffset: 0;
  animation: dash 8s linear infinite;
}

.path-2 { animation-delay: -2s; }

@keyframes dash {
  to { stroke-dashoffset: -32; }
}

/* Coins cadre HUD */
.corner {
  position: absolute;
  width: 18px;
  height: 18px;
  border-color: rgba(74, 222, 128, 0.5);
  border-style: solid;
  border-width: 0;
  pointer-events: none;
}

.corner-tl { top: 4px;  left: 4px;  border-top-width: 2px; border-left-width: 2px; }
.corner-tr { top: 4px;  right: 4px; border-top-width: 2px; border-right-width: 2px; }
.corner-bl { bottom: 4px; left: 4px;  border-bottom-width: 2px; border-left-width: 2px; }
.corner-br { bottom: 4px; right: 4px; border-bottom-width: 2px; border-right-width: 2px; }

.map-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding: 4px 10px;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: rgba(74, 222, 128, 0.5);
}

.blink {
  animation: blink 1.2s step-end infinite;
  color: rgba(250, 204, 21, 0.8);
}

@keyframes blink {
  50% { opacity: 0.4; }
}
</style>
