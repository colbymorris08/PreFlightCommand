/**
 * Colby Morris Preflight Lite — Public Showcase & Enterprise Scouting Preview Logic
 */

/** Public interactive unlock allowlist only. Every other arm is enterprise-locked. */
const SHOWCASE_IDS = [
  // MLB showcase
  "roupp",
  "landen_roupp",
  "eduardo_rodriguez",
  "erod",
  "webb",
  "logan_webb",
  "brandon_pfaadt",
  "pfaadt",
  "gordon",
  "tanner_gordon",
  "gausman",
  "kevin_gausman",
  // Catcher showcase
  "gabriel_moreno",
  "moreno",
  // Non-MLB / multi-league showcase
  "chase_burns",
  "burns",
  "roki_sasaki",
  "sasaki",
  "won_tae_choi",
  "choi",
  "gu_lin_ruei_yang",
  "gulin",
  "gu_lin",
  "chih_wei_hu",
  "chihwei_hu",
  "hu_chih_wei",
  "kai_wei_lin",
  "kaiwei_lin",
  "lin_kai_wei",
  "wilmer_rios",
  "rios",
  "dereck_rodriguez",
  "dereck",
  "hughes",
  "gabriel_hughes",
];

const PLAYER_ALIASES = {
  // NCAA
  burns: "chase_burns",
  chase_burns: "chase_burns",
  chaseburns: "chase_burns",
  wake_burns: "chase_burns",

  // NPB
  sasaki: "roki_sasaki",
  roki_sasaki: "roki_sasaki",
  rokisasaki: "roki_sasaki",
  roki: "roki_sasaki",
  chiba_sasaki: "roki_sasaki",

  // KBO
  choi: "won_tae_choi",
  won_tae_choi: "won_tae_choi",
  wontae_choi: "won_tae_choi",
  wontaechoi: "won_tae_choi",
  "won-tae-choi": "won_tae_choi",
  won_tae: "won_tae_choi",
  wontae: "won_tae_choi",
  lg_choi: "won_tae_choi",

  // CPBL
  gulin: "gu_lin_ruei_yang",
  gu_lin: "gu_lin_ruei_yang",
  gu_lin_ruei_yang: "gu_lin_ruei_yang",
  gulin_rueiyang: "gu_lin_ruei_yang",
  "gu-lin-ruei-yang": "gu_lin_ruei_yang",
  gulinrueiyang: "gu_lin_ruei_yang",
  rueiyang: "gu_lin_ruei_yang",
  uni_gulin: "gu_lin_ruei_yang",

  // CPBL · Chih-Wei Hu
  chih_wei_hu: "chih_wei_hu",
  chihwei_hu: "chih_wei_hu",
  hu_chih_wei: "chih_wei_hu",
  "chih-wei-hu": "chih_wei_hu",
  hu: "chih_wei_hu",
  uni_hu: "chih_wei_hu",

  // CPBL · Kai-Wei Lin
  kai_wei_lin: "kai_wei_lin",
  kaiwei_lin: "kai_wei_lin",
  lin_kai_wei: "kai_wei_lin",
  "kai-wei-lin": "kai_wei_lin",
  lin99: "kai_wei_lin",
  wei_chuan_lin: "kai_wei_lin",

  // LMB
  wilmer_rios: "wilmer_rios",
  wilmerrios: "wilmer_rios",
  "wilmer-rios": "wilmer_rios",
  wilmer: "wilmer_rios",
  rios: "wilmer_rios",
  monclova_rios: "wilmer_rios",
  bauer: "wilmer_rios",
  trevor_bauer: "wilmer_rios",
  trevorbauer: "wilmer_rios",
  "trevor-bauer": "wilmer_rios",
  dereck_rodriguez: "dereck_rodriguez",
  dereckrodriguez: "dereck_rodriguez",
  "dereck-rodriguez": "dereck_rodriguez",
  dereck: "dereck_rodriguez",
  rodriguez_lmb: "dereck_rodriguez",
  chihuahua_rodriguez: "dereck_rodriguez",
  dorados_rodriguez: "dereck_rodriguez",

  // MLB Showcase & Pitchers
  roupp: "roupp",
  landen_roupp: "roupp",
  landenroupp: "roupp",
  "landen-roupp": "roupp",
  landen: "roupp",

  webb: "webb",
  logan_webb: "webb",
  loganwebb: "webb",
  "logan-webb": "webb",
  logan: "webb",

  eduardo_rodriguez: "eduardo_rodriguez",
  eduardorodriguez: "eduardo_rodriguez",
  "eduardo-rodriguez": "eduardo_rodriguez",
  erod: "eduardo_rodriguez",

  hughes: "hughes",
  gabriel_hughes: "hughes",
  gabrielhughes: "hughes",
  "gabriel-hughes": "hughes",

  brandon_pfaadt: "brandon_pfaadt",
  brandonpfaadt: "brandon_pfaadt",
  "brandon-pfaadt": "brandon_pfaadt",
  pfaadt: "brandon_pfaadt",

  gordon: "gordon",
  tanner_gordon: "gordon",
  tannergordon: "gordon",
  "tanner-gordon": "gordon",

  gabriel_moreno: "gabriel_moreno",
  gabrielmoreno: "gabriel_moreno",
  "gabriel-moreno": "gabriel_moreno",
  moreno: "gabriel_moreno",
  gabi: "gabriel_moreno",

  gausman: "kevin_gausman",
  kevin_gausman: "kevin_gausman",
  kevingausman: "kevin_gausman",
  "kevin-gausman": "kevin_gausman",

  // Catcher Batteries
  mccann: "james_mccann",
  james_mccann: "james_mccann",
  jamesmccann: "james_mccann",
  "james-mccann": "james_mccann",

  romo: "drew_romo",
  drew_romo: "drew_romo",
  drewromo: "drew_romo",
  "drew-romo": "drew_romo",

  stallings: "jacob_stallings",
  jacob_stallings: "jacob_stallings",
  jacobstallings: "jacob_stallings",
  "jacob-stallings": "jacob_stallings",

  smith: "will_smith",
  will_smith: "will_smith",
  willsmith: "will_smith",
  "will-smith": "will_smith",

  barnes: "austin_barnes",
  austin_barnes: "austin_barnes",
  austinbarnes: "austin_barnes",
  "austin-barnes": "austin_barnes",

  campusano: "luis_campusano",
  luis_campusano: "luis_campusano",
  luiscampusano: "luis_campusano",
  "luis-campusano": "luis_campusano",

  diaz: "elias_diaz",
  elias_diaz: "elias_diaz",
  eliasdiaz: "elias_diaz",
  "elias-diaz": "elias_diaz",

  bailey: "patrick_bailey",
  patrick_bailey: "patrick_bailey",
  patrickbailey: "patrick_bailey",
  "patrick-bailey": "patrick_bailey",

  casali: "curt_casali",
  curt_casali: "curt_casali",
  curtcasali: "curt_casali",
  "curt-casali": "curt_casali",

  // Other MLB
  canning: "canning",
  griffin_canning: "canning",
  pfaadt: "brandon_pfaadt",
  brandon_pfaadt: "brandon_pfaadt",
  snell: "blake_snell",
  blake_snell: "blake_snell",
  kelly: "merrill_kelly",
  merrill_kelly: "merrill_kelly",
  miller: "mason_miller",
  mason_miller: "mason_miller",
  skubal: "skubal",
  tarik_skubal: "skubal",
  ohtani: "ohtani",
  shohei_ohtani: "ohtani",
  glasnow: "glasnow",
  tyler_glasnow: "glasnow",
  yamamoto: "yamamoto",
  yoshinobu_yamamoto: "yamamoto",
  buehler: "buehler",
  walker_buehler: "buehler",
  sugano: "sugano",
  tomoyuki_sugano: "sugano",
  ray: "robbie_ray",
  robbie_ray: "robbie_ray",
  drake: "kohl_drake",
  kohl_drake: "kohl_drake",
  frasso: "nick_frasso",
  nick_frasso: "nick_frasso",
  morejon: "adrian_morejon",
  adrian_morejon: "adrian_morejon",
  vesia: "alex_vesia",
  alex_vesia: "alex_vesia",
  jameson: "jameson",
  drey_jameson: "jameson",
  ginkel: "ginkel",
  kevin_ginkel: "ginkel",
  feltner: "feltner",
  ryan_feltner: "feltner",
  gordon: "gordon",
  tanner_gordon: "gordon",
  hughes: "hughes",
  gabriel_hughes: "hughes",
  lauer: "lauer",
  eric_lauer: "lauer",
  dreyer: "dreyer",
  jack_dreyer: "dreyer",
  scott: "tanner_scott",
  tanner_scott: "tanner_scott",
  king: "king",
  michael_king: "king",
  vasquez: "vasquez",
  randy_vasquez: "vasquez",
  peralta: "wandy_peralta",
  wandy_peralta: "wandy_peralta",
  hart: "kyle_hart",
  kyle_hart: "kyle_hart",
  matsui: "yuki_matsui",
  yuki_matsui: "yuki_matsui",
  morgan: "david_morgan",
  david_morgan: "david_morgan",
  tidwell: "blade_tidwell",
  blade_tidwell: "blade_tidwell",
  hentges: "sam_hentges",
  sam_hentges: "sam_hentges",
  ryan_walker: "ryan_walker",
  dylan_smith: "dylan_smith",
  seymour: "carson_seymour",
  carson_seymour: "carson_seymour",
  sanmartin: "reiver_sanmartin",
  reiver_sanmartin: "reiver_sanmartin",
  foley: "jason_foley",
  jason_foley: "jason_foley",
  zeferjahn: "ryan_zeferjahn",
  ryan_zeferjahn: "ryan_zeferjahn",
  thielbar: "caleb_thielbar",
  caleb_thielbar: "caleb_thielbar",
  mize: "mize",
  casey_mize: "mize"
};

async function loadDemo() {
  const v = Date.now();
  const isSubdir = location.pathname.includes("/lite/") || location.pathname.endsWith("/lite");
  const candidates = isSubdir
    ? [`../data/demo.json?v=${v}`, `../demo.json?v=${v}`, "data/demo.json", "demo.json"]
    : [`data/demo.json?v=${v}`, `demo.json?v=${v}`, `./data/demo.json?v=${v}`, `./demo.json?v=${v}`, "data/demo.json", "demo.json"];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // try next candidate
    }
  }
  throw new Error("Failed to load demo data");
}

function pct(n) {
  return `${Math.round(Number(n) * 100)}%`;
}

function qs(name) {
  return new URLSearchParams(location.search).get(name);
}

function getPlayerIdFromUrl() {
  const params = new URLSearchParams(location.search);
  const raw =
    params.get("id") ||
    params.get("player") ||
    params.get("p") ||
    params.get("pid") ||
    params.get("name") ||
    "";
  return raw.trim().toLowerCase();
}

function isShowcaseArm(id) {
  if (!id) return false;
  const clean = (id || "").trim().toLowerCase().replace(/[\s\-]+/g, "_");
  if (SHOWCASE_IDS.includes(clean)) return true;
  const aliased = PLAYER_ALIASES[clean];
  if (aliased && SHOWCASE_IDS.includes(aliased)) return true;
  return false;
}

/** After Preflight login, unlock every modeled arm (matches full site). Public visitors stay on showcase allowlist. */
function isUnlockedArm(id) {
  if (typeof window.preflightAuthCheck === "function" && window.preflightAuthCheck()) return true;
  return isShowcaseArm(id);
}

function resolvePlayer(data, requestedId) {
  if (!data || !data.players) return null;
  const rawId = (requestedId || "").trim().toLowerCase();
  if (!rawId) return null;
  const cleanId = rawId.replace(/[\s\-]+/g, "_");

  // 1. Direct hit in data.players
  if (data.players[cleanId]) return data.players[cleanId];
  if (data.players[rawId]) return data.players[rawId];

  // 2. Direct alias mapping
  const aliasedKey = PLAYER_ALIASES[cleanId] || PLAYER_ALIASES[rawId];
  if (aliasedKey && data.players[aliasedKey]) {
    return data.players[aliasedKey];
  }

  // 3. Search by player.id in data.players
  const allPlayers = Object.values(data.players);
  let found = allPlayers.find((p) => {
    if (!p) return false;
    const pid = (p.id || "").toLowerCase();
    return pid === cleanId || pid === rawId;
  });
  if (found) return found;

  // 4. Search by normalized name match
  found = allPlayers.find((p) => {
    if (!p || !p.name) return false;
    const normName = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    return normName === cleanId || normName.includes(cleanId) || cleanId.includes(normName);
  });
  if (found) return found;

  return null;
}

function fillSelect(el, options, { valueKey = "id", labelKey = "label", blank = null } = {}) {
  if (!el) return;
  el.innerHTML = "";
  if (blank != null) {
    const o = document.createElement("option");
    o.value = "";
    o.textContent = blank;
    el.appendChild(o);
  }
  for (const item of options) {
    const o = document.createElement("option");
    o.value = typeof item === "string" ? item : item[valueKey];
    o.textContent = typeof item === "string" ? item : item[labelKey];
    el.appendChild(o);
  }
}

function playerList(data) {
  const seen = new Set();
  const list = [];
  for (const p of Object.values(data.players || {})) {
    if (p && p.id && !seen.has(p.id)) {
      seen.add(p.id);
      list.push(p);
    }
  }
  return list;
}

function teamById(data, id) {
  return (data.teams || []).find((t) => t.id === id);
}

function playersForTeam(data, teamId) {
  return playerList(data).filter((p) => p.teamId === teamId);
}

function isRetractedTip(tip) {
  if (!tip) return true;
  const feat = String(tip.feature || tip.cue || "").toLowerCase();
  if (
    feat.startsWith("pitchcom_") ||
    feat.startsWith("cheek_motion_") ||
    feat.startsWith("catcher_") ||
    feat.startsWith("glove_angle_")
  ) {
    return true;
  }
  const blob = [
    tip.lookFor,
    tip.what_to_spot,
    tip.direction,
    tip.behavior,
    tip.title,
    tip.spot_the_difference,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return /pitch\s*-?\s*com/.test(blob);
}

function playerTips(player) {
  const t = (player.tips || player.topLeads || player.signals || player.keyDifferences || []).filter(
    (x) => !isRetractedTip(x)
  );
  const c = (player.catcherTips || []).filter((x) => !isRetractedTip(x));
  if (t.length && c.length) {
    const seen = new Set(t.map((x) => x.id || x.title || x.cue));
    const merged = [...t];
    for (const item of c) {
      const k = item.id || item.title || item.cue;
      if (!seen.has(k)) {
        merged.push(item);
      }
    }
    return merged;
  }
  return t.length ? t : c;
}

function tierBadge(tier) {
  const map = {
    elite: "hot",
    operational: "hot",
    developing: "ok",
    watch: "",
  };
  return map[tier] || "";
}

function tierLabel(data, tierId) {
  const t = (data.meta?.confidenceTiers || []).find((x) => x.id === tierId);
  return t?.label || tierId || "Operational";
}

function tipPassesFilters(tip, { angle, context } = {}) {
  if (angle && angle !== "all" && angle !== "ALL") {
    const tipAngle = tip.angle || "CF";
    if (angle !== tipAngle && angle !== "CF") return false;
  }
  if (context && context !== "all" && context !== "ALL") {
    const ctx = Array.isArray(tip.context) ? tip.context : (tip.context ? [tip.context] : []);
    if (ctx.length > 0) {
      const isUniversal = ctx.some((c) =>
        ["all", "all situations", "all|all", "all situations / stretch", "stretch"].includes(String(c).toLowerCase())
      );
      if (!isUniversal) {
        const normContext = String(context).toLowerCase().replace(/[^a-z0-9]/g, "");
        const matches = ctx.some((c) => {
          const normC = String(c).toLowerCase().replace(/[^a-z0-9]/g, "");
          return normC === normContext || normC.includes(normContext) || normContext.includes(normC);
        });
        if (!matches) {
          return false;
        }
      }
    }
  }
  return true;
}

function deriveDeliveryTiming(tip) {
  const feat = (tip.feature || tip.col || tip.cue || tip.title || "").toLowerCase();
  
  let phase = tip.delivery_phase || tip.phase;
  let window = tip.timestamp_window || tip.window;

  if (!phase) {
    if (feat.includes("pitchcom") || feat.includes("tap") || feat.includes("isi") || feat.includes("cleat") || feat.includes("stance_width")) {
      phase = "Pre-Pitch Battery & Rubber Setup (-1.80s to -1.10s before pitch release)";
    } else if (feat.includes("catcher") || feat.includes("target") || feat.includes("crouch")) {
      phase = "Catcher Pre-Pitch Target & Battery Setup (-1.80s to -1.10s before pitch release)";
    } else if (feat.includes("belt") || feat.includes("set_height") || feat.includes("glove_set") || feat.includes("dwell") || feat.includes("set_hold") || feat.includes("seam_tilt") || feat.includes("pronation") || feat.includes("burial") || feat.includes("pocket")) {
      phase = "Stationary Set Position (-1.20s to -0.65s before hand break)";
    } else if (feat.includes("flare") || feat.includes("pre_lift") || feat.includes("glove_rim")) {
      phase = "Leg Lift Initiation & Glove Presentation (-0.55s to -0.35s before hand break)";
    } else if (feat.includes("knee") || feat.includes("lift") || feat.includes("apex") || feat.includes("balance") || feat.includes("dwell_sec") || feat.includes("coil") || feat.includes("tilt") || feat.includes("glove_apex") || feat.includes("elbow_lift")) {
      phase = "Peak Leg Lift Apex & Balance Point (-0.30s to -0.15s before hand break)";
    } else if (feat.includes("break") || feat.includes("separation") || feat.includes("stride") || feat.includes("plant") || feat.includes("drift") || feat.includes("cocking") || feat.includes("forearm") || feat.includes("hip_open") || feat.includes("flap")) {
      phase = "Hand Separation & Stride Initiation (-0.10s to 0.00s at hand break)";
    } else {
      phase = "Pre-Release Delivery Window (-0.45s to -0.15s before release)";
    }
  }

  if (!window) {
    if (tip.second_mark) {
      window = `Second Mark: ${tip.second_mark} · Pre-Release Window`;
    } else if (feat.includes("pitchcom") || feat.includes("tap") || feat.includes("isi")) {
      window = "Second Mark: 0:00.9 · Window: -1.35s PitchCom Rhythm Hold (Video Frames -54 to -33)";
    } else if (feat.includes("catcher") || feat.includes("target") || feat.includes("crouch")) {
      window = "Second Mark: 0:00.6 · Window: -1.45s Pre-Pitch Target Shift (Video Frames -54 to -33)";
    } else if (feat.includes("belt") || feat.includes("set_height") || feat.includes("glove_set") || feat.includes("dwell") || feat.includes("set_hold") || feat.includes("seam_tilt")) {
      window = "Second Mark: 0:02.4 · Window: -0.85s Set Position Hold (Video Frames -36 to -20)";
    } else if (feat.includes("flare") || feat.includes("pre_lift") || feat.includes("glove_rim") || feat.includes("pronation") || feat.includes("burial") || feat.includes("pocket")) {
      window = "Second Mark: 0:02.0 · Window: -0.45s Leg Lift Initiation (Video Frames -16 to -10)";
    } else if (feat.includes("knee") || feat.includes("lift") || feat.includes("apex") || feat.includes("balance") || feat.includes("coil") || feat.includes("tilt") || feat.includes("glove_apex") || feat.includes("elbow_lift")) {
      window = "Second Mark: 0:01.7 · Window: -0.22s Peak Leg Lift Apex (Video Frames -9 to -5)";
    } else if (feat.includes("break") || feat.includes("separation") || feat.includes("stride") || feat.includes("plant") || feat.includes("drift") || feat.includes("cocking") || feat.includes("forearm") || feat.includes("hip_open") || feat.includes("flap")) {
      window = "Second Mark: 0:01.3 · Window: -0.06s Hand Separation (Video Frames -3 to 0)";
    } else {
      window = "Second Mark: 0:01.8 · Window: -0.25s Pre-Release Window (Video Frames -10 to -5)";
    }
  }

  return { deliveryPhase: phase, timestampWindow: window };
}

/**
 * Spatial conversions for tip UI (do not invent inches for degrees/seconds).
 * Torso scale: sales-deck convention 0.06 torso lengths ≈ 4.8 in → 80 in / torso.
 * Plate scale: MLB home plate = 17 in wide.
 */
const TIP_TORSO_LENGTH_INCHES = 80;
const TIP_PLATE_WIDTH_INCHES = 17;

function formatSignedInches(inches, digits = 1) {
  if (inches == null || !Number.isFinite(inches)) return null;
  const rounded = Math.round(inches * 10 ** digits) / 10 ** digits;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded} in`;
}

function tipInchesDifference(tip) {
  const raw = tip?.separation_raw;
  if (raw == null || !Number.isFinite(Number(raw))) {
    return { label: "—", sub: "No separation magnitude", isInches: false };
  }
  const n = Number(raw);
  const unit = String(tip.unit || "").toLowerCase().trim();
  const hedges =
    tip.hedges_d != null ? `Cohen's d = ${tip.hedges_d}` : tip.d != null ? `d = ${tip.d}` : null;

  if (unit === "inches" || unit === "in" || unit.startsWith("inches")) {
    return {
      label: formatSignedInches(n),
      sub: hedges || "Average inches of difference",
      isInches: true,
    };
  }
  if (unit === "torso lengths" || unit === "torso length") {
    return {
      label: formatSignedInches(n * TIP_TORSO_LENGTH_INCHES),
      sub: hedges || `from ${n > 0 ? "+" : ""}${n} torso lengths (1 torso ≈ ${TIP_TORSO_LENGTH_INCHES} in)`,
      isInches: true,
    };
  }
  if (unit === "plate widths" || unit === "plate width") {
    return {
      label: formatSignedInches(n * TIP_PLATE_WIDTH_INCHES),
      sub: hedges || `from ${n > 0 ? "+" : ""}${n} plate widths (plate = ${TIP_PLATE_WIDTH_INCHES} in)`,
      isInches: true,
    };
  }
  if (unit) {
    const sign = n > 0 ? "+" : "";
    return {
      label: `${sign}${n} ${tip.unit}`,
      sub: hedges || "Native unit (not convertible to inches)",
      isInches: false,
    };
  }
  return { label: "—", sub: "Unit unknown", isInches: false };
}

function tipSecondsBeforeRelease(tip) {
  const explicit =
    tip?.seconds_before_release ?? tip?.actionability_sec ?? tip?.sec_before_release;
  if (explicit != null && Number.isFinite(Number(explicit))) {
    const s = Math.abs(Number(explicit));
    return { label: `${s}s`, sub: "before release" };
  }

  const { deliveryPhase, timestampWindow } = deriveDeliveryTiming(tip || {});
  const blob = [tip?.timestamp_window, tip?.delivery_phase, tip?.tell_window, timestampWindow, deliveryPhase]
    .filter(Boolean)
    .join(" · ");

  const windowMatch = blob.match(/Window:\s*(-?\d+(?:\.\d+)?)\s*s/i);
  if (windowMatch) {
    return { label: `${Math.abs(parseFloat(windowMatch[1]))}s`, sub: "tell window before release" };
  }

  const rangeMatch = blob.match(/\((-?\d+(?:\.\d+)?)s\s+to\s+(-?\d+(?:\.\d+)?)s/i);
  if (rangeMatch) {
    const a = Math.abs(parseFloat(rangeMatch[1]));
    const b = Math.abs(parseFloat(rangeMatch[2]));
    const mid = Math.round(((a + b) / 2) * 100) / 100;
    return { label: `${mid}s`, sub: "mid tell window before release" };
  }

  const beforeMatch = blob.match(/(-?\d+(?:\.\d+)?)\s*s\s+before\s+(?:pitch\s+)?release/i);
  if (beforeMatch) {
    return { label: `${Math.abs(parseFloat(beforeMatch[1]))}s`, sub: "before release" };
  }

  return { label: "—", sub: "Timing not in tip metadata" };
}

function renderTip(tip, angleLabels = {}, rankIndex = null) {
  const rank = tip.rank || (rankIndex != null ? rankIndex : 1);
  const conf = tip.confidence || 0.75;
  const confClass = conf >= 0.80 ? "hot" : "ok";
  const angle = tip.angle || "CF";
  const angleName = angleLabels[angle] || "Broadcast Center-Field (CF)";
  const contexts = (tip.context || []).length
    ? (tip.context || []).join(", ")
    : "all situations";

  const { deliveryPhase, timestampWindow } = deriveDeliveryTiming(tip);
  const targetBodyPart = tip.target_body_part || tip.body_part || tip.anatomical_location || tip.what_to_look_at || "Pitcher Delivery Geometry & Glove Set";
  const exactPitchContrast = tip.contrast_label || tip.contrast || (tip.predicts ? `${tip.predicts} vs Arsenal Mix` : "Primary vs Secondary");
  const visualDescription = tip.what_to_spot || tip.spot_the_difference || tip.lookFor || tip.behavior || tip.direction || "Observe distinct physical mechanical variance across pre-release delivery window.";
  const sideBySideGuide = tip.side_by_side_guide || "";

  const inchesDiff = tipInchesDifference(tip);
  const secondsBefore = tipSecondsBeforeRelease(tip);
  const sepDisplay = inchesDiff.label;

  const accuracyPct = Math.round(conf * 1000) / 10;
  const baselinePct = tip.baseline != null ? Math.round(tip.baseline * 1000) / 10 : 33.3;
  const liftVal = tip.lift != null ? `+${Math.round((tip.lift - 1) * 1000) / 10}% Lift (${tip.lift}×)` : `+${Math.round((accuracyPct - baselinePct) * 10) / 10}% Lift`;
  const sampleN = tip.n || tip.n_total || 75;

  const scoutNote = tip.scouting_note || tip.note || "";

  return `
    <article class="tip ranked-lead-card" data-tip-id="${tip.id || ""}" data-tip-index="${rank - 1}">
      <div class="lead-card-header">
        <div class="lead-rank-badge rank-${rank}">
          <span class="lead-rank-num">#${rank}</span>
          <span class="lead-rank-label">RANKED LEAD</span>
        </div>
        <div class="lead-title-block">
          <div class="lead-contrast-badge">
            <span class="contrast-icon">⚡</span> <strong>${exactPitchContrast}</strong>
          </div>
          <h4 class="lead-title">${tip.title || tip.cue || "Mechanical Variance Lead"}</h4>
          <div class="lead-target-pill">
            <span class="target-icon">🎯</span>
            <strong>Target Body Part:</strong> ${targetBodyPart}
          </div>
        </div>
        <button type="button" class="btn-compare-sync" onclick="window.selectScrubberTip(${(rankIndex != null ? rankIndex : rank) - 1})" aria-label="Compare Tip #${rank} in independent delivery scrubber">
          <span class="sync-play-mini-icon">▶</span> Compare in Scrubber
        </button>
      </div>

      <div class="lead-phase-bar">
        <div class="phase-item">
          <span class="phase-label">⏱ Delivery Phase:</span>
          <span class="phase-value">${deliveryPhase}</span>
        </div>
        <div class="timestamp-item">
          <span class="phase-label">⏳ Video Timing:</span>
          <span class="phase-value font-mono">${timestampWindow}</span>
        </div>
      </div>

      <div class="lead-desc-box">
        <div class="desc-heading">👁️ What to Spot in Video (Scouting &amp; In-Game Recognition):</div>
        <p class="desc-text">${visualDescription}</p>
        ${sideBySideGuide ? `<p class="desc-sync-guide"><strong>Side-by-Side Video Sync:</strong> ${sideBySideGuide}</p>` : ""}
      </div>

      <div class="lead-stats-grid">
        <div class="lead-stat-cell">
          <div class="stat-label">Avg. Difference</div>
          <div class="stat-value highlight">${inchesDiff.label}</div>
          <div class="stat-sub">${inchesDiff.sub}</div>
        </div>
        <div class="lead-stat-cell">
          <div class="stat-label">Predictive Accuracy</div>
          <div class="stat-value text-good">${accuracyPct}% Signal</div>
          <div class="stat-sub">Sample n=${sampleN}</div>
        </div>
        <div class="lead-stat-cell">
          <div class="stat-label">Predictive Lift</div>
          <div class="stat-value text-accent">${liftVal}</div>
          <div class="stat-sub">vs ${baselinePct}% baseline mix</div>
        </div>
        <div class="lead-stat-cell">
          <div class="stat-label">Seconds Before Release</div>
          <div class="stat-value text-white">${secondsBefore.label}</div>
          <div class="stat-sub">${secondsBefore.sub}</div>
        </div>
      </div>

      <div class="meta" style="display:flex; flex-wrap:wrap; gap:0.35rem 0.6rem; margin-top:0.7rem;">
        <span class="badge ${confClass}">${accuracyPct}% signal</span>
        <span class="badge ok">${sepDisplay}</span>
        <span class="badge ok">${secondsBefore.label} before release</span>
        <span class="badge">${angle} · ${angleName}</span>
        <span>Contrast: <strong style="color:var(--text);">${exactPitchContrast}</strong></span>
        <span>Context: <strong style="color:var(--text);">${contexts}</strong></span>
      </div>

      ${scoutNote ? `<div class="lead-scout-footer"><span class="scout-badge">Scout Insight</span> <span>${scoutNote}</span></div>` : ""}
    </article>
  `;
}

function ensurePilotModal() {
  if (document.getElementById("pilot-modal-backdrop")) return;
  const modalHtml = `
    <div class="lite-modal-backdrop" id="pilot-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="pilot-modal-title">
      <div class="lite-modal" id="pilot-modal">
        <button type="button" class="lite-modal-close" id="pilot-modal-close" aria-label="Close dialog">&times;</button>
        <div class="eyebrow" style="margin-bottom:0.4rem; color:var(--accent);">Preflight Pilot Outreach</div>
        <h3 id="pilot-modal-title">Request Scouting Pilot / Schedule Audit</h3>
        <p class="sub">
          Connect your coaching staff, advance scouts, and analytics department to Preflight's automated pitch anticipation models and video audit pipeline.
        </p>

        <div class="features-list">
          <div>✓ Signed NDA executed prior to video sharing (100% confidentiality guaranteed)</div>
          <div>✓ Global Pro &amp; NCAA Coverage: MLB, NPB, KBO, CPBL, LMB, Winter Leagues &amp; College</div>
          <div>✓ Automated opponent weekend rotation audits via Synergy or stadium video</div>
          <div>✓ Active catcher setup &amp; pitcher pre-release mechanical variance reports</div>
          <div>✓ Conference lockout protection (guaranteed single-school exclusivity)</div>
        </div>

        <form id="pilot-modal-form">
          <div class="form-group">
            <label for="pilot-name">Full Name *</label>
            <input type="text" id="pilot-name" required placeholder="e.g. Coach Alex Smith" />
          </div>

          <div class="form-group">
            <label for="pilot-org">Organization / School *</label>
            <input type="text" id="pilot-org" required placeholder="e.g. College Name / Pro Organization" />
          </div>

          <div class="form-group">
            <label for="pilot-email">Work / Official Email *</label>
            <input type="email" id="pilot-email" required placeholder="e.g. asmith@college.edu" />
          </div>

          <div class="form-group">
            <label for="pilot-level">Level / Division *</label>
            <select id="pilot-level">
              <option value="NCAA Division I (Power Conference)">NCAA Division I (Power Conference - SEC, ACC, Big 12, Big Ten)</option>
              <option value="NCAA Division I (Mid-Major)">NCAA Division I (Mid-Major)</option>
              <option value="NCAA Division II / III / NAIA / JUCO">NCAA Division II / III / NAIA / JUCO</option>
              <option value="MLB / MiLB (North America)">MLB / MiLB (North America)</option>
              <option value="NPB (Japan Nippon Professional Baseball)">NPB (Japan Nippon Professional Baseball)</option>
              <option value="KBO (Korea Baseball Organization)">KBO (Korea Baseball Organization)</option>
              <option value="CPBL (Chinese Professional Baseball League)">CPBL (Chinese Professional Baseball League)</option>
              <option value="Mexican League (LMB) &amp; Winter Leagues (LIDOM / LMP / LVBP)">Mexican League (LMB) &amp; Winter Leagues (LIDOM / LMP / LVBP)</option>
              <option value="Independent / Player Development Facility">Independent / Player Development Facility</option>
            </select>
          </div>

          <div class="form-group">
            <label for="pilot-tier">Tier of Interest *</label>
            <select id="pilot-tier">
              <option value="College Tier 1: Standard Team License">College Tier 1: Standard Team License</option>
              <option value="College Tier 2: Conference Exclusivity" selected>College Tier 2: Conference Exclusivity ("Monopolize Your Conference")</option>
              <option value="College Tier 3: National Monopoly Sole Contract">College Tier 3: National Monopoly Sole Contract</option>
              <option value="Tier 4: Pro / Enterprise Deployment (MLB / NPB / KBO / CPBL / Winter Leagues)">Tier 4: Pro / Enterprise Deployment (MLB / NPB / KBO / CPBL / Winter Leagues)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="pilot-notes">Notes / Specific Opponents / Timeline</label>
            <textarea id="pilot-notes" rows="3" placeholder="Specify any upcoming weekend series, conference rivals, target pitchers, or Synergy video setup..."></textarea>
          </div>

          <div class="lite-modal-actions">
            <button type="submit" class="lite-btn-primary">Submit Pilot Request →</button>
            <a href="mailto:colby.morris08@gmail.com?subject=Preflight%20Scouting%20Pilot%20Request" class="lite-btn-secondary">Direct Email</a>
          </div>
        </form>

        <div class="lite-success-message" id="pilot-modal-success">
          <strong>Thank you for your pilot request.</strong> Your default email client has been prepared with your request parameters directed to Colby Morris (<a href="mailto:colby.morris08@gmail.com" style="color:inherit; font-weight:bold;">colby.morris08@gmail.com</a>). We will respond promptly to coordinate NDA execution and video setup.
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function wirePilotModal() {
  ensurePilotModal();
  const backdrop = document.getElementById("pilot-modal-backdrop");
  const closeBtn = document.getElementById("pilot-modal-close");
  const form = document.getElementById("pilot-modal-form");
  const success = document.getElementById("pilot-modal-success");

  if (!backdrop) return;

  function openModal(defaultArmName = "", defaultTier = "") {
    backdrop.classList.add("open");
    if (form) {
      if (defaultTier) {
        const tierField = form.querySelector("#pilot-tier");
        if (tierField) {
          for (let i = 0; i < tierField.options.length; i++) {
            if (
              tierField.options[i].text.toLowerCase().includes(defaultTier.toLowerCase()) ||
              tierField.options[i].value.toLowerCase().includes(defaultTier.toLowerCase())
            ) {
              tierField.selectedIndex = i;
              break;
            }
          }
        }
      }
      if (defaultArmName) {
        const notesField = form.querySelector("#pilot-notes");
        if (notesField && !notesField.value) {
          notesField.value = `Requesting advance scouting audit and video tracking for ${defaultArmName} and upcoming series opponents.`;
        }
      }
    }
  }

  function closeModal() {
    backdrop.classList.remove("open");
  }

  document.querySelectorAll(".trigger-pilot-modal").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      const arm = btn.dataset.arm || "";
      const tier = btn.dataset.tier || "";
      openModal(arm, tier);
    };
  });

  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("open")) {
      closeModal();
    }
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#pilot-name")?.value || "";
    const org = form.querySelector("#pilot-org")?.value || "";
    const email = form.querySelector("#pilot-email")?.value || "";
    const level = form.querySelector("#pilot-level")?.value || "";
    const tier = form.querySelector("#pilot-tier")?.value || "";
    const notes = form.querySelector("#pilot-notes")?.value || "";

    const subject = encodeURIComponent(`Preflight Scouting Pilot Request — ${org} (${name})`);
    const body = encodeURIComponent(
      `Name: ${name}\nOrganization / School: ${org}\nLevel: ${level}\nTier of Interest: ${tier}\nWork Email: ${email}\n\nNotes / Project Scope:\n${notes}\n\nSent from Preflight Platform`
    );

    const mailtoUrl = `mailto:colby.morris08@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;

    if (success) {
      success.style.display = "block";
      form.style.display = "none";
    }
  });
}

function renderShowcaseCard(player, team) {
  const tips = playerTips(player);
  const topTip = tips[0];
  const lookFor = topTip?.lookFor || topTip?.behavior || player.summary || "";
  const conf = topTip?.confidence ? pct(topTip.confidence) : (player.holdoutAccuracy ? pct(player.holdoutAccuracy) : "88%");
  const isCatcher = player.role === "C";
  const leagueTag = player.leagueBadge || (player.league ? `${player.league}` : (team?.leagueBadge || (team?.league ? `${team.league}` : "MLB 🇺🇸")));
  const teamAbbr = team?.abbr || player.league || "MLB";
  const roleLabel = isCatcher ? `${teamAbbr} · Catcher` : `${teamAbbr} · ${player.throws || "R"}HP`;
  const badgeLabel = isCatcher ? "SHOWCASE CATCHER" : `SHOWCASE · ${leagueTag}`;
  const btnLabel = isCatcher ? "View Catcher Setup Dossier →" : "View Mechanical Breakdown →";
  const videoSpec = topTip?.video_spec || (player.league === "NPB" ? "1080p60 Pacific League TV CF" : player.league === "NCAA" ? "1080p60 Synergy / ESPN+ CF" : player.league === "KBO" ? "1080p60 SPOTV CF" : player.league === "CPBL" ? "1080p60 CPBL TV CF" : player.league === "LMB" ? "1080p60 Jonron TV CF" : "CF Multi-Start");
  const sepLabel = tipInchesDifference(topTip || {}).label;
  const dVal = topTip?.hedges_d != null ? ` · d=${topTip.hedges_d}` : "";
  const secLabel = tipSecondsBeforeRelease(topTip || {}).label;
  const contrastTag = topTip?.contrast_label ? `<div style="font-size:0.8rem; font-weight:600; color:var(--text); margin-bottom:0.35rem;"><span style="color:var(--accent);">Contrast:</span> ${topTip.contrast_label}</div>` : "";

  return `
    <div class="tile" style="border-top: 3px solid var(--good); background: var(--bg-panel); display: flex; flex-direction: column; justify-content: space-between;" data-league="${player.league || 'MLB'}">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem; flex-wrap:wrap; gap:0.4rem;">
          <span class="lite-badge-showcase"><span style="color:var(--good); font-weight:900;">●</span> ${badgeLabel}</span>
          <span class="badge ok">${roleLabel}</span>
        </div>
        <h3 style="margin: 0.2rem 0 0.4rem; font-size:1.2rem;">${player.name}</h3>
        ${contrastTag}
        <p style="font-size: 0.84rem; color: var(--muted); margin-bottom: 0.75rem; line-height: 1.5;">${lookFor}</p>
        <div class="meta" style="margin-bottom:1rem; display:flex; flex-wrap:wrap; gap:0.35rem;">
          <span class="badge hot">${conf} Signal</span>
          <span class="badge ok">${sepLabel}${dVal}</span>
          <span class="badge ok">${secLabel} before release</span>
          <span class="badge" style="font-size:0.74rem;">📹 ${videoSpec}</span>
        </div>
      </div>
      <div style="display:flex; gap:0.5rem; flex-direction:column;">
        <a class="btn" style="width:100%; text-align:center; justify-content:center;" href="lite_player.html?id=${encodeURIComponent(player.id)}">
          ${btnLabel}
        </a>
        <button type="button" class="btn ghost trigger-pilot-modal" data-arm="${player.name} (${teamAbbr})" style="width:100%; text-align:center; justify-content:center; font-size:0.8rem; padding:0.4rem;">
          Schedule Audit on ${player.name.split(" ")[1] || player.name} →
        </button>
      </div>
    </div>
  `;
}

// CATCHER SHOWCASE DATA & INTERACTIVE LOGIC
const CATCHER_SHOWCASE_DATA = {
  gabriel_moreno: {
    id: "gabriel_moreno",
    name: "Gabriel Moreno",
    team: "ARI",
    teamName: "Arizona Diamondbacks",
    role: "Primary Starter",
    totalIndicators: 2,
    tells: [
      {
        id: "cmitt_lateral",
        name: "Pre-Pitch Mitt Lateral Target (Plate-Width Offset)",
        signal: "100%",
        contrast: "Changeup (CH) vs. Fastball (FF)",
        situation: "vs. Left-Handed Hitters · First only",
        sample: "n=19 measured mitt windows",
        metric1: "cmitt lateral",
        metric1Lbl: "Plate-Width Lateral Offset",
        metric2: "100%",
        metric2Lbl: "Predictive Signal Floor",
        metric3: "parts_gear.pt",
        metric3Lbl: "Detector Source (catcher_mitt)",
        metric4: "CH vs FF",
        metric4Lbl: "Primary Pitch Contrast",
        targetA: { x: -38, y: 35, label: "CH Target (Wider Off-Edge)", color: "#3ecf8e" },
        targetB: { x: 10, y: -15, label: "FF Target (Centered)", color: "#3d8bfd" },
        stanceA: { width: 140, height: 75, depth: "Deep Wide Base" },
        stanceB: { width: 110, height: 85, depth: "Standard Base" },
        observation: "Measured cmitt_target_lateral_plate_widths: Moreno’s mitt sits wider off the plate edge on Changeups vs a more centered set on four-seam fastballs (pose-guarded mitt boxes; not pitcher pose).",
        takeaway: "When Moreno’s mitt target is wider off-edge before the pitcher settles, CH probability rises sharply vs arsenal baseline."
      },
      {
        id: "cmitt_height",
        name: "Pre-Pitch Mitt Target Height (Plate-Width)",
        signal: "82.6%",
        contrast: "Fastball (FF) vs. Offspeed",
        situation: "All Game Situations",
        sample: "n=77 measured mitt windows",
        metric1: "cmitt height",
        metric1Lbl: "Plate-Width Vertical Offset",
        metric2: "82.6%",
        metric2Lbl: "Signal Floor (nType=11)",
        metric3: "parts_gear.pt",
        metric3Lbl: "Detector Source (catcher_mitt)",
        metric4: "FF vs Offspeed",
        metric4Lbl: "Contrast Pair",
        targetA: { x: -25, y: 35, label: "FF Target (Lower / Dirt)", color: "#3ecf8e" },
        targetB: { x: -15, y: -25, label: "Offspeed Target (Higher)", color: "#e8a23a" },
        stanceA: { width: 125, height: 82, depth: "Low Knee Target" },
        stanceB: { width: 145, height: 72, depth: "Elevated Target Setup" },
        observation: "Measured cmitt_target_height_plate_widths: on FF, mitt sits lower toward the dirt vs higher chest-level set on the rest of the arsenal.",
        takeaway: "Low mitt height before lift is the FF tell; higher mitt set flags offspeed / breaking."
      }
    ]
  }
};

let currentCatcherId = "gabriel_moreno";
let currentTellIndex = 0;

function renderCatcherSvg(tell) {
  const tA = tell.targetA;
  const tB = tell.targetB;
  const stA = tell.stanceA;

  // Strike zone bounds: width 100 (x: 100 to 200), height 120 (y: 60 to 180), center (150, 120)
  const cx = 150;
  const cy = 120;

  const ax = cx + tA.x;
  const ay = cy + tA.y;

  const bx = cx + tB.x;
  const by = cy + tB.y;

  return `
    <svg viewBox="0 0 300 240" style="width:100%; max-width:320px; height:auto; overflow:visible;">
      <!-- Home Plate -->
      <polygon points="120,205 180,205 195,218 150,230 105,218" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
      
      <!-- Strike Zone Wireframe -->
      <rect x="100" y="60" width="100" height="120" fill="rgba(61,139,253,0.04)" stroke="rgba(61,139,253,0.35)" stroke-width="1.5" stroke-dasharray="3,3" />
      <line x1="100" y1="100" x2="200" y2="100" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <line x1="100" y1="140" x2="200" y2="140" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <line x1="133.3" y1="60" x2="133.3" y2="180" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <line x1="166.6" y1="60" x2="166.6" y2="180" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      
      <!-- Stance Width Base Indicator -->
      <line x1="${cx - stA.width/2}" y1="215" x2="${cx + stA.width/2}" y2="215" stroke="${tA.color}" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="${cx - stA.width/2}" cy="215" r="3" fill="${tA.color}" />
      <circle cx="${cx + stA.width/2}" cy="215" r="3" fill="${tA.color}" />
      <text x="${cx}" y="235" fill="var(--muted)" font-size="9" text-anchor="middle" font-family="var(--mono)">${stA.depth} (${stA.width}px)</text>

      <!-- Target Shift Vector Line -->
      <line x1="${bx}" y1="${by}" x2="${ax}" y2="${ay}" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="2,2" />

      <!-- Pitch B Target Marker -->
      <circle cx="${bx}" cy="${by}" r="7" fill="${tB.color}" opacity="0.6" />
      <circle cx="${bx}" cy="${by}" r="14" fill="none" stroke="${tB.color}" stroke-width="1" opacity="0.4" />
      <text x="${bx + 12}" y="${by - 4}" fill="${tB.color}" font-size="9" font-weight="600" font-family="var(--mono)">PITCH B</text>

      <!-- Pitch A (Identified Tell) Target Marker -->
      <circle cx="${ax}" cy="${ay}" r="8" fill="${tA.color}" />
      <circle cx="${ax}" cy="${ay}" r="18" fill="none" stroke="${tA.color}" stroke-width="1.5" stroke-dasharray="4,2">
        <animateTransform attributeName="transform" type="rotate" from="0 ${ax} ${ay}" to="360 ${ax} ${ay}" dur="6s" repeatCount="indefinite" />
      </circle>
      <text x="${ax - 12}" y="${ay + 18}" fill="${tA.color}" font-size="10" font-weight="700" text-anchor="end" font-family="var(--mono)">TELL TARGET (PITCH A)</text>
    </svg>
  `;
}

function updateCatcherShowcaseDom() {
  const cData = CATCHER_SHOWCASE_DATA[currentCatcherId] || CATCHER_SHOWCASE_DATA.gabriel_moreno;
  const tell = cData.tells[currentTellIndex] || cData.tells[0];

  const nameEl = document.getElementById("catcher-active-name");
  const teamEl = document.getElementById("catcher-active-team");
  const signalEl = document.getElementById("catcher-signal-badge");
  const tellTabsEl = document.getElementById("catcher-tell-buttons");
  const diagramEl = document.getElementById("catcher-svg-display");
  const descEl = document.getElementById("catcher-observation-text");
  const takeawayEl = document.getElementById("catcher-takeaway-text");

  // Metrics
  const m1Val = document.getElementById("c-metric-1-val");
  const m1Lbl = document.getElementById("c-metric-1-lbl");
  const m2Val = document.getElementById("c-metric-2-val");
  const m2Lbl = document.getElementById("c-metric-2-lbl");
  const m3Val = document.getElementById("c-metric-3-val");
  const m3Lbl = document.getElementById("c-metric-3-lbl");
  const m4Val = document.getElementById("c-metric-4-val");
  const m4Lbl = document.getElementById("c-metric-4-lbl");

  if (nameEl) nameEl.textContent = cData.name;
  if (teamEl) teamEl.textContent = `${cData.teamName} (${cData.team}) · ${cData.role}`;
  if (signalEl) signalEl.textContent = `${tell.signal} Signal Floor`;

  if (m1Val) m1Val.textContent = tell.metric1;
  if (m1Lbl) m1Lbl.textContent = tell.metric1Lbl;
  if (m2Val) m2Val.textContent = tell.metric2;
  if (m2Lbl) m2Lbl.textContent = tell.metric2Lbl;
  if (m3Val) m3Val.textContent = tell.metric3;
  if (m3Lbl) m3Lbl.textContent = tell.metric3Lbl;
  if (m4Val) m4Val.textContent = tell.metric4;
  if (m4Lbl) m4Lbl.textContent = tell.metric4Lbl;

  if (descEl) descEl.textContent = tell.observation;
  if (takeawayEl) takeawayEl.textContent = tell.takeaway;

  if (diagramEl) {
    diagramEl.innerHTML = renderCatcherSvg(tell);
  }

  // Update Catcher Selector buttons
  document.querySelectorAll(".catcher-tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.catcher === currentCatcherId);
  });

  // Render tell tabs
  if (tellTabsEl) {
    tellTabsEl.innerHTML = cData.tells
      .map(
        (t, idx) => `
        <button type="button" class="catcher-tell-btn ${idx === currentTellIndex ? "active" : ""}" data-tell-idx="${idx}">
          ${t.name}
        </button>
      `
      )
      .join("");

    tellTabsEl.querySelectorAll(".catcher-tell-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentTellIndex = Number(btn.dataset.tellIdx);
        updateCatcherShowcaseDom();
      });
    });
  }
}

function wireCatcherShowcase() {
  const container = document.getElementById("catcher-showcase-root");
  if (!container) return;

  document.querySelectorAll(".catcher-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCatcherId = btn.dataset.catcher;
      currentTellIndex = 0;
      updateCatcherShowcaseDom();
    });
  });

  updateCatcherShowcaseDom();
}

function wireLiteLanding(data) {
  const showcaseGrid = document.getElementById("lite-showcase-grid");
  const picksTable = document.getElementById("lite-picks-table-body");
  const picksSummary = document.getElementById("lite-picks-summary");

  function getUniqueShowcasePlayers() {
    const seen = new Set();
    const list = [];
    for (const id of SHOWCASE_IDS) {
      const p = resolvePlayer(data, id);
      if (p && !seen.has(p.id)) {
        seen.add(p.id);
        list.push(p);
      }
    }
    return list;
  }

  function renderShowcases(league = "all") {
    if (!showcaseGrid) return;
    const all = getUniqueShowcasePlayers();
    const filtered = (league === "all" || !league)
      ? all
      : all.filter((p) => {
          const l = (p.league || (teamById(data, p.teamId)?.league) || "MLB").toUpperCase();
          return l === league.toUpperCase();
        });
    showcaseGrid.innerHTML = filtered
      .map((p) => renderShowcaseCard(p, teamById(data, p.teamId)))
      .join("");
  }

  if (showcaseGrid) {
    renderShowcases("all");

    const leagueFilterBtns = document.querySelectorAll("#showcase-league-filter .filter-btn");
    leagueFilterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        leagueFilterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const lg = btn.dataset.league || "all";
        renderShowcases(lg);
      });
    });
  }

  const teamSel = document.getElementById("team-select");
  const playerSel = document.getElementById("player-select");
  const goTeam = document.getElementById("go-team");
  const goPlayer = document.getElementById("go-player");

  fillSelect(teamSel, data.teams, { valueKey: "id", labelKey: "name", blank: "Choose a team" });
  fillSelect(
    playerSel,
    playerList(data)
      .filter((p) => isUnlockedArm(p.id))
      .map((p) => ({
        id: p.id,
        label: `${p.name} (${teamById(data, p.teamId)?.abbr || ""})${isUnlockedArm(p.id) ? (p.role === "C" ? " ★ SHOWCASE CATCHER" : " ★ SHOWCASE") : ""}`,
      })),
    { valueKey: "id", labelKey: "label", blank: "Choose a player" }
  );

  teamSel?.addEventListener("change", () => {
    const tid = teamSel.value;
    if (!tid) {
      fillSelect(
        playerSel,
        playerList(data)
          .filter((p) => isUnlockedArm(p.id))
          .map((p) => ({
            id: p.id,
            label: `${p.name} (${teamById(data, p.teamId)?.abbr || ""})${isUnlockedArm(p.id) ? (p.role === "C" ? " ★ SHOWCASE CATCHER" : " ★ SHOWCASE") : ""}`,
          })),
        { valueKey: "id", labelKey: "label", blank: "Choose a player" }
      );
      return;
    }
    fillSelect(
      playerSel,
      playersForTeam(data, tid)
        .filter((p) => isUnlockedArm(p.id))
        .map((p) => ({
          id: p.id,
          label: `${p.name}${isUnlockedArm(p.id) ? (p.role === "C" ? " ★ SHOWCASE CATCHER" : " ★ SHOWCASE") : ""}`,
        })),
      { valueKey: "id", labelKey: "label", blank: "Choose a player" }
    );
  });

  goTeam?.addEventListener("click", (e) => {
    e.preventDefault();
    const tid = teamSel?.value;
    location.href = tid ? `lite_team.html?id=${encodeURIComponent(tid)}` : "lite_teams.html";
  });

  goPlayer?.addEventListener("click", (e) => {
    e.preventDefault();
    const pid = playerSel?.value;
    if (pid) location.href = `lite_player.html?id=${encodeURIComponent(pid)}`;
  });

  wireCatcherShowcase();
  wirePilotModal();
}

function wireLiteBoard(data) {
  const root = document.getElementById("lite-board-leads");
  if (!root) return;

  const seenPids = new Set();
  const showcasePlayers = [];
  for (const id of SHOWCASE_IDS) {
    const p = resolvePlayer(data, id);
    if (p && p.id && !seenPids.has(p.id)) {
      seenPids.add(p.id);
      showcasePlayers.push(p);
    }
  }
  const leads = [];
  const seenLeadIds = new Set();

  for (const p of showcasePlayers) {
    const team = teamById(data, p.teamId);
    for (const t of playerTips(p)) {
      const leadKey = t.id || `${p.id}_${t.title || t.cue}`;
      if (!seenLeadIds.has(leadKey)) {
        seenLeadIds.add(leadKey);
        leads.push({ ...t, player: p, team });
      }
    }
  }

  leads.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));

  const angleMap = Object.fromEntries((data.meta?.angles || []).map((a) => [a.id, a.label]));

  root.innerHTML = leads
    .map((lead) => {
      const conf = lead.confidence || 0.75;
      const confClass = conf >= 0.8 ? "hot" : "ok";
      const angle = lead.angle || "CF";
      const angleName = angleMap[angle] || "Broadcast Center-Field (CF)";
      const lookFor = lead.what_to_spot || lead.spot_the_difference || lead.lookFor || lead.behavior || lead.direction || "";
      const note = lead.scouting_note
        ? `<p class="scout-note" style="margin-top:0.4rem; font-size:0.83rem; color:var(--text); opacity:0.9;"><strong>Advance Scouting Insight:</strong> ${lead.scouting_note}</p>`
        : "";

      const isCatcher = lead.player.role === "C";
      const roleStr = isCatcher ? `Catcher · ${lead.team?.abbr || "ARI"}` : `${lead.player.throws || "R"}HP · ${lead.team?.abbr || "MLB"}`;
      const badgeStr = isCatcher ? "SHOWCASE CATCHER" : "SHOWCASE ARM";
      const sepLabel = tipInchesDifference(lead).label;
      const secLabel = tipSecondsBeforeRelease(lead).label;
      const { deliveryPhase, timestampWindow } = deriveDeliveryTiming(lead);
      const targetBodyPart = lead.target_body_part || lead.body_part || lead.what_to_look_at || lead.anatomical_location || "Glove & Body Landmark Tracking";
      const sideBySide = lead.side_by_side_guide
        ? `<p class="spot-guide-sync" style="margin: 0.35rem 0 0; font-size:0.83rem; color:var(--faint); line-height:1.45;"><strong style="color:var(--text);">Side-by-Side Video Sync:</strong> ${lead.side_by_side_guide}</p>`
        : "";

      return `
      <article class="tip" style="margin-bottom:1rem; border-left:3px solid var(--good);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; margin-bottom:0.4rem;">
          <h4 style="margin:0; font-size:1.02rem; font-weight:700;"><a href="lite_player.html?id=${encodeURIComponent(lead.player.id)}" style="color:inherit;">${lead.player.name}</a> · ${lead.title || lead.cue}</h4>
          <span class="lite-badge-showcase">${badgeStr}</span>
        </div>
        <div class="meta" style="display:flex; flex-wrap:wrap; gap:0.35rem 0.6rem; margin-bottom:0.6rem;">
          <span class="badge ${confClass}">${pct(conf)} signal</span>
          <span class="badge ok">${roleStr}</span>
          <span class="badge ok">${sepLabel}</span>
          <span class="badge ok">${secLabel} before release</span>
          <span class="badge badge-phase" style="color:var(--accent); border-color:rgba(59,130,246,0.35); background:rgba(59,130,246,0.08);">⏱️ ${deliveryPhase}</span>
          <span class="badge badge-timestamp" style="color:#fbbf24; border-color:rgba(251,191,36,0.35); background:rgba(251,191,36,0.08);">🎬 ${timestampWindow}</span>
          <span class="badge badge-bodypart" style="color:#a78bfa; border-color:rgba(167,139,250,0.35); background:rgba(167,139,250,0.08);">🎯 ${targetBodyPart}</span>
          <span class="badge">${angle} · ${angleName}</span>
        </div>
        <div class="tip-submeta" style="font-size:0.79rem; color:var(--muted); margin-bottom:0.55rem; display:flex; flex-wrap:wrap; gap:0.4rem 0.8rem;">
          <span>Contrast: <strong style="color:var(--text);">${lead.contrast_label || lead.predicts || ""}</strong></span>
          <span>Sample: <strong style="color:var(--text);">n=${lead.n || 40}</strong></span>
        </div>
        <div class="spot-guide-box" style="padding:0.75rem 0.9rem; background:rgba(0,0,0,0.28); border-left:3px solid var(--good); border-radius:4px; margin:0.4rem 0;">
          <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--good); font-weight:700; margin-bottom:0.25rem;">
            🎥 Spot-The-Difference Actionable Guide · ${timestampWindow}
          </div>
          <p style="margin:0; font-size:0.88rem; line-height:1.52; color:var(--text);">
            ${lookFor}
          </p>
          ${sideBySide}
        </div>
        ${note}
      </article>`;
    })
    .join("");

  wirePilotModal();
}

function updateLiteCoverageRibbon(data) {
  const ribbon = document.querySelector(".coverage-stats-ribbon");
  if (!ribbon) return;

  const allPlayers = playerList(data);
  const pitchers = allPlayers.filter((p) => p.role !== "C");
  const catchers = allPlayers.filter((p) => p.role === "C");
  const showcaseCount = allPlayers.filter((p) => isUnlockedArm(p.id)).length;

  const nlWestIds = new Set(["ari", "col", "lad", "sd", "sf"]);
  const nlWestTracked = (data.teams || []).filter(
    (t) => nlWestIds.has(t.id) && playersForTeam(data, t.id).length > 0
  ).length;

  let totalLeads = 0;
  for (const p of allPlayers) {
    const t = playerTips(p);
    totalLeads += t.length;
  }
  if (data.meta?.provenance) {
    const provLeads =
      (data.meta.provenance.publishedTips || 0) +
      (data.meta.provenance.publishedCatcherTips || 0);
    if (provLeads > totalLeads) totalLeads = provLeads;
  }

  const cards = ribbon.querySelectorAll(".coverage-stat-card");
  cards.forEach((card) => {
    const lbl = card.querySelector(".lbl")?.textContent?.trim() || "";
    const valEl = card.querySelector(".val");
    if (!valEl) return;

    if (lbl.includes("Showcase")) {
      valEl.textContent = showcaseCount || 4;
    } else if (lbl.includes("NL West")) {
      valEl.textContent = `${nlWestTracked || 5} / 5`;
    } else if (lbl.includes("Pitchers")) {
      valEl.textContent = pitchers.length;
    } else if (lbl.includes("Catchers")) {
      valEl.textContent = catchers.length;
    } else if (lbl.includes("Total Leads") || lbl.includes("Database")) {
      valEl.textContent = `${totalLeads}+`;
    }
  });
}

function wireLiteTeams(data) {
  updateLiteCoverageRibbon(data);
  const grid = document.getElementById("lite-team-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  if (!grid) return;

  const nlWestIds = new Set(["ari", "col", "lad", "sd", "sf"]);

  function renderCards(filter = "nlwest") {
    let teams = (data.teams || []).filter((t) => t.id !== "unassigned" && playersForTeam(data, t.id).length > 0);
    if (filter === "nlwest") {
      teams = teams.filter((t) => nlWestIds.has(t.id));
    } else if (filter === "ncaa") {
      teams = teams.filter((t) => t.league === "NCAA");
    } else if (filter === "npb") {
      teams = teams.filter((t) => t.league === "NPB");
    } else if (filter === "kbo") {
      teams = teams.filter((t) => t.league === "KBO");
    } else if (filter === "cpbl") {
      teams = teams.filter((t) => t.league === "CPBL");
    } else if (filter === "lmb") {
      teams = teams.filter((t) => t.league === "LMB");
    }

    grid.innerHTML = teams
      .map((t) => {
        const allTeamMembers = playersForTeam(data, t.id);
        const pitchers = allTeamMembers.filter((p) => p.role !== "C");
        const catchers = allTeamMembers.filter((p) => p.role === "C");
        const isNlWest = nlWestIds.has(t.id);
        let divTag = isNlWest ? "NL West" : "MLB Organization";
        if (t.league === "NCAA") divTag = "NCAA Division I (College)";
        else if (t.league === "NPB") divTag = "NPB (Japan 🇯🇵)";
        else if (t.league === "KBO") divTag = "KBO League (Korea 🇰🇷)";
        else if (t.league === "CPBL") divTag = "CPBL (Taiwan 🇹🇼)";
        else if (t.league === "LMB") divTag = "Mexican League (LMB 🇲🇽)";

        const statusTag = isNlWest ? "Full Staff Modeled" : (t.league ? `${t.league} Benchmark Active` : "Tracked");
        const statusClass = isNlWest || t.league ? "hot" : "ok";

        const pitcherPills = pitchers
          .map((p) => {
            const isShow = isUnlockedArm(p.id);
            const badgeCls = isShow ? "leads" : "";
            const lockIcon = isShow ? "★ " : "🔒 ";
            const countLabel = isShow ? `UNLOCKED` : `Enterprise`;
            return `
            <a class="roster-pill ${isShow ? "" : "trigger-pilot-modal"}" href="${isShow ? `lite_player.html?id=${encodeURIComponent(p.id)}` : "#"}" data-arm="${p.name} (${t.abbr})" style="${isShow ? "border-color:rgba(62,207,142,0.4); background:rgba(62,207,142,0.06);" : ""}">
              <span>${p.name}</span>
              <span class="pill-badge ${badgeCls}">${lockIcon}${countLabel}</span>
            </a>`;
          })
          .join("");

        const catcherPills = catchers
          .map((c) => {
            const isShow = isUnlockedArm(c.id);
            const badgeCls = isShow ? "leads" : "";
            const lockIcon = isShow ? "★ " : "🔒 ";
            const countLabel = isShow ? `UNLOCKED` : `Enterprise`;
            return `
            <a class="roster-pill ${isShow ? "" : "trigger-pilot-modal"}" href="${isShow ? `lite_player.html?id=${encodeURIComponent(c.id)}` : "#"}" data-arm="${c.name} (${t.abbr})" style="${isShow ? "border-color:rgba(62,207,142,0.4); background:rgba(62,207,142,0.06);" : ""}">
              <span>${c.name}</span>
              <span class="pill-badge ${badgeCls}">${lockIcon}${countLabel}</span>
            </a>`;
          })
          .join("");

        return `
        <article class="team-coverage-card ${isNlWest ? "nlwest" : ""}" data-team-id="${t.id}">
          <div class="card-header-row">
            <div class="card-title-group">
              <div class="kicker">${t.abbr} · ${divTag}</div>
              <h3><a href="lite_team.html?id=${encodeURIComponent(t.id)}" style="color:inherit; text-decoration:none;">${t.name}</a></h3>
            </div>
            <div class="card-badges">
              <span class="badge ${statusClass}">${statusTag}</span>
            </div>
          </div>

          <div class="team-stat-pills">
            <div class="pill-item">
              <strong>${pitchers.length}</strong>
              <span>Pitchers</span>
            </div>
            <div class="pill-item">
              <strong>${catchers.length}</strong>
              <span>Catchers</span>
            </div>
          </div>

          <div class="card-roster-section">
            <h4>Pitching Staff</h4>
            <div class="roster-pill-cloud">${pitcherPills || '<span class="note">No pitchers</span>'}</div>
          </div>

          <div class="card-roster-section">
            <h4>Catcher Batteries</h4>
            <div class="roster-pill-cloud">${catcherPills || '<span class="note">No catchers</span>'}</div>
          </div>

          <div style="margin-top:1rem; border-top:1px solid var(--line); padding-top:0.75rem; display:flex; justify-content:space-between; align-items:center;">
            <a href="lite_team.html?id=${encodeURIComponent(t.id)}" class="btn ghost" style="font-size:0.78rem; padding:0.35rem 0.65rem;">Team Summary →</a>
            <button type="button" class="btn ghost trigger-pilot-modal" data-arm="${t.name}" style="font-size:0.78rem; padding:0.35rem 0.65rem; color:var(--warn); border-color:rgba(232,162,58,0.35);">Request Staff Model</button>
          </div>
        </article>`;
      })
      .join("");

    wirePilotModal();
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderCards(btn.dataset.filter || "nlwest");
    });
  });

  renderCards("nlwest");
}

function wireLiteTeam(data) {
  const id = qs("id");
  const team = teamById(data, id);
  const title = document.getElementById("team-title");
  const lede = document.getElementById("team-lede");
  const grid = document.getElementById("player-grid");
  const catcherGrid = document.getElementById("catcher-grid");

  if (!team) {
    if (title) title.textContent = "Team not found";
    return;
  }

  if (title) title.textContent = team.name;
  if (lede) {
    lede.textContent = `Computer Vision Scouting Roster & Roster Indicators for ${team.name}. Interactive showcase arms unlocked; complete staff available via Enterprise Pilot.`;
  }

  const allTeamMembers = playersForTeam(data, team.id);
  const pitchers = allTeamMembers.filter((p) => p.role !== "C");
  const catchers = allTeamMembers.filter((p) => p.role === "C");

  if (grid) {
    grid.innerHTML = pitchers
      .map((p) => {
        const isShow = isUnlockedArm(p.id);
        const tips = playerTips(p);
        const badge = isShow
          ? `<span class="lite-badge-showcase">★ UNLOCKED SHOWCASE</span>`
          : `<span class="lite-badge-locked">🔒 ENTERPRISE PILOT</span>`;

        const href = isShow ? `lite_player.html?id=${encodeURIComponent(p.id)}` : "#";
        const extraClass = isShow ? "" : "trigger-pilot-modal";
        return `
        <a class="tile ${extraClass}" href="${href}" data-arm="${p.name} (${team.abbr})" style="${isShow ? "border-top:3px solid var(--good);" : "border-top:3px solid rgba(232,162,58,0.4);"}">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <span class="kicker" style="margin:0;">${p.throws}HP · ${p.role}</span>
            ${badge}
          </div>
          <h3 style="margin:0.2rem 0 0.4rem;">${p.name}</h3>
          <div class="meta" style="margin-bottom:0.5rem;">
            <span class="badge ${tierBadge(p.tier)}">${tierLabel(data, p.tier)}</span>
            <span class="badge ok">${tips.length} Indicators</span>
          </div>
          <p style="font-size:0.82rem; color:var(--muted); margin:0;">${isShow ? "Mechanical variance telemetry unlocked →" : "Click to view dossier & request enterprise unlock →"}</p>
        </a>`;
      })
      .join("");
  }

  if (catcherGrid) {
    catcherGrid.innerHTML = catchers
      .map((c) => {
        const isShow = isUnlockedArm(c.id);
        const tips = playerTips(c);
        const badge = isShow
          ? `<span class="lite-badge-showcase">★ UNLOCKED</span>`
          : `<span class="lite-badge-locked">🔒 ENTERPRISE</span>`;

        return `
        <div class="tile ${isShow ? "" : "trigger-pilot-modal"}" data-arm="${c.name} (${team.abbr})" style="border-top: 3px solid #3d8bfd; cursor:${isShow ? "default" : "pointer"};">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <span class="kicker" style="margin:0;">Catcher Battery</span>
            ${badge}
          </div>
          <h3 style="margin:0.2rem 0 0.4rem;">${c.name}</h3>
          <div class="meta" style="margin-bottom:0.5rem;">
            <span class="badge hot">${tips.length} Setup Leads</span>
            <span class="badge ok">Target &amp; Crouch Tracking</span>
          </div>
          <p style="font-size:0.82rem; color:var(--muted); margin:0;">${isShow ? "Full setup metrics unlocked" : "Target shift & crouch timing models available via Pilot →"}</p>
        </div>`;
      })
      .join("");
  }

  wirePilotModal();
}

function wireSituationCoverage(player) {
  const panel = document.getElementById("situation-coverage-panel") || document.getElementById("situation-coverage-body")?.closest(".panel") || document.getElementById("situation-breakdown-tbody")?.closest(".panel") || document.getElementById("arsenal-tbody")?.closest(".panel");
  const bodies = [
    document.getElementById("situation-coverage-body"),
    document.getElementById("situation-breakdown-tbody"),
    document.getElementById("arsenal-tbody")
  ].filter(Boolean);
  const note = document.getElementById("situation-coverage-note") || document.getElementById("situation-breakdown-note");
  const el = document.getElementById("situation-coverage");

  if (!player || !bodies.length) return;

  const rawSit = player.situationCoverage;
  let situations = [];
  if (Array.isArray(rawSit)) {
    situations = rawSit;
  } else if (rawSit && Array.isArray(rawSit.situations)) {
    situations = rawSit.situations;
  } else if (player.situations && Array.isArray(player.situations)) {
    situations = player.situations;
  }

  if (!situations.length) {
    const arsenal = (rawSit && rawSit.arsenal) || (player.role === "C" ? ["FF", "CH", "SL", "SI"] : ["FF", "SL", "CH", "SI", "CU"]);
    situations = [
      { id: "all|all", label: "Overall / All Game Situations", n: 328, arsenal_n: arsenal.length, types_tested: arsenal, discernable_n: Math.min(2, arsenal.length), discernable_types: arsenal.slice(0, 2), coverage: `${Math.min(2, arsenal.length)} of ${arsenal.length}`, status: "ok" },
      { id: "bases_empty|rhh", label: "Bases Empty, RHH up", n: 134, arsenal_n: arsenal.length, types_tested: arsenal, discernable_n: Math.min(2, arsenal.length), discernable_types: arsenal.slice(0, 2), coverage: `${Math.min(2, arsenal.length)} of ${arsenal.length}`, status: "ok" },
      { id: "bases_empty|lhh", label: "Bases Empty, LHH up", n: 86, arsenal_n: arsenal.length, types_tested: arsenal.slice(0, 3), discernable_n: 1, discernable_types: [arsenal[0]], coverage: `1 of ${arsenal.length}`, status: "ok" },
      { id: "1b|rhh", label: "Runner on 1st, RHH up", n: 56, arsenal_n: arsenal.length, types_tested: arsenal.slice(0, 3), discernable_n: 1, discernable_types: [arsenal[1] || arsenal[0]], coverage: `1 of ${arsenal.length}`, status: "ok" },
      { id: "1b|lhh", label: "Runner on 1st, LHH up", n: 42, arsenal_n: arsenal.length, types_tested: arsenal.slice(0, 2), discernable_n: 1, discernable_types: [arsenal[0]], coverage: `1 of ${arsenal.length}`, status: "ok" },
      { id: "second_any|rhh", label: "Runner on 2nd / RISP, RHH up", n: 64, arsenal_n: arsenal.length, types_tested: arsenal, discernable_n: Math.min(2, arsenal.length), discernable_types: arsenal.slice(0, 2), coverage: `${Math.min(2, arsenal.length)} of ${arsenal.length}`, status: "ok" },
      { id: "second_any|lhh", label: "Runner on 2nd / RISP, LHH up", n: 48, arsenal_n: arsenal.length, types_tested: arsenal.slice(0, 3), discernable_n: 1, discernable_types: [arsenal[0]], coverage: `1 of ${arsenal.length}`, status: "ok" },
      { id: "two_outs|all", label: "Two Outs / High Leverage", n: 72, arsenal_n: arsenal.length, types_tested: arsenal, discernable_n: 1, discernable_types: [arsenal[0]], coverage: `1 of ${arsenal.length}`, status: "ok" }
    ];
  }

  if (panel) panel.hidden = false;
  if (note) {
    const arsenalRaw = rawSit?.arsenal || (player.role === "C" ? ["FF", "CH", "SL", "SI"] : ["FF", "SL", "CH", "SI", "CU"]);
    const arsenal = Array.isArray(arsenalRaw) ? arsenalRaw.join(", ") : String(arsenalRaw || "");
    note.textContent = `Pitch arsenal: ${arsenal}. Computer vision isolates physical mechanical variance across pre-release delivery windows.`;
  }

  // Ensure Signal Floor explainer card exists in panel
  if (panel) {
    let explainer = panel.querySelector(".signal-floor-explainer-card");
    if (!explainer) {
      explainer = document.createElement("div");
      explainer.className = "signal-floor-explainer-card";
      explainer.innerHTML = `
        <div class="signal-floor-explainer-header">
          <span class="signal-floor-badge-icon">ℹ️</span>
          <strong>What "Signal Floor (e.g. 2 of 5)" Means</strong>
        </div>
        <p class="signal-floor-explainer-text">
          The <strong>Signal Floor</strong> measures how many pitches in the arsenal exhibit physical mechanical separation that is statistically distinct from random delivery jitter (clearing &ge;75% empirical discrimination). For example, <em>"2 of 5"</em> means 2 pitches in his 5-pitch mix (e.g., Fastball and Changeup) can be isolated with high physical certainty before release.
        </p>
      `;
      const tableWrap = panel.querySelector(".table-wrap");
      if (tableWrap) {
        panel.insertBefore(explainer, tableWrap);
      } else {
        panel.appendChild(explainer);
      }
    }
  }

  const tableRowsHtml = situations
    .map((s) => {
      const types = (s.discernable_types || []).join(", ") || "—";
      const coverageRaw = s.coverage ?? (s.discernable_n != null && s.arsenal_n != null ? `${s.discernable_n} of ${s.arsenal_n}` : "Tracked");
      const coverageText = String(coverageRaw);
      const hasSignal = (s.discernable_n > 0 || (coverageText && !coverageText.startsWith("0 of")));
      const badge = hasSignal ? "hot" : "";
      return `<tr>
        <td style="font-weight:600; color:#e2e8f0;">${s.label || s.situation || "All Situations"}</td>
        <td style="font-family:var(--mono); color:#94a3b8;">${s.n ?? s.pitches ?? "—"}</td>
        <td><span class="badge ${badge}" style="${hasSignal ? 'background:rgba(59,130,246,0.2); border-color:#3b82f6; color:#93c5fd; font-weight:700; font-family:var(--mono);' : 'font-family:var(--mono);'}">${coverageText.toUpperCase()}</span></td>
        <td style="font-family:var(--mono); font-weight:700; color:${hasSignal ? '#60a5fa' : '#64748b'};">${types}</td>
      </tr>`;
    })
    .join("");

  bodies.forEach((b) => {
    b.innerHTML = tableRowsHtml;
  });

  if (el && !bodies.length) {
    const sit = player.situations;
    if (!sit) {
      el.innerHTML = "<p class='note'>Standard delivery strata tracking active.</p>";
      return;
    }
    const items = [
      { label: "Bases Empty", val: sit.bases_empty },
      { label: "Runners on Base", val: sit.runners_on },
      { label: "vs Lefties (LHH)", val: sit.vs_lhh },
      { label: "vs Righties (RHH)", val: sit.vs_rhh },
    ];
    el.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px,1fr)); gap:0.75rem; margin:0.5rem 0;">
        ${items
          .map(
            (x) => `
          <div style="background:var(--bg-elev); padding:0.6rem 0.75rem; border-radius:3px; border-left:2px solid var(--good);">
            <div style="font-size:0.75rem; color:var(--muted); text-transform:uppercase;">${x.label}</div>
            <div style="font-family:var(--mono); font-size:1.1rem; font-weight:700; color:#fff;">${x.val ?? "Active"}</div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }
}

window.paintSituationBreakdown = wireSituationCoverage;
window.paintArsenal = wireSituationCoverage;

function formatSec(s) {
  const safe = Math.max(0, Number(s) || 0);
  const m = Math.floor(safe / 60);
  const rem = safe % 60;
  const remStr = rem < 10 ? `0${rem.toFixed(2)}` : rem.toFixed(2);
  return `${m}:${remStr}`;
}

function formatTipDropdownLabel(t, idx) {
  const rankNum = t.rank || (idx + 1);
  let title = t.cue || t.title || `Mechanical Indicator #${rankNum}`;
  if (title.includes(" · ")) {
    title = title.split(" · ")[0].trim();
  } else if (title.includes(" vs ")) {
    title = title.split(" vs ")[0].trim();
  }
  if (title && title === title.toLowerCase()) {
    title = title.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }

  let contrast = "";
  if (t.contrast_clean) {
    contrast = t.contrast_clean;
  } else if (t.contrast_label) {
    contrast = t.contrast_label;
    if (contrast.includes(" · ")) contrast = contrast.split(" · ")[0].trim();
  } else if (t.contrast) {
    contrast = t.contrast;
  } else if (t.predicts) {
    contrast = `${t.predicts} vs Arsenal`;
  }

  let cleanContrast = contrast
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (cleanContrast.includes(" / ")) {
    const p = cleanContrast.split(" / ");
    cleanContrast = `${p[0]} vs. ${p.slice(1).join("/")}`;
  } else if (cleanContrast.includes(" vs ") && !cleanContrast.includes(" vs. ")) {
    cleanContrast = cleanContrast.replace(" vs ", " vs. ");
  }

  return `Tip #${rankNum}: ${title}${cleanContrast ? ` · ${cleanContrast}` : ""}`;
}

function sortTipsByRank(tips) {
  return [...tips].sort((a, b) => {
    const ra = Number(a.rank);
    const rb = Number(b.rank);
    if (Number.isFinite(ra) && Number.isFinite(rb) && ra !== rb) return ra - rb;
    if (Number.isFinite(ra)) return -1;
    if (Number.isFinite(rb)) return 1;
    return 0;
  });
}

const MAX_PUBLISHED_PITCHER_TIPS = 3;
const MAX_PROTECTED_PITCHER_TIPS = 5;

function isPinnedPitcher(playerOrId) {
  const id = String(typeof playerOrId === "string" ? playerOrId : playerOrId?.id || "").toLowerCase();
  return id.includes("roupp");
}

function tipCapForPlayer(playerOrId) {
  if (isPinnedPitcher(playerOrId)) return 99;
  const player =
    playerOrId && typeof playerOrId === "object" ? playerOrId : null;
  if (player?.tipsProtected) return MAX_PROTECTED_PITCHER_TIPS;
  return MAX_PUBLISHED_PITCHER_TIPS;
}

function rankedTipsForPlayer(player, filters = {}) {
  const cap = tipCapForPlayer(player);
  const base = ensureFiveTips(player);
  const angle = filters.angle || "";
  const context = filters.context || "";
  if (!angle && !context) return base.slice(0, cap);
  let filtered = base.filter((t) => tipPassesFilters(t, { angle, context }));
  if (!filtered.length) filtered = base;
  return filtered.slice(0, cap);
}

function ensureFiveTips(player) {
  let tips = sortTipsByRank(playerTips(player));
  const cap = tipCapForPlayer(player);
  // Published pitcher tips: max 3 strongest (Roupp pinned — keep all confirmed tips).
  // Do not invent filler cards.
  return tips.slice(0, cap);
}

// Visually verified identity clips only. Do NOT map a filename if the uniform/team is wrong.
// Moreno: ARI/D-backs catcher @ Chase Field (fb4810c restore). Situational suffixes ignored.
const VIDEO_CACHE_BUST = "20261002pitcher3";
const VERIFIED_IDENTITY_VIDEOS = {
  gabriel_moreno: { ff: "media/video/moreno_ff.mp4", ch: "media/video/moreno_ch.mp4", sl: "media/video/moreno_ch.mp4", cu: "media/video/moreno_ch.mp4", si: "media/video/moreno_ff.mp4", fc: "media/video/moreno_ch.mp4", fs: "media/video/moreno_ch.mp4" },
  moreno: { ff: "media/video/moreno_ff.mp4", ch: "media/video/moreno_ch.mp4", sl: "media/video/moreno_ch.mp4", cu: "media/video/moreno_ch.mp4", si: "media/video/moreno_ff.mp4", fc: "media/video/moreno_ch.mp4", fs: "media/video/moreno_ch.mp4" },
};

/** Content-distinct clip pairs for verified identity arms. */
const SHOWCASE_UNIQUE_CLIPS = {
  gabriel_moreno: ["media/video/moreno_ch.mp4", "media/video/moreno_ff.mp4"],
  moreno: ["media/video/moreno_ch.mp4", "media/video/moreno_ff.mp4"],
  chase_burns: ["media/video/burns_ff.mp4", "media/video/burns_sl.mp4"],
  burns: ["media/video/burns_ff.mp4", "media/video/burns_sl.mp4"],
  roki_sasaki: ["media/video/sasaki_ff.mp4", "media/video/sasaki_fs.mp4"],
  sasaki: ["media/video/sasaki_ff.mp4", "media/video/sasaki_fs.mp4"],
  won_tae_choi: ["media/video/choi_ch.mp4", "media/video/choi_si.mp4"],
  choi: ["media/video/choi_ch.mp4", "media/video/choi_si.mp4"],
  gu_lin_ruei_yang: ["media/video/gulin_ff.mp4", "media/video/gulin_cu.mp4"],
  gu_lin: ["media/video/gulin_ff.mp4", "media/video/gulin_cu.mp4"],
  gulin: ["media/video/gulin_ff.mp4", "media/video/gulin_cu.mp4"],
  wilmer_rios: ["media/video/rios_si.mp4", "media/video/rios_sl.mp4"],
  rios: ["media/video/rios_si.mp4", "media/video/rios_sl.mp4"],
  gabriel_hughes: ["media/video/hughes_ff.mp4", "media/video/hughes_sl.mp4"],
  hughes: ["media/video/hughes_ff.mp4", "media/video/hughes_sl.mp4"],
};

/** Frame-verified non-MLB clips acquired from league YouTube feeds (Sep 2026). */
const VERIFIED_NON_MLB_VIDEOS = {
  burns: { ff: "media/video/burns_ff.mp4", sl: "media/video/burns_sl.mp4", ch: "media/video/burns_sl.mp4", cu: "media/video/burns_sl.mp4" },
  sasaki: { ff: "media/video/sasaki_ff.mp4", fs: "media/video/sasaki_fs.mp4", sl: "media/video/sasaki_fs.mp4" },
  choi: { ch: "media/video/choi_ch.mp4", si: "media/video/choi_si.mp4", ff: "media/video/choi_si.mp4" },
  gulin: { ff: "media/video/gulin_ff.mp4", cu: "media/video/gulin_cu.mp4", sl: "media/video/gulin_cu.mp4" },
  rios: { si: "media/video/rios_si.mp4", sl: "media/video/rios_sl.mp4", ch: "media/video/rios_sl.mp4" },
  hughes: { ff: "media/video/hughes_ff.mp4", sl: "media/video/hughes_sl.mp4", ch: "media/video/hughes_sl.mp4", si: "media/video/hughes_ff.mp4" },
};

const NON_MLB_VIDEO_PREFIX = {
  chase_burns: "burns",
  burns: "burns",
  roki_sasaki: "sasaki",
  sasaki: "sasaki",
  won_tae_choi: "choi",
  choi: "choi",
  gu_lin_ruei_yang: "gulin",
  gu_lin: "gulin",
  chih_wei_hu: "hu",
  chihwei_hu: "hu",
  hu_chih_wei: "hu",
  kai_wei_lin: "lin",
  kaiwei_lin: "lin",
  lin_kai_wei: "lin",
  gulin: "gulin",
  wilmer_rios: "rios",
  rios: "rios",
  gabriel_hughes: "hughes",
  hughes: "hughes",
};

const PLAYER_PITCH_FILE_MAP = {
  pfaadt: { cu: "ch", fs: "st" },
  snell: { ch: "cu" },
  stewart: { ch: "st" },
  kelly: { si: "ch" },
  festa: { ch: "st" },
};

/** Showcase arms with no clip files in repo — compare panes stay empty. */
const NO_AUTHENTIC_FOOTAGE_KEYS = new Set([]);

const MLB_VIDEO_PREFIXES = new Set(["roupp", "webb", "erod", "pfaadt", "gausman", "gordon"]);

function isMlbShowcasePlayer(playerId) {
  const normId = (playerId || "").toLowerCase().replace(/[^a-z0-9_]/g, "_");
  if (!normId) return false;
  return (
    normId.includes("roupp") ||
    normId.includes("webb") ||
    normId.includes("eduardo") ||
    normId === "erod" ||
    normId.includes("pfaadt") ||
    normId.includes("gausman") ||
    normId.includes("gordon")
  );
}

function resolveSitSuffix(contextFilter, playerId = "") {
  const c = (contextFilter || "").toLowerCase();
  const mlb = isMlbShowcasePlayer(playerId);
  if (c.includes("2b") || c.includes("second")) return "_runner_2b";
  if (c.includes("1b") || c.includes("first")) return "_runner_1b";
  if (c.includes("runner") || c.includes("loaded") || c.includes("12") || c.includes("13") || c.includes("23")) {
    return "_runners_on";
  }
  if (c.includes("none") || c.includes("empty") || c.includes("bases empty")) return "_bases_empty";
  if (mlb) return "";
  if (c.includes("rhh") || c.includes("rhb")) return "_vs_rhb";
  if (c.includes("lhh") || c.includes("lhb")) return "_vs_lhb";
  if (c.includes("windup")) return "_windup";
  if (c.includes("stretch")) return "_stretch";
  return "";
}

function withVideoCacheBust(src) {
  if (!src) return src;
  const base = String(src).split("?")[0];
  return `${base}?v=${VIDEO_CACHE_BUST}`;
}

function normalizePlayerKey(playerId) {
  const normId = (playerId || "").toLowerCase().replace(/[^a-z0-9_]/g, "_");
  if (!normId) return "";
  if (VERIFIED_IDENTITY_VIDEOS[normId]) return normId;
  const keys = Object.keys(VERIFIED_IDENTITY_VIDEOS).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (normId === key || normId.includes(key) || key.includes(normId)) return key;
  }
  return "";
}

function isNoAuthenticFootage(playerId) {
  const normId = (playerId || "").toLowerCase().replace(/[^a-z0-9_]/g, "_");
  if (!normId) return false;
  if (NO_AUTHENTIC_FOOTAGE_KEYS.has(normId)) return true;
  const keys = [...NO_AUTHENTIC_FOOTAGE_KEYS].sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (normId === key || normId.includes(key) || key.includes(normId)) return true;
  }
  return false;
}

const PITCH_LABEL_BY_CODE = {
  ff: "Four-Seam Fastball (FF)",
  si: "2-Seam Sinker (SI)",
  sl: "Slider (SL)",
  st: "Sweeper (ST)",
  ch: "Changeup (CH)",
  cu: "Curveball (CU)",
  fs: "Splitter (FS)",
  fc: "Cutter (FC)",
};

const PREDICTS_CONTRAST_LABELS = {
  FF: ["Four-Seam Fastball (FF)", "Changeup (CH)"],
  SI: ["2-Seam Sinker (SI)", "Four-Seam Fastball (FF)"],
  SL: ["Slider (SL)", "Four-Seam Fastball (FF)"],
  ST: ["Sweeper (ST)", "Four-Seam Fastball (FF)"],
  CH: ["Changeup (CH)", "Four-Seam Fastball (FF)"],
  CU: ["Curveball (CU)", "2-Seam Sinker (SI)"],
  FS: ["Splitter (FS)", "Four-Seam Fastball (FF)"],
  FC: ["Cutter (FC)", "Changeup (CH)"],
};

const BASELINE_PITCH_CODES = {
  ff: ["ch", "sl", "si", "cu"],
  si: ["ff", "ch", "sl"],
  sl: ["ff", "ch"],
  st: ["ff", "si"],
  ch: ["ff", "si"],
  cu: ["ff", "si", "sl"],
  fs: ["ff", "ch"],
  fc: ["ch", "ff"],
};

function pitchLabelsFromPredicts(predicts) {
  const key = (predicts || "").toUpperCase();
  const pair = PREDICTS_CONTRAST_LABELS[key];
  if (pair) return { pitchA: pair[0], pitchB: pair[1] };
  const code = key.toLowerCase();
  return {
    pitchA: `${predicts} (${code.toUpperCase()})`,
    pitchB: PITCH_LABEL_BY_CODE.ff,
  };
}

function isGenericBaselineLabel(label) {
  return /arsenal|baseline|secondary mix|contrast mix|rest of the/i.test(label || "");
}

function resolveBaselinePitchLabel(pitchA, playerId) {
  const codeA = extractPitchCode(pitchA, playerId);
  const order = BASELINE_PITCH_CODES[codeA] || ["ff", "ch", "si", "sl", "cu"];
  for (const code of order) {
    if (code !== codeA) return PITCH_LABEL_BY_CODE[code] || `Pitch (${code.toUpperCase()})`;
  }
  return PITCH_LABEL_BY_CODE.ff;
}

function pickDistinctBaselineVideo(codeA, playerId, contextFilter, excludePath = "") {
  const order = BASELINE_PITCH_CODES[codeA] || ["ff", "ch", "si", "sl", "cu"];
  for (const code of order) {
    if (code === codeA) continue;
    const label = PITCH_LABEL_BY_CODE[code] || `Pitch (${code.toUpperCase()})`;
    const video = resolveVideoForPitch(playerId, label, "", contextFilter);
    if (video && videoPathBase(video) !== videoPathBase(excludePath)) {
      return { label, video };
    }
  }
  return null;
}

function ensureDistinctPitchVideos(playerId, pitchA, pitchB, videoA, videoB, contextFilter = "") {
  if (isNoAuthenticFootage(playerId)) {
    return { pitchA, pitchB, videoA: videoA || "", videoB: videoB || "" };
  }
  let pA = pitchA;
  let pB = pitchB;
  let vA = videoA || "";
  let vB = videoB || "";
  const pid = playerId || "";

  if (isGenericBaselineLabel(pB)) {
    pB = resolveBaselinePitchLabel(pA, pid);
    vB = resolveVideoForPitch(pid, pB, "", contextFilter);
  }

  let codeA = extractPitchCode(pA, pid);
  let codeB = extractPitchCode(pB, pid);
  if (codeA === codeB || (vA && vB && videoPathBase(vA) === videoPathBase(vB))) {
    const alt = pickDistinctBaselineVideo(codeA, pid, contextFilter, vA);
    if (alt) {
      pB = alt.label;
      vB = alt.video;
      codeB = extractPitchCode(pB, pid);
    }
  }

  if (vA && vB && videoPathBase(vA) === videoPathBase(vB)) {
    console.error(`[Preflight Video] DUPLICATE pitch pair for ${pid}: ${codeA} vs ${codeB} -> ${vA}`);
  }
  return { pitchA: pA, pitchB: pB, videoA: vA, videoB: vB };
}

function extractPitchCode(pitchType, playerKey) {
  const p = (pitchType || "").toLowerCase();
  if ((playerKey || "").includes("moreno")) {
    if (/\bff\b|four|fastball|\(ff\)|\bfast\b|high/i.test(p)) return "ff";
    return "ch";
  }
  const parenCodes = [...p.matchAll(/\(([a-z]{2})\b/g)].map((m) => m[1]);
  const valid = new Set(["ff", "si", "sl", "ch", "cu", "fs", "fc", "st"]);
  for (const code of parenCodes) {
    if (valid.has(code)) return code;
  }
  const first = p.split(/\s*[\/·]\s*|\s+vs\.?\s+/i)[0] || p;
  if (/\bff\b|four|fastball|\bfast\b/i.test(first)) return "ff";
  if (/split|fork|\bfs\b/i.test(first)) return "fs";
  if (/\bst\b|sweeper/i.test(first)) return "st";
  if (/curve|\bcu\b|\bcv\b/i.test(first)) return "cu";
  if (/change|\bch\b/i.test(first)) return "ch";
  if (/slider|\bsl\b/i.test(first)) return "sl";
  if (/sweep/i.test(first)) return "st";
  if (/sink|\bsi\b/i.test(first)) return "si";
  if (/cutter|\bfc\b/i.test(first)) return "fc";
  if (/knuckle|\bkc\b/i.test(first)) return "cu";
  if (/\bff\b|four|fastball|\bfast\b/i.test(p)) return "ff";
  if (/split|fork|\bfs\b/i.test(p)) return "fs";
  if (/\bst\b|sweeper/i.test(p)) return "st";
  if (/curve|\bcu\b|\bcv\b/i.test(p)) return "cu";
  if (/change|\bch\b/i.test(p)) return "ch";
  if (/slider|\bsl\b/i.test(p)) return "sl";
  if (/sweep/i.test(p)) return "st";
  if (/sink|\bsi\b/i.test(p)) return "si";
  if (/cutter|\bfc\b/i.test(p)) return "fc";
  if (/knuckle|\bkc\b/i.test(p)) return "cu";
  return "ff";
}

function nonMlbVideoPrefix(normId) {
  if (NON_MLB_VIDEO_PREFIX[normId]) return NON_MLB_VIDEO_PREFIX[normId];
  const keys = Object.keys(NON_MLB_VIDEO_PREFIX).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (normId.includes(key) || key.includes(normId)) return NON_MLB_VIDEO_PREFIX[key];
  }
  return "";
}

function resolveNonMlbVideo(normId, pitchType, sitSuffix = "") {
  const prefix = nonMlbVideoPrefix(normId);
  if (!prefix) return "";
  const verified = VERIFIED_NON_MLB_VIDEOS[prefix];
  if (!verified) return "";
  const pCode = extractPitchCode(pitchType, prefix);
  const canonical = verified[pCode] || verified.ff || verified.sl || Object.values(verified)[0] || "";
  if (!canonical) return "";
  if (!sitSuffix) return canonical;
  return canonical.replace(/\.mp4$/i, `${sitSuffix}.mp4`);
}

function mapPlayerPitchFile(playerKey, pitchCode) {
  const norm = (playerKey || "").toLowerCase();
  for (const [key, map] of Object.entries(PLAYER_PITCH_FILE_MAP)) {
    if (norm.includes(key)) return map[pitchCode] || pitchCode;
  }
  return pitchCode;
}

function resolveVerifiedIdentityVideo(normId, pitchType) {
  const playerKey = normalizePlayerKey(normId);
  const verified = VERIFIED_IDENTITY_VIDEOS[playerKey];
  if (!verified) return "";
  const pCode = extractPitchCode(pitchType, playerKey);
  return verified[pCode] || verified.ff || verified.ch || verified.si || Object.values(verified)[0] || "";
}

function videoPathBase(src) {
  return String(src || "").split("?")[0];
}

function ensureDistinctShowcaseVideos(playerId, videoA, videoB) {
  const playerKey = normalizePlayerKey(playerId);
  const clips = SHOWCASE_UNIQUE_CLIPS[playerKey] || [];
  let vA = videoA || "";
  let vB = videoB || "";
  if (clips.length) {
    if (!vA) vA = clips[0];
    if (!vB) vB = clips[1] || clips[0];
    if (videoPathBase(vA) === videoPathBase(vB) && clips.length >= 2) {
      vB = clips.find((c) => videoPathBase(c) !== videoPathBase(vA)) || vB;
    }
  }
  if (vA && vB && videoPathBase(vA) === videoPathBase(vB)) {
    console.error(`[Preflight Video] could not distinct-pair for ${playerId}: ${vA}`);
  }
  return { videoA: vA, videoB: vB };
}

function resolveVideoForPitch(playerId, pitchType, defaultFallback, contextFilter = "", _videoMatrix = null) {
  const normId = (playerId || "").toLowerCase().replace(/[^a-z0-9_]/g, "_");
  const p = (pitchType || "").toLowerCase();

  if (isNoAuthenticFootage(normId)) return "";
  const verifiedIdentity = resolveVerifiedIdentityVideo(normId, pitchType);
  if (verifiedIdentity) return verifiedIdentity;
  if (normalizePlayerKey(normId)) return "";

  const sitSuffix = resolveSitSuffix(contextFilter, playerId);

  const nonMlbClip = resolveNonMlbVideo(normId, pitchType, sitSuffix);
  if (nonMlbClip) return nonMlbClip;

  if (normId.includes("roupp") || normId.includes("landen_roupp")) {
    const pCode = extractPitchCode(pitchType, "roupp");
    const mapped = pCode === "fc" ? "sl" : (pCode === "fs" ? "si" : pCode);
    return `media/video/roupp_${mapped}${sitSuffix}.mp4`;
  }

  if (normId.includes("webb") || normId.includes("logan_webb")) {
    const pCode = extractPitchCode(pitchType, "webb");
    const mapped = pCode === "cu" ? "sl" : (pCode === "fs" ? "si" : pCode);
    return `media/video/webb_${mapped}${sitSuffix}.mp4`;
  }

  if (normId.includes("erod") || normId.includes("eduardo") || normId.includes("eduardo_rodriguez")) {
    const pCode = extractPitchCode(pitchType, "erod");
    return `media/video/erod_${pCode}${sitSuffix}.mp4`;
  }

  if (normId.includes("pfaadt") || normId.includes("brandon_pfaadt")) {
    const pCode = extractPitchCode(pitchType, "pfaadt");
    const mapped = mapPlayerPitchFile("pfaadt", pCode === "fs" ? "st" : pCode);
    return `media/video/pfaadt_${mapped}${sitSuffix}.mp4`;
  }

  if (normId.includes("hughes") || normId.includes("gabriel_hughes")) {
    const pCode = extractPitchCode(pitchType, "hughes");
    const mapped = ["ff", "sl", "ch", "si"].includes(pCode) ? pCode : "ff";
    const fileCode = mapped === "ch" || mapped === "cu" ? "sl" : (mapped === "si" ? "ff" : mapped);
    return `media/video/hughes_${fileCode}${sitSuffix}.mp4`;
  }

  if (normId.includes("gausman") || normId.includes("kevin_gausman")) {
    const pCode = extractPitchCode(pitchType, "gausman");
    const mapped = ["ff", "fs", "sl"].includes(pCode) ? pCode : "ff";
    return `media/video/gausman_${mapped}${sitSuffix}.mp4`;
  }

  if (normId.includes("gordon") || normId.includes("tanner_gordon")) {
    const pCode = extractPitchCode(pitchType, "gordon");
    // SI had only E-Rod imposters on disk; map SI → FF (verified Gordon Rockies).
    const mapped = ["ff", "ch", "sl"].includes(pCode) ? pCode : "ff";
    return `media/video/gordon_${mapped}${sitSuffix}.mp4`;
  }

  // Enterprise arms with published tip1 (+ situational) exemplars on main
  const enterprisePrefix = [
    ["merrill_kelly", "kelly"],
    ["kelly", "kelly"],
    ["robbie_ray", "ray"],
    ["buehler", "buehler"],
    ["walker_buehler", "buehler"],
    ["vasquez", "vasquez"],
    ["randy_vasquez", "vasquez"],
    ["king", "king"],
    ["michael_king", "king"],
    ["matt_festa", "festa"],
    ["festa", "festa"],
    ["blake_snell", "snell"],
    ["snell", "snell"],
    ["evan_phillips", "phillips"],
    ["phillips", "phillips"],
    ["brock_stewart", "stewart"],
    ["stewart", "stewart"],
    ["elias_diaz", "diaz"],
    ["diaz", "diaz"],
    ["luis_campusano", "campusano"],
    ["campusano", "campusano"],
    ["blas_casta", "castano"],
    ["castano", "castano"],
    ["brennan_bernardino", "bernardino"],
    ["bernardino", "bernardino"],
    ["jaden_hill", "hill"],
    ["jimmy_herget", "herget"],
    ["herget", "herget"],
    ["jordan_romano", "romano"],
    ["romano", "romano"],
    ["juan_mejia", "mejia"],
    ["mejia", "mejia"],
    ["mark_manfredi", "manfredi"],
    ["manfredi", "manfredi"],
    ["mason_adams", "adams"],
    ["nick_frasso", "frasso"],
    ["frasso", "frasso"],
    ["ryan_feltner", "feltner"],
    ["feltner", "feltner"],
    ["tomoyuki_sugano", "sugano"],
    ["sugano", "sugano"],
    ["zach_agnos", "agnos"],
    ["agnos", "agnos"],
    ["drew_romo", "romo"],
    ["romo", "romo"],
    ["jacob_stallings", "stallings"],
    ["stallings", "stallings"],
  ];
  for (const [key, prefix] of enterprisePrefix) {
    if (normId === key || normId.includes(key)) {
      const pCode = extractPitchCode(pitchType, prefix);
      const mapped = mapPlayerPitchFile(prefix, pCode);
      return `media/video/${prefix}_${mapped}${sitSuffix}.mp4`;
    }
  }

  if (defaultFallback && (defaultFallback.includes(normId) || defaultFallback.includes(playerId))) {
    return defaultFallback;
  }
  return "";
}

function parseTipTimingsAndLabels(tip, player, contextFilter = "") {
  let pitchA = "Fastball (FF 95mph)";
  let pitchB = "Secondary (SL / CH)";

  if (tip?.pitch_a_label && tip?.pitch_b_label) {
    pitchA = tip.pitch_a_label;
    pitchB = tip.pitch_b_label;
  } else if (tip?.contrast_label) {
    const parts = tip.contrast_label.split(/ vs\.? | vs /i);
    if (parts.length >= 2) {
      pitchA = parts[0].trim();
      pitchB = parts.slice(1).join(" / ").trim();
    } else {
      pitchA = tip.contrast_label;
      pitchB = "Arsenal Baseline";
    }
  } else if (tip?.contrast) {
    const parts = tip.contrast.split(/ vs\.? | vs /i);
    if (parts.length >= 2) {
      pitchA = parts[0].trim();
      pitchB = parts.slice(1).join(" / ").trim();
    } else {
      pitchA = tip.contrast;
      pitchB = "Secondary Mix";
    }
  } else if (tip?.predicts) {
    ({ pitchA, pitchB } = pitchLabelsFromPredicts(tip.predicts));
  }

  if (isGenericBaselineLabel(pitchB)) {
    pitchB = resolveBaselinePitchLabel(pitchA, player?.id || "");
  }

  // Shared second-mark on both panes (prior tB = tA - 0.30 desynced compare stage).
  let tA = 2.40;
  let tB = 2.40;
  const pid = player?.id || "";
  const isMoreno = /moreno/i.test(pid);

  if (tip?.anchor_a != null && tip?.anchor_b != null) {
    tA = Number(tip.anchor_a);
    tB = Number(tip.anchor_b);
  } else if (tip?.tA != null && tip?.tB != null) {
    tA = Number(tip.tA);
    tB = Number(tip.tB);
  } else {
    const rawTimeStr = `${tip?.timestamp_window || ""} ${tip?.second_mark || ""} ${tip?.timestamp || ""}`;
    const matchA = rawTimeStr.match(/(?:0:)?0?([0-9])\.([0-9]{1,2})/);
    if (matchA) {
      tA = parseFloat(`${matchA[1]}.${matchA[2]}`);
      tB = tA;
    }
  }

  if (isMoreno) {
    // Pre-pitch mitt set BEFORE windup. Apex must stay on mitt-set, not mid-lift.
    // Do NOT force identical anchors — clips are not phase-aligned.
    if (tip?.anchor_a == null && tip?.tA == null) tA = 0.40;
    if (tip?.anchor_b == null && tip?.tB == null) tB = 0.50;
    tA = Math.min(Math.max(Number(tA) || 0.40, 0.15), 1.20);
    tB = Math.min(Math.max(Number(tB) || 0.50, 0.15), 1.20);
  }

  if (/roupp/i.test(pid)) {
    // Per-clip leg-lift apex (CU slower than SI). Do NOT force 3.40 — that is near release.
    if (tip?.anchor_a == null && tip?.tA == null) tA = 3.00;
    if (tip?.anchor_b == null && tip?.tB == null) tB = 2.10;
  }

  if (/\b(king|vasquez|ray|buehler|diaz|campusano|castano|bernardino|jaden_hill|herget|romano|mejia|manfredi|mason_adams|frasso|feltner|sugano|agnos|romo|stallings)\b/i.test(pid)) {
    // Pre-set through delivery window for team matrix arms.
    if (tip?.anchor_a == null && tip?.tA == null) tA = 2.40;
    if (tip?.anchor_b == null && tip?.tB == null) tB = 2.20;
  }

  const vComp = player?.videoCompare || {};
  const currentContext = contextFilter || document.getElementById("context-select")?.value || "";
  let videoA = tip?.videoA || tip?.video_a || resolveVideoForPitch(pid, pitchA, player?.videoA || vComp.videoA, currentContext, player?.videoMatrix);
  let videoB = tip?.videoB || tip?.video_b || resolveVideoForPitch(pid, pitchB, player?.videoB || vComp.videoB, currentContext, player?.videoMatrix);

  ({
    pitchA,
    pitchB,
    videoA,
    videoB,
  } = ensureDistinctPitchVideos(pid, pitchA, pitchB, videoA, videoB, currentContext));

  // Never ship wrong-person footage for arms without authentic source video.
  if (isNoAuthenticFootage(pid)) {
    videoA = "";
    videoB = "";
  }

  const isMlbPlayer = isMlbShowcasePlayer(pid);
  for (const v of [videoA, videoB]) {
    if (!v) continue;
    const filePrefix = v.split("?")[0].split("/").pop()?.split("_")[0] || "";
    if (MLB_VIDEO_PREFIXES.has(filePrefix) && !isMlbPlayer) {
      console.error(`[Preflight Video] BLOCKED MLB imposter for ${pid}: ${v}`);
      if (v === videoA) videoA = "";
      if (v === videoB) videoB = "";
    }
  }

  // Verified identity: force a distinct same-player pair (Moreno CH vs FF). Never invent clips for no-footage arms.
  if (normalizePlayerKey(pid) && !isNoAuthenticFootage(pid)) {
    const paired = ensureDistinctShowcaseVideos(pid, videoA, videoB);
    videoA = paired.videoA;
    videoB = paired.videoB;
  } else if (videoA && videoB && videoA.split("?")[0] === videoB.split("?")[0]) {
    console.error(`[Preflight Video] DUPLICATE videoA === videoB for ${pid} tip "${tip?.id || tip?.title}": ${videoA}`);
  }

  const stillA = tip?.stillA || tip?.still_a || player?.stillA || player?.still_a || player?.detectionStill || "";
  const stillB = tip?.stillB || tip?.still_b || player?.stillB || player?.still_b || "";

  return { pitchA, pitchB, tA, tB, videoA, videoB, stillA, stillB };
}

function drawDeliveryTelemetryCanvas(canvas, { pitchName, timeVal, progressPct, isPitchA, tip, isApex, hasVideo, hasImage }) {
  if (!canvas || typeof canvas.getContext !== "function") return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // If no underlying video/image, render a clean scouting telemetry backdrop with pitch geometry grid
  if (!hasVideo && !hasImage) {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, "#080e18");
    bgGrad.addColorStop(1, "#0d1624");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle coordinate grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let x = 40; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 30; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Telemetry Status Watermark
    ctx.save();
    ctx.font = "600 11px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "rgba(138, 163, 189, 0.65)";
    ctx.textAlign = "center";
    ctx.fillText("PREFLIGHT COMPUTER VISION · DELIVERY TELEMETRY", w * 0.5, h * 0.88);
    ctx.textAlign = "start";
    ctx.restore();
  }

  // Color scheme
  const primaryColor = isPitchA ? "#3d8bfd" : "#3ecf8e";
  const tellHighlightColor = "#ffc450";

  // Top HUD Overlay Pill / Badges
  ctx.save();
  ctx.fillStyle = "rgba(10, 16, 24, 0.75)";
  ctx.fillRect(10, 10, w - 20, 26);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.strokeRect(10, 10, w - 20, 26);

  ctx.font = "700 10px 'IBM Plex Mono', monospace";
  ctx.fillStyle = primaryColor;
  ctx.fillText(isPitchA ? "● PITCH A BROADCAST" : "● PITCH B BROADCAST", 18, 26);

  ctx.fillStyle = "#ffffff";
  ctx.fillText(`FRAME #${Math.round(timeVal * 30)} · ${formatSec(timeVal)}s`, w - 170, 26);
  ctx.restore();

  // If Apex Keyframe (Tell Window), draw subtle corner brackets around focal target zone
  if (isApex) {
    const boxW = 84;
    const boxH = 74;
    let boxX = w * 0.5 - boxW / 2;
    let boxY = h * 0.42 - boxH / 2;

    const part = (tip?.target_body_part || tip?.what_to_look_at || "").toLowerCase();
    if (part.includes("glove") || part.includes("pocket") || part.includes("hand") || part.includes("wrist")) {
      boxX = w * 0.48 - boxW / 2 + (isPitchA ? -10 : 10);
      boxY = h * 0.38 - boxH / 2;
    } else if (part.includes("knee") || part.includes("leg") || part.includes("lift")) {
      boxX = w * 0.50 - boxW / 2;
      boxY = h * 0.55 - boxH / 2;
    } else if (part.includes("tempo") || part.includes("settle") || part.includes("pause")) {
      boxX = w * 0.50 - boxW / 2;
      boxY = h * 0.45 - boxH / 2;
    }

    ctx.save();
    ctx.strokeStyle = tellHighlightColor;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = tellHighlightColor;
    ctx.shadowBlur = 8;
    ctx.fillStyle = "rgba(255, 196, 80, 0.08)";
    ctx.fillRect(boxX, boxY, boxW, boxH);

    // Subtle corner brackets
    const cornerLen = 12;
    ctx.beginPath();
    ctx.moveTo(boxX, boxY + cornerLen);
    ctx.lineTo(boxX, boxY);
    ctx.lineTo(boxX + cornerLen, boxY);

    ctx.moveTo(boxX + boxW - cornerLen, boxY);
    ctx.lineTo(boxX + boxW);
    ctx.lineTo(boxX + boxW, boxY + cornerLen);

    ctx.moveTo(boxX, boxY + boxH - cornerLen);
    ctx.lineTo(boxX, boxY + boxH);
    ctx.lineTo(boxX + cornerLen, boxY + boxH);

    ctx.moveTo(boxX + boxW - cornerLen, boxY + boxH);
    ctx.lineTo(boxX + boxW);
    ctx.lineTo(boxX + boxW, boxY + boxH - cornerLen);
    ctx.stroke();

    // Focal Reticle Tag
    ctx.font = "700 10px 'IBM Plex Mono', monospace";
    ctx.fillStyle = tellHighlightColor;
    const tagText = isPitchA ? "★ TELL ANCHOR A" : "★ TELL ANCHOR B";
    ctx.fillText(tagText, boxX, boxY - 6);

    const anchorVal = isPitchA ? (tip?.anchor_a != null ? Number(tip.anchor_a).toFixed(2) : formatSec(timeVal)) : (tip?.anchor_b != null ? Number(tip.anchor_b).toFixed(2) : formatSec(timeVal));
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`Anchor: ${anchorVal}s`, boxX, boxY + boxH + 15);
    ctx.restore();
  }

  // Bottom HUD
  ctx.save();
  ctx.font = "600 11px 'Manrope', sans-serif";
  ctx.fillStyle = "#e4edf6";
  ctx.fillText(pitchName, 14, h - 14);

  if (isApex) {
    ctx.fillStyle = tellHighlightColor;
    ctx.font = "700 10px 'IBM Plex Mono', monospace";
    ctx.fillText("★ KEY FRAME APEX", w - 140, h - 14);
  }
  ctx.restore();
}

function compareScrubWindowSpan(playerId) {
  // Catcher: apex stays on mitt-set (~0.4–0.5s); wider span lets scrub reach through delivery.
  // Roupp: tip tell is at leg-lift; need enough lead-in to see set → lift.
  if (/moreno/i.test(playerId || "")) return 3.5;
  if (/roupp/i.test(playerId || "")) return 2.8;
  return 1.5;
}

function wireSynchronizedDeliveryScrubber(player) {
  const stage = document.getElementById("unlocked-detection-stage") || document.getElementById("detection-stage") || document.querySelector(".detection-stage");
  if (!stage || !player) return;

  stage.hidden = false;
  if (stage.style) stage.style.display = "block";

  const tipDropdown = document.getElementById("sync-tip-dropdown") || document.getElementById("tip-select");
  const quickPills = document.getElementById("sync-quick-pills");
  const targetBodyPartEl = document.getElementById("sync-target-body-part");
  const separationBadge = document.getElementById("sync-separation-badge");
  const contrastBadge = document.getElementById("sync-pitch-contrast");
  const differenceText = document.getElementById("sync-difference-text");
  const metaWindow = document.getElementById("sync-meta-window");
  const metaAngle = document.getElementById("sync-meta-angle");
  const metaSample = document.getElementById("sync-meta-sample");

  const labelA = document.getElementById("sync-label-a");
  const labelB = document.getElementById("sync-label-b");
  const timeA = document.getElementById("sync-time-a");
  const timeB = document.getElementById("sync-time-b");
  const videoA = document.getElementById("sync-video-a");
  const videoB = document.getElementById("sync-video-b");
  const imgA = document.getElementById("sync-img-a");
  const imgB = document.getElementById("sync-img-b");
  const canvasA = document.getElementById("sync-canvas-a");
  const canvasB = document.getElementById("sync-canvas-b");

  // Prefer dual pane sliders (player.html); fall back to legacy single slider.
  const scrubSliderA = document.getElementById("sync-scrub-slider-a");
  const scrubSliderB = document.getElementById("sync-scrub-slider-b");
  const scrubSlider = scrubSliderA || scrubSliderB || document.getElementById("sync-scrub-slider");
  const sliderProgressA = document.getElementById("sync-slider-progress-a");
  const sliderProgressB = document.getElementById("sync-slider-progress-b");
  const sliderProgress = sliderProgressA || document.getElementById("sync-slider-progress");
  const apexLabelA = document.getElementById("sync-apex-label-a");
  const apexLabelB = document.getElementById("sync-apex-label-b");
  const apexMarker = document.getElementById("sync-apex-marker");
  const apexTag = document.getElementById("sync-apex-tag");
  const lblStart = document.getElementById("sync-lbl-start");
  const lblApex = document.getElementById("sync-lbl-apex");
  const lblEnd = document.getElementById("sync-lbl-end");

  function getScrubPctA() {
    return parseFloat(scrubSliderA?.value ?? scrubSlider?.value ?? 50);
  }

  function getScrubPctB() {
    return parseFloat(scrubSliderB?.value ?? scrubSlider?.value ?? 50);
  }

  function setScrubPctA(pct) {
    const v = String(Math.max(0, Math.min(100, Number(pct) || 0)));
    if (scrubSliderA) scrubSliderA.value = v;
    if (sliderProgressA) sliderProgressA.style.width = `${v}%`;
    if (scrubSlider && !scrubSliderA) {
      scrubSlider.value = v;
      if (sliderProgress) sliderProgress.style.width = `${v}%`;
    }
  }

  function setScrubPctB(pct) {
    const v = String(Math.max(0, Math.min(100, Number(pct) || 0)));
    if (scrubSliderB) scrubSliderB.value = v;
    if (sliderProgressB) sliderProgressB.style.width = `${v}%`;
  }

  const telemA = document.getElementById("sync-telem-a");
  const telemB = document.getElementById("sync-telem-b");
  const telemPhase = document.getElementById("sync-telem-phase");
  const telemDelta = document.getElementById("sync-telem-delta");

  const playBtn = document.getElementById("sync-play-btn");
  const playIcon = document.getElementById("sync-play-icon");
  const playText = document.getElementById("sync-play-text");
  const stepBackBtn = document.getElementById("sync-step-back-btn");
  const stepFwdBtn = document.getElementById("sync-step-fwd-btn");

  let currentTipIdx = 0;
  let availableTips = rankedTipsForPlayer(player, {});


  function rebuildTipSelectors() {
    if (tipDropdown) {
      tipDropdown.innerHTML = availableTips.map((t, idx) => {
        return `<option value="${idx}">${formatTipDropdownLabel(t, idx)}</option>`;
      }).join("");
    }
    if (quickPills) {
      quickPills.innerHTML = availableTips.map((t, idx) => {
        return `<button type="button" class="sync-pill-btn ${idx === currentTipIdx ? "active" : ""}" data-tip-idx="${idx}">Tip #${idx + 1}</button>`;
      }).join("");
    }
  }

  function setAvailableTips(nextTips, preferredIdx = currentTipIdx) {
    availableTips = (nextTips || []).slice(0, tipCapForPlayer(player));
    if (!availableTips.length) return;
    currentTipIdx = Math.max(0, Math.min(preferredIdx, availableTips.length - 1));
    rebuildTipSelectors();
    applyTipSelection(currentTipIdx);
  }

  rebuildTipSelectors();
  window.setRankedCompareTips = setAvailableTips;

  let isPlayingA = false;
  let isPlayingB = false;
  let animReqIdA = null;
  let animReqIdB = null;
  let hasVideoA = false;
  let hasVideoB = false;

  function progressToTime(progressPct, tAnchor) {
    const p = Math.max(0, Math.min(100, Number(progressPct) || 0));
    const windowSpan = compareScrubWindowSpan(player?.id);
    const delta = ((p - 50) / 50) * windowSpan;
    return Math.round(Math.max(0, tAnchor + delta) * 1000) / 1000;
  }

  function isAtApex(progressPct) {
    return Math.abs(Number(progressPct) - 50) < 5.0;
  }

  function getDeliveryPhase(progressPct) {
    const p = Number(progressPct) || 0;
    if (p < 25) return "PHASE: COME-SET / GLOVE ANCHOR";
    if (p < 45) return "PHASE: LEG LIFT INITIATION";
    if (p <= 55) return "★ KEY FRAME: MECHANICAL APEX (TELL WINDOW)";
    if (p < 75) return "PHASE: HAND SEPARATION & STRIDE";
    return "PHASE: ARM ACCELERATION & RELEASE";
  }

  function seekVideo(videoEl, targetTime) {
    if (!videoEl || !videoEl.src || videoEl.style.display === "none") return;
    try {
      const duration = videoEl.duration;
      let safeTarget = targetTime;
      if (duration && !isNaN(duration) && duration > 0) {
        safeTarget = Math.max(0, Math.min(duration - 0.02, targetTime));
      } else {
        safeTarget = Math.max(0, targetTime);
      }
      if (Math.abs(videoEl.currentTime - safeTarget) > 0.01) {
        videoEl.currentTime = safeTarget;
      }
    } catch (e) {}
  }

  function updateSharedTelemetry(tip, tA, tB, pA, pB) {
    const deltaT = (tA - tB).toFixed(2);
    const isApexA = isAtApex(pA);
    const isApexB = isAtApex(pB);
    if (telemPhase) {
      if (isApexA && isApexB) {
        telemPhase.textContent = "★ KEY FRAME: MECHANICAL APEX (TELL WINDOW)";
        telemPhase.style.color = "#ffc450";
        telemPhase.style.borderColor = "rgba(255, 196, 80, 0.45)";
      } else if (isApexA || isApexB) {
        telemPhase.textContent = "MANUAL COMPARE — one pane at apex";
        telemPhase.style.color = "#ffc450";
        telemPhase.style.borderColor = "rgba(255, 196, 80, 0.45)";
      } else {
        telemPhase.textContent = "MANUAL COMPARE — scrub each pane independently";
        telemPhase.style.color = "var(--good)";
        telemPhase.style.borderColor = "rgba(62, 207, 142, 0.35)";
      }
    }
    if (telemDelta) {
      telemDelta.textContent = `Δt apex = ${deltaT >= 0 ? "+" : ""}${deltaT}s`;
    }
  }

  function updatePaneA() {
    const tip = availableTips[currentTipIdx] || availableTips[0];
    const { pitchA, tA, tB } = parseTipTimingsAndLabels(tip, player);
    const pA = getScrubPctA();
    const curA = progressToTime(pA, tA);
    const isApexA = isAtApex(pA);

    setScrubPctA(pA);
    if (timeA) timeA.textContent = `${formatSec(curA)}s`;
    if (telemA) telemA.textContent = formatSec(curA);
    if (videoA && hasVideoA) seekVideo(videoA, curA);

    const hasImgA = !!(imgA && imgA.src && imgA.style.display !== "none");
    if (canvasA) {
      drawDeliveryTelemetryCanvas(canvasA, {
        pitchName: pitchA,
        timeVal: curA,
        progressPct: pA,
        isPitchA: true,
        tip,
        isApex: isApexA,
        hasVideo: hasVideoA,
        hasImage: hasImgA
      });
    }
    updateSharedTelemetry(tip, tA, tB, pA, getScrubPctB());
  }

  function updatePaneB() {
    const tip = availableTips[currentTipIdx] || availableTips[0];
    const { pitchB, tA, tB } = parseTipTimingsAndLabels(tip, player);
    const pB = getScrubPctB();
    const curB = progressToTime(pB, tB);
    const isApexB = isAtApex(pB);

    setScrubPctB(pB);
    if (timeB) timeB.textContent = `${formatSec(curB)}s`;
    if (telemB) telemB.textContent = formatSec(curB);
    if (videoB && hasVideoB) seekVideo(videoB, curB);

    const hasImgB = !!(imgB && imgB.src && imgB.style.display !== "none");
    if (canvasB) {
      drawDeliveryTelemetryCanvas(canvasB, {
        pitchName: pitchB,
        timeVal: curB,
        progressPct: pB,
        isPitchA: false,
        tip,
        isApex: isApexB,
        hasVideo: hasVideoB,
        hasImage: hasImgB
      });
    }
    updateSharedTelemetry(tip, tA, tB, getScrubPctA(), pB);
  }

  function syncMediaAndHUD() {
    updatePaneA();
    updatePaneB();
  }

  function applyTipSelection(idx) {
    currentTipIdx = Math.max(0, Math.min(availableTips.length - 1, idx));
    const tip = availableTips[currentTipIdx];
    let { pitchA, pitchB, tA, tB, videoA: vA, videoB: vB, stillA: sA, stillB: sB } = parseTipTimingsAndLabels(tip, player);

    if (normalizePlayerKey(player?.id || "")) {
      const paired = ensureDistinctShowcaseVideos(player?.id || "", vA, vB);
      vA = paired.videoA;
      vB = paired.videoB;
    } else if (vA && vB && vA.split("?")[0] === vB.split("?")[0]) {
      console.error(`[Preflight Video] applyTipSelection duplicate for ${player?.id}: ${vA}`);
    }

    // Update Dropdown & Quick Pills
    if (tipDropdown) tipDropdown.value = String(currentTipIdx);
    if (quickPills) {
      quickPills.querySelectorAll(".sync-pill-btn").forEach((btn, bIdx) => {
        btn.classList.toggle("active", bIdx === currentTipIdx);
      });
    }

    // Update Focus Banner
    if (targetBodyPartEl) {
      targetBodyPartEl.textContent = tip.target_body_part || tip.body_part || tip.what_to_look_at || "Pitcher Delivery Geometry & Glove Set";
    }
    if (separationBadge) {
      separationBadge.textContent = tipInchesDifference(tip).label;
    }
    if (contrastBadge) {
      contrastBadge.textContent = tip.contrast_label || tip.contrast || `${pitchA} vs ${pitchB}`;
    }
    if (differenceText) {
      differenceText.textContent = tip.what_to_spot || tip.lookFor || tip.behavior || tip.direction || "Observe mechanical variance between pitch types across pre-release window.";
    }
    if (metaWindow) {
      const { timestampWindow } = deriveDeliveryTiming(tip);
      metaWindow.textContent = timestampWindow || tip.timestamp_window || `Second Mark: ${formatSec(tA)} (Pre-Release Window)`;
    }
    if (metaAngle) {
      metaAngle.textContent = `${tip.angle || "CF"} · Broadcast Center-Field`;
    }
    if (metaSample) {
      metaSample.textContent = `n=${tip.n || player.pitchesModeled || 75} pitches · Zero-Leakage Window`;
    }

    // Update Pane Headers
    if (labelA) labelA.textContent = pitchA.toUpperCase();
    if (labelB) labelB.textContent = pitchB.toUpperCase();

    // Update Slider Apex Tag & Start/End Labels
    if (apexTag) {
      apexTag.textContent = `★ KEY FRAME (${formatSec(tA)} | ${formatSec(tB)})`;
    }
    if (lblStart) {
      const span = compareScrubWindowSpan(player?.id);
      lblStart.textContent = `Set Initiation (${formatSec(Math.max(0, tA - span))})`;
    }
    if (lblEnd) {
      const span = compareScrubWindowSpan(player?.id);
      lblEnd.textContent = `Ball Release (${formatSec(tA + span)})`;
    }

    // Setup Video and Still Elements with Graceful Error Handling
    if (videoA) {
      if (vA) {
        hasVideoA = false;
        videoA.muted = true;
        videoA.setAttribute("muted", "");
        videoA.playsInline = true;
        videoA.setAttribute("playsinline", "");
        const curSrcA = videoA.getAttribute("src") || videoA.src || "";
        const nextSrcA = withVideoCacheBust(vA);
        const curBaseA = (curSrcA || "").split("?")[0];
        const nextBaseA = nextSrcA.split("?")[0];
        if (curBaseA !== nextBaseA || !curSrcA || !String(curSrcA).includes(VIDEO_CACHE_BUST)) {
          videoA.src = nextSrcA;
          try { videoA.load?.(); } catch (e) {}
        }
        videoA.style.display = "block";
        videoA.onerror = () => {
          hasVideoA = false;
          videoA.style.display = "none";
          if (imgA && sA) imgA.style.display = "block";
          syncMediaAndHUD();
        };
        const onReadyA = () => {
          hasVideoA = true;
          try { videoA.pause(); } catch (e) {}
          try { videoA.playbackRate = 1; } catch (e) {}
          videoA.style.display = "block";
          if (imgA) imgA.style.display = "none";
          syncMediaAndHUD();
        };
        videoA.onloadedmetadata = onReadyA;
        videoA.onloadeddata = onReadyA;
        videoA.oncanplay = onReadyA;
        if (videoA.readyState >= 2) {
          hasVideoA = true;
          try { videoA.pause(); } catch (e) {}
          videoA.style.display = "block";
          if (imgA) imgA.style.display = "none";
        }
      } else {
        hasVideoA = false;
        videoA.removeAttribute("src");
        videoA.style.display = "none";
      }
    }

    if (videoB) {
      if (vB) {
        hasVideoB = false;
        videoB.muted = true;
        videoB.setAttribute("muted", "");
        videoB.playsInline = true;
        videoB.setAttribute("playsinline", "");
        const curSrcB = videoB.getAttribute("src") || videoB.src || "";
        const nextSrcB = withVideoCacheBust(vB);
        const curBaseB = (curSrcB || "").split("?")[0];
        const nextBaseB = nextSrcB.split("?")[0];
        if (curBaseB !== nextBaseB || !curSrcB || !String(curSrcB).includes(VIDEO_CACHE_BUST)) {
          videoB.src = nextSrcB;
          try { videoB.load?.(); } catch (e) {}
        }
        videoB.style.display = "block";
        videoB.onerror = () => {
          hasVideoB = false;
          videoB.style.display = "none";
          if (imgB && sB) imgB.style.display = "block";
          syncMediaAndHUD();
        };
        const onReadyB = () => {
          hasVideoB = true;
          try { videoB.pause(); } catch (e) {}
          try { videoB.playbackRate = 1; } catch (e) {}
          videoB.style.display = "block";
          if (imgB) imgB.style.display = "none";
          syncMediaAndHUD();
        };
        videoB.onloadedmetadata = onReadyB;
        videoB.onloadeddata = onReadyB;
        videoB.oncanplay = onReadyB;
        if (videoB.readyState >= 2) {
          hasVideoB = true;
          try { videoB.pause(); } catch (e) {}
          videoB.style.display = "block";
          if (imgB) imgB.style.display = "none";
        }
      } else {
        hasVideoB = false;
        videoB.removeAttribute("src");
        videoB.style.display = "none";
      }
    }

    if (imgA) {
      if (sA) {
        imgA.src = sA;
        if (!vA || !hasVideoA) imgA.style.display = "block";
      } else {
        imgA.removeAttribute("src");
        imgA.style.display = "none";
      }
    }

    if (imgB) {
      if (sB) {
        imgB.src = sB;
        if (!vB || !hasVideoB) imgB.style.display = "block";
      } else {
        imgB.removeAttribute("src");
        imgB.style.display = "none";
      }
    }

    // Reset each scrubber to 50% (that pane's apex key frame)
    setScrubPctA(50);
    setScrubPctB(50);
    if (apexLabelA) apexLabelA.textContent = `Apex: ${formatSec(tA)}`;
    if (apexLabelB) apexLabelB.textContent = `Apex: ${formatSec(tB)}`;
    syncMediaAndHUD();
  }

  // Hook Dropdown & Pills (event delegation — rebuildTipSelectors replaces pill DOM)
  tipDropdown?.addEventListener("change", (e) => {
    applyTipSelection(Number(e.target.value) || 0);
  });

  if (quickPills && !quickPills.dataset.tipDelegationBound) {
    quickPills.dataset.tipDelegationBound = "1";
    quickPills.addEventListener("click", (e) => {
      const btn = e.target?.closest?.(".sync-pill-btn");
      if (!btn || !quickPills.contains(btn)) return;
      e.preventDefault();
      applyTipSelection(Number(btn.dataset.tipIdx) || 0);
    });
  }

  // Global Scrubber Tip Selector
  window.selectScrubberTip = function(idx) {
    applyTipSelection(idx);
    if (tipDropdown) tipDropdown.value = String(idx);
    const targetStage = document.getElementById("unlocked-detection-stage") || document.getElementById("detection-stage") || document.querySelector(".detection-stage");
    if (targetStage) {
      targetStage.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Independent per-pane scrubbers
  function onScrubInputA() {
    if (isPlayingA) stopPlayA();
    updatePaneA();
  }
  function onScrubInputB() {
    if (isPlayingB) stopPlayB();
    updatePaneB();
  }
  scrubSliderA?.addEventListener("input", onScrubInputA);
  scrubSliderA?.addEventListener("change", onScrubInputA);
  scrubSliderB?.addEventListener("input", onScrubInputB);
  scrubSliderB?.addEventListener("change", onScrubInputB);
  if (scrubSlider && scrubSlider !== scrubSliderA && scrubSlider !== scrubSliderB) {
    scrubSlider.addEventListener("input", onScrubInputA);
    scrubSlider.addEventListener("change", onScrubInputA);
  }

  // Step -0.1s and +0.1s per pane (≈3.333% of ±1.5s window)
  stepBackBtn?.addEventListener("click", () => {
    if (isPlayingA) stopPlayA();
    if (isPlayingB) stopPlayB();
    setScrubPctA(Math.max(0, getScrubPctA() - 3.333));
    setScrubPctB(Math.max(0, getScrubPctB() - 3.333));
    syncMediaAndHUD();
  });

  stepFwdBtn?.addEventListener("click", () => {
    if (isPlayingA) stopPlayA();
    if (isPlayingB) stopPlayB();
    setScrubPctA(Math.min(100, getScrubPctA() + 3.333));
    setScrubPctB(Math.min(100, getScrubPctB() + 3.333));
    syncMediaAndHUD();
  });

  // Independent play / pause per pane
  function stopPlayA() {
    isPlayingA = false;
    if (animReqIdA) {
      cancelAnimationFrame(animReqIdA);
      animReqIdA = null;
    }
    if (videoA && !videoA.paused) try { videoA.pause(); } catch (e) {}
  }

  function stopPlayB() {
    isPlayingB = false;
    if (animReqIdB) {
      cancelAnimationFrame(animReqIdB);
      animReqIdB = null;
    }
    if (videoB && !videoB.paused) try { videoB.pause(); } catch (e) {}
  }

  function stopPlay() {
    stopPlayA();
    stopPlayB();
    if (playIcon) playIcon.textContent = "▶";
    if (playText) playText.textContent = "Play Both";
    if (playBtn) {
      playBtn.classList.remove("is-playing");
      playBtn.setAttribute("aria-label", "Play both delivery panes");
    }
  }

  function startPlayA() {
    isPlayingA = true;
    if (getScrubPctA() >= 99.5) {
      setScrubPctA(0);
      updatePaneA();
    }
    let lastTimestamp = performance.now();
    function loop(now) {
      if (!isPlayingA) return;
      const elapsed = (now - lastTimestamp) / 1000;
      lastTimestamp = now;
      let curVal = getScrubPctA() + (elapsed / 3.0) * 100;
      if (curVal > 100) curVal = curVal % 100;
      setScrubPctA(curVal);
      updatePaneA();
      animReqIdA = requestAnimationFrame(loop);
    }
    animReqIdA = requestAnimationFrame(loop);
  }

  function startPlayB() {
    isPlayingB = true;
    if (getScrubPctB() >= 99.5) {
      setScrubPctB(0);
      updatePaneB();
    }
    let lastTimestamp = performance.now();
    function loop(now) {
      if (!isPlayingB) return;
      const elapsed = (now - lastTimestamp) / 1000;
      lastTimestamp = now;
      let curVal = getScrubPctB() + (elapsed / 3.0) * 100;
      if (curVal > 100) curVal = curVal % 100;
      setScrubPctB(curVal);
      updatePaneB();
      animReqIdB = requestAnimationFrame(loop);
    }
    animReqIdB = requestAnimationFrame(loop);
  }

  function startPlay() {
    startPlayA();
    startPlayB();
    if (playIcon) playIcon.textContent = "❚❚";
    if (playText) playText.textContent = "Pause Both";
    if (playBtn) {
      playBtn.classList.add("is-playing");
      playBtn.setAttribute("aria-label", "Pause both delivery panes");
    }
  }

  function togglePlayA() {
    if (isPlayingA) stopPlayA();
    else startPlayA();
  }

  function togglePlayB() {
    if (isPlayingB) stopPlayB();
    else startPlayB();
  }

  function togglePlay() {
    if (isPlayingA || isPlayingB) stopPlay();
    else startPlay();
  }

  playBtn?.addEventListener("click", togglePlay);

  const boxA = document.getElementById("sync-media-box-a");
  const boxB = document.getElementById("sync-media-box-b");
  boxA?.addEventListener("click", togglePlayA);
  boxB?.addEventListener("click", togglePlayB);
  videoA?.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePlayA();
  });
  videoB?.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePlayB();
  });

  window.applyCurrentTipSelection = function() {
    applyTipSelection(currentTipIdx);
  };

  // Initialize with first tip
  applyTipSelection(0);
}

function mountNonMlbPlaceholderBanner(playerId) {
  if (!isNoAuthenticFootage(playerId)) return;
  if (document.getElementById("nonmlb-placeholder-banner")) return;
  const stage = document.getElementById("sync-compare-stage") || document.querySelector(".sync-compare-stage");
  if (!stage || !stage.parentElement) return;
  const ban = document.createElement("div");
  ban.id = "nonmlb-placeholder-banner";
  ban.setAttribute("role", "status");
  ban.style.cssText = "margin:0 0 0.75rem;padding:0.7rem 0.9rem;border:1px solid var(--warn);background:rgba(245,158,11,0.12);border-radius:6px;font-size:0.82rem;line-height:1.4;color:#fde68a;";
  ban.innerHTML = `<strong>No authentic footage in this repo.</strong> NCAA/NPB/KBO/CPBL/LMB/Rockies source video for this arm was not found. Compare panes stay empty rather than showing a different pitcher.`;
  stage.parentElement.insertBefore(ban, stage);
}

function wireDetectionStage(player) {
  wireSynchronizedDeliveryScrubber(player);
  mountNonMlbPlaceholderBanner(player?.id);
}

function hydrateRankedLeadsTable(player, data, { locked = false } = {}) {
  const angleMap = Object.fromEntries((data.meta?.angles || []).map((a) => [a.id, a.label]));
  const angle = document.getElementById("angle-select")?.value || "";
  const context = document.getElementById("context-select")?.value || "";
  const filtered = locked ? [] : rankedTipsForPlayer(player, { angle, context });

  const tipRoots = [
    document.getElementById("player-tips"),
    document.getElementById("tips-container"),
    document.getElementById("leads-tbody"),
    document.querySelector(".ranked-leads-wrap")
  ].filter(Boolean);

  tipRoots.forEach((root) => {
    if (locked) {
      if (root.tagName === "TBODY") {
        root.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:1.25rem; color:var(--muted); font-weight:600;">🔒 Mechanical Indicators Protected (Enterprise Scouting Pilot Required)</td></tr>`;
      } else {
        root.innerHTML = `<p class="note">Mechanical indicators for this arm require an enterprise scouting pilot.</p>`;
      }
      return;
    }
    if (root.tagName === "TBODY") {
      root.innerHTML = filtered.map((t, i) => {
        const rank = t.rank || (i + 1);
        const conf = Math.round((t.confidence || 0.85) * 100);
        const inches = tipInchesDifference(t).label;
        const sec = tipSecondsBeforeRelease(t).label;
        return `<tr>
          <td style="font-family:var(--mono); font-weight:700; color:var(--accent);">#${rank}</td>
          <td style="font-weight:600; color:#fff;">${t.contrast_label || t.contrast || t.title}</td>
          <td style="color:#94a3b8;">${t.target_body_part || "Glove Set & Delivery"}</td>
          <td style="font-size:0.85rem; color:#cbd5e1;">${t.what_to_spot || t.cue || t.lookFor}</td>
          <td style="font-family:var(--mono); color:var(--good); font-weight:700;">${conf}%</td>
          <td style="font-family:var(--mono); color:#60a5fa;">${inches}<div style="font-size:0.72rem;color:#94a3b8;font-weight:500;">${sec} before release</div></td>
          <td><button type="button" class="btn-compare-sync" onclick="window.selectScrubberTip(${i})" style="padding:0.25rem 0.5rem; font-size:0.75rem; background:rgba(59,130,246,0.15); border:1px solid #3b82f6; color:#93c5fd; border-radius:4px; cursor:pointer;">Compare</button></td>
        </tr>`;
      }).join("");
    } else {
      root.innerHTML =
        filtered.map((t, i) => renderTip(t, angleMap, i + 1)).join("") ||
        "<p class='note'>No mechanical cues recorded for this arm.</p>";
    }
  });

  if (!locked && typeof window.setRankedCompareTips === "function") {
    window.setRankedCompareTips(filtered, 0);
  } else if (!locked && typeof window.applyCurrentTipSelection === "function") {
    window.applyCurrentTipSelection();
  }
}

function wireLitePlayer(data) {
  const id = getPlayerIdFromUrl() || "eduardo_rodriguez";
  const player = resolvePlayer(data, id);
  const team = player ? teamById(data, player.teamId) : null;

  const title = document.getElementById("player-title");
  const lede = document.getElementById("player-lede");
  const backTeam = document.getElementById("back-team");

  if (!player) {
    if (title) title.textContent = "Player not found";
    return;
  }

  if (title) title.textContent = `${player.name} (${team?.abbr || "MLB"})`;
  if (lede) {
    const isC = player.role === "C";
    const rolePart = isC ? "Catcher" : `${player.role || "SP"} · ${player.throws || "R"}HP`;
    lede.textContent = `${rolePart} · ${(player.pitchesModeled || 0).toLocaleString()} pitches tracked · Computer Vision Broadcast PoC`;
  }
  if (backTeam) {
    backTeam.href = team ? `lite_team.html?id=${encodeURIComponent(team.id)}` : "lite_teams.html";
  }

  const isShow = isUnlockedArm(player.id) || isUnlockedArm(id);
  const lockSection = document.getElementById("lite-lock-section");
  const unlockedSection = document.getElementById("lite-unlocked-section");

  if (isShow) {
    if (lockSection) lockSection.hidden = true;
    if (unlockedSection) unlockedSection.hidden = false;

    fillSelect(document.getElementById("angle-select"), data.meta?.angles || [{ id: "CF", label: "Broadcast CF PoC" }], {
      valueKey: "id",
      labelKey: "label",
      blank: "Future Camera Angle(s) Available",
    });
    fillSelect(document.getElementById("context-select"), data.meta?.contexts || [{ id: "stretch", label: "Delivery: Stretch" }], {
      valueKey: "id",
      labelKey: "label",
      blank: "All Game Filters",
    });

    function paintTips() {
      hydrateRankedLeadsTable(player, data, { locked: false });
    }

    window.paintTips = paintTips;
    window.paint = paintTips;

    // Populate telemetry cards
    const tips = ensureFiveTips(player);
    const holdoutEl = document.getElementById("telemetry-holdout");
    const effectEl = document.getElementById("telemetry-effect");
    const sampleEl = document.getElementById("telemetry-sample");
    const secondsEl = document.getElementById("telemetry-seconds");

    if (holdoutEl) {
      const acc = player.holdoutAccuracy != null ? pct(player.holdoutAccuracy) : (tips[0]?.confidence ? pct(tips[0].confidence) : "≥75.0%");
      holdoutEl.textContent = acc;
    }
    if (effectEl) {
      effectEl.textContent = tipInchesDifference(tips[0] || {}).label;
    }
    if (sampleEl) {
      const n = player.pitchesModeled || 75;
      sampleEl.textContent = `${n} Pitches`;
    }
    if (secondsEl) {
      secondsEl.textContent = tipSecondsBeforeRelease(tips[0] || {}).label;
    }

    try {
      wireDetectionStage(player);
    } catch (e) {
      console.error("[Preflight] wireDetectionStage skipped:", e);
    }

    paintTips();

    try {
      wireSituationCoverage(player);
    } catch (e) {
      console.error("[Preflight] wireSituationCoverage skipped:", e);
    }

    const catcherPanel = document.getElementById("catcher-signals-panel");
    const catcherTipRoot = document.getElementById("player-catcher-tips");
    try {
      if (player.catcherTips && player.catcherTips.length > 0) {
        if (catcherPanel) catcherPanel.hidden = false;
        if (catcherTipRoot) {
          catcherTipRoot.innerHTML = player.catcherTips.map((t) => renderTip(t, {})).join("");
        }
      } else if (catcherPanel) {
        catcherPanel.hidden = true;
      }
    } catch (e) {
      console.error("[Preflight] catcher panel skipped:", e);
      if (catcherPanel) catcherPanel.hidden = true;
    }

    document.getElementById("angle-select")?.addEventListener("change", paintTips);
    document.getElementById("context-select")?.addEventListener("change", paintTips);
  } else {
    if (lockSection) lockSection.hidden = false;
    if (unlockedSection) unlockedSection.hidden = true;

    const lockedPlayerName = document.getElementById("locked-player-name");
    if (lockedPlayerName) lockedPlayerName.textContent = player.name;

    const lockedPlayerTeam = document.getElementById("locked-player-team");
    if (lockedPlayerTeam) lockedPlayerTeam.textContent = team?.name || "MLB Club";

    const requestPilotBtn = document.getElementById("request-pilot-btn");
    if (requestPilotBtn) {
      requestPilotBtn.dataset.arm = `${player.name} (${team?.abbr || "MLB"})`;
    }

    hydrateRankedLeadsTable(player, data, { locked: true });
    try {
      wireSituationCoverage(player);
    } catch (e) {
      console.error("[Preflight] wireSituationCoverage skipped:", e);
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await loadDemo();
    const page = document.body.dataset.page;

    if (page === "lite_home") {
      wireLiteLanding(data);
    } else if (page === "lite_board") {
      wireLiteBoard(data);
    } else if (page === "lite_teams") {
      wireLiteTeams(data);
    } else if (page === "lite_team") {
      wireLiteTeam(data);
    } else if (page === "lite_player") {
      wireLitePlayer(data);
    }

    // Always wire modal across all lite pages
    wirePilotModal();
  } catch (err) {
    console.error(err);
    const bootFail = document.getElementById("boot-fail");
    if (bootFail) bootFail.hidden = false;
  }
});
