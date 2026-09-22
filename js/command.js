(function () {
  "use strict";

  var DATA_URL = "data/yamamoto_2026_command.json";
  var SAVANT_VIDEO = "https://baseballsavant.mlb.com/sporty-videos?playId=";

  var MARKER_COLORS = {
    whiff: "#ef4444",
    hit: "#22c55e",
    out: "#3b82f6",
    foul: "#f59e0b",
    ball: "#3b82f6",
    called_strike: "#ef4444",
    hbp: "#3b82f6",
    other: "#94a3b8",
  };

  var zone = {};
  var X_MIN = -36,
    X_MAX = 36,
    Z_MIN = -12,
    Z_MAX = 54;
  var ZONE_HALF = 8.5,
    ZONE_BOT = 18,
    ZONE_TOP = 42,
    PLATE_TIP_Z = -8.5;
  var BOX_INNER = 14.5,
    BOX_OUTER = 50;

  var CENTER = { x: 0, z: (18 + 42) / 2 };

  var state = {
    pitches: [],
    mode: "selection",
    outings: {},
    types: {},
    // Pitcher-view inches: +x = pitcher's right (3B / LHB), +z = up.
    // Glove sits at avg target; ball at target + mean miss = avg plate loc.
    lastAvgTarget: { x: CENTER.x, z: CENTER.z },
    lastAvgMiss: { x: 0, z: 0 },
    hitRegions: [],
    selectedId: null,
  };

  var canvas = document.getElementById("chart");
  var wrap = document.getElementById("chart-wrap");
  var gloveEl = document.getElementById("glove");
  var ballEl = document.getElementById("ball");
  var detailEl = document.getElementById("pitch-detail");
  var videoModal = document.getElementById("video-modal");
  var videoBody = document.getElementById("video-modal-body");

  function mean(arr) {
    if (!arr.length) return null;
    var s = 0;
    for (var i = 0; i < arr.length; i++) s += arr[i];
    return s / arr.length;
  }

  function median(arr) {
    if (!arr.length) return null;
    var a = arr.slice().sort(function (x, y) {
      return x - y;
    });
    var m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }

  function hypot(dx, dz) {
    return Math.sqrt(dx * dx + dz * dz);
  }

  function chartSize() {
    var rect = wrap.getBoundingClientRect();
    return { w: rect.width, h: rect.height };
  }

  function plotMetrics(sz) {
    var xSpan = X_MAX - X_MIN;
    var zSpan = Z_MAX - Z_MIN;
    var scale = Math.min(sz.w / xSpan, sz.h / zSpan);
    var plotW = xSpan * scale;
    var plotH = zSpan * scale;
    return {
      scale: scale,
      ox: (sz.w - plotW) / 2,
      oy: (sz.h - plotH) / 2,
    };
  }

  function inchesToPx(xIn, zIn) {
    var sz = chartSize();
    var m = plotMetrics(sz);
    return {
      x: m.ox + (xIn - X_MIN) * m.scale,
      y: m.oy + (Z_MAX - zIn) * m.scale,
    };
  }

  function drawFieldGuide(ctx) {
    var toPx = inchesToPx;
    var gL = toPx(X_MIN, 0);
    var gR = toPx(X_MAX, 0);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(gL.x, gL.y);
    ctx.lineTo(gR.x, gR.y);
    ctx.stroke();

    function drawBox(x0, x1, label) {
      var a = toPx(x0, 2);
      var b = toPx(x1, PLATE_TIP_Z);
      ctx.fillStyle = "rgba(148, 163, 184, 0.08)";
      ctx.strokeStyle = "rgba(226, 232, 240, 0.45)";
      ctx.setLineDash([5, 4]);
      ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
      ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(226, 232, 240, 0.55)";
      ctx.font = "11px Manrope, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, (a.x + b.x) / 2, (a.y + b.y) / 2);
    }
    // Pitcher view: screen-left (−x) = your left = 1B = RHB; +x = LHB.
    drawBox(-Math.min(BOX_OUTER, X_MAX - 0.5), -BOX_INNER, "RHB");
    drawBox(BOX_INNER, Math.min(BOX_OUTER, X_MAX - 0.5), "LHB");

    var frontL = toPx(-ZONE_HALF, 0);
    var frontR = toPx(ZONE_HALF, 0);
    var midL = toPx(-ZONE_HALF, PLATE_TIP_Z * 0.45);
    var midR = toPx(ZONE_HALF, PLATE_TIP_Z * 0.45);
    var tip = toPx(0, PLATE_TIP_Z);
    ctx.fillStyle = "rgba(226, 232, 240, 0.16)";
    ctx.strokeStyle = "rgba(248, 250, 252, 0.85)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(frontL.x, frontL.y);
    ctx.lineTo(frontR.x, frontR.y);
    ctx.lineTo(midR.x, midR.y);
    ctx.lineTo(tip.x, tip.y);
    ctx.lineTo(midL.x, midL.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    var tl = toPx(-ZONE_HALF, ZONE_TOP);
    var br = toPx(ZONE_HALF, ZONE_BOT);
    ctx.fillStyle = "rgba(148, 163, 184, 0.16)";
    ctx.strokeStyle = "rgba(147, 197, 253, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.fillRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    ctx.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
  }

  function selectedPitches() {
    if (state.mode === "all") {
      return state.pitches.slice();
    }
    var anyOuting = Object.keys(state.outings).some(function (k) {
      return state.outings[k];
    });
    var anyType = Object.keys(state.types).some(function (k) {
      return state.types[k];
    });
    return state.pitches.filter(function (p) {
      if (anyOuting && !state.outings[p.outing]) return false;
      if (anyType && !state.types[p.pitch_type]) return false;
      return true;
    });
  }

  function aggregate(pitches) {
    var tx = [],
      tz = [],
      lx = [],
      lz = [],
      mx = [],
      mz = [],
      miss = [];
    pitches.forEach(function (p) {
      var txi = Number(p.target_x_in);
      var tzi = Number(p.target_z_in);
      var lxi = Number(p.loc_x_in);
      var lzi = Number(p.loc_z_in);
      if (!isFinite(txi) || !isFinite(tzi) || !isFinite(lxi) || !isFinite(lzi)) return;
      tx.push(txi);
      tz.push(tzi);
      lx.push(lxi);
      lz.push(lzi);
      // Signed miss in pitcher-view inches: loc − target (left = −x, high = +z).
      mx.push(lxi - txi);
      mz.push(lzi - tzi);
      miss.push(
        p.miss_in != null && isFinite(Number(p.miss_in))
          ? Number(p.miss_in)
          : hypot(lxi - txi, lzi - tzi)
      );
    });
    var atx = mean(tx),
      atz = mean(tz),
      alx = mean(lx),
      alz = mean(lz),
      amx = mean(mx),
      amz = mean(mz);
    var avgTarget = atx == null ? null : { x: atx, z: atz };
    // Ball = avg plate location = avg(target) + avg(miss vector). Prefer
    // target + mean miss so the mitt is clearly the origin of the offset.
    var avgMissVec =
      amx == null ? null : { x: amx, z: amz };
    var avgLoc =
      avgTarget && avgMissVec
        ? { x: avgTarget.x + avgMissVec.x, z: avgTarget.z + avgMissVec.z }
        : alx == null
          ? null
          : { x: alx, z: alz };
    return {
      n: pitches.length,
      avgTarget: avgTarget,
      avgLoc: avgLoc,
      avgMissVec: avgMissVec,
      avgMiss: mean(miss),
      medMiss: median(miss),
    };
  }

  function resolveAverages(agg) {
    var muted = false;
    var target = agg.avgTarget;
    var missVec = agg.avgMissVec;
    var loc = agg.avgLoc;
    if (target && missVec && loc) {
      state.lastAvgTarget = { x: target.x, z: target.z };
      state.lastAvgMiss = { x: missVec.x, z: missVec.z };
    } else {
      muted = true;
      target = state.lastAvgTarget || CENTER;
      missVec = state.lastAvgMiss || { x: 0, z: 0 };
      loc = { x: target.x + missVec.x, z: target.z + missVec.z };
    }
    return { target: target, loc: loc, missVec: missVec, muted: muted };
  }

  function markerColor(p) {
    return MARKER_COLORS[p.marker_class] || MARKER_COLORS.other;
  }

  function drawX(ctx, x, y, color, selected) {
    var s = selected ? 6.5 : 5;
    ctx.strokeStyle = color;
    ctx.lineWidth = selected ? 2.4 : 1.8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - s, y - s);
    ctx.lineTo(x + s, y + s);
    ctx.moveTo(x + s, y - s);
    ctx.lineTo(x - s, y + s);
    ctx.stroke();
  }

  function drawDot(ctx, x, y, color, selected) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, selected ? 4.2 : 3.2, 0, Math.PI * 2);
    ctx.fill();
    if (selected) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
  }

  function drawChart(pitches, avg) {
    var ctx = canvas.getContext("2d");
    var dpr = window.devicePixelRatio || 1;
    var sz = chartSize();
    canvas.width = Math.max(1, Math.round(sz.w * dpr));
    canvas.height = Math.max(1, Math.round(sz.h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, sz.w, sz.h);
    ctx.fillStyle = "#0b1020";
    ctx.fillRect(0, 0, sz.w, sz.h);

    var m = plotMetrics(sz);
    ctx.strokeStyle = "rgba(59,158,255,0.10)";
    ctx.lineWidth = 1;
    for (var xi = Math.ceil(X_MIN / 4) * 4; xi <= X_MAX; xi += 4) {
      var gx = inchesToPx(xi, Z_MIN).x;
      ctx.beginPath();
      ctx.moveTo(gx, m.oy);
      ctx.lineTo(gx, m.oy + (Z_MAX - Z_MIN) * m.scale);
      ctx.stroke();
    }
    for (var zi = Math.ceil(Z_MIN / 4) * 4; zi <= Z_MAX; zi += 4) {
      var gz = inchesToPx(X_MIN, zi).y;
      ctx.beginPath();
      ctx.moveTo(m.ox, gz);
      ctx.lineTo(m.ox + (X_MAX - X_MIN) * m.scale, gz);
      ctx.stroke();
    }

    drawFieldGuide(ctx);

    state.hitRegions = [];
    pitches.forEach(function (p) {
      var pt = inchesToPx(p.loc_x_in, p.loc_z_in);
      var color = markerColor(p);
      var selected = state.selectedId != null && String(p.id) === String(state.selectedId);
      if (p.marker === "x") {
        drawX(ctx, pt.x, pt.y, color, selected);
      } else {
        drawDot(ctx, pt.x, pt.y, color, selected);
      }
      state.hitRegions.push({
        id: p.id,
        x: pt.x,
        y: pt.y,
        r: p.marker === "x" ? 9 : 7,
      });
    });

    // Glove at avg target (origin); ball at target + mean miss (= avg loc).
    var ig = inchesToPx(avg.target.x, avg.target.z);
    var ab = inchesToPx(avg.loc.x, avg.loc.z);
    ctx.strokeStyle = avg.muted ? "rgba(62, 207, 106, 0.25)" : "rgba(62, 207, 106, 0.75)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(ig.x, ig.y);
    ctx.lineTo(ab.x, ab.y);
    ctx.stroke();
    ctx.setLineDash([]);

    gloveEl.style.left = ig.x + "px";
    gloveEl.style.top = ig.y + "px";
    gloveEl.style.display = "block";
    gloveEl.classList.toggle("is-muted", !!avg.muted);

    ballEl.style.left = ab.x + "px";
    ballEl.style.top = ab.y + "px";
    ballEl.style.display = "block";
    ballEl.classList.toggle("is-muted", !!avg.muted);
  }

  function fmtSignedIn(v) {
    if (v == null || isNaN(v)) return "—";
    return (v >= 0 ? "+" : "") + v.toFixed(1) + "″";
  }

  function fmtMissVec(v) {
    if (!v) return "—";
    // Pitcher view: −x = left (1B), +x = right (3B), +z = high.
    var h =
      Math.abs(v.x) < 0.05
        ? "0.0″ H"
        : fmtSignedIn(v.x).replace("″", "") + "″ " + (v.x < 0 ? "left" : "right");
    var vert =
      Math.abs(v.z) < 0.05
        ? "0.0″ V"
        : fmtSignedIn(v.z).replace("″", "") + "″ " + (v.z >= 0 ? "high" : "low");
    return h + " · " + vert;
  }

  function fmtIn(v) {
    return v == null || isNaN(v) ? "—" : v.toFixed(1) + "″";
  }

  function fmtXZ(p) {
    if (!p) return "—";
    return p.x.toFixed(1) + " / " + p.z.toFixed(1);
  }

  function fmtCount(p) {
    if (p.balls == null || p.strikes == null) return "—";
    return p.balls + "–" + p.strikes;
  }

  function fmtMovement(p) {
    if (p.hb_in == null && p.ivb_in == null) return "—";
    var hb = p.hb_in == null ? "—" : (p.hb_in >= 0 ? "+" : "") + p.hb_in.toFixed(1) + "″ HB";
    var ivb = p.ivb_in == null ? "—" : (p.ivb_in >= 0 ? "+" : "") + p.ivb_in.toFixed(1) + "″ IVB";
    return hb + " · " + ivb;
  }

  function videoUrlFor(p) {
    if (p.video_url) return p.video_url;
    if (p.play_id) return SAVANT_VIDEO + encodeURIComponent(p.play_id);
    return null;
  }

  function findPitch(id) {
    for (var i = 0; i < state.pitches.length; i++) {
      if (String(state.pitches[i].id) === String(id)) return state.pitches[i];
    }
    return null;
  }

  function renderPitchDetail(p) {
    if (!p) {
      detailEl.innerHTML = '<p class="pitch-detail-empty">No pitch selected.</p>';
      return;
    }
    var url = videoUrlFor(p);
    var rows = [
      ["Type", p.pitch_label || p.pitch_type || "—"],
      ["Result", p.pitch_result || p.description || "—"],
      ["Count", fmtCount(p)],
      ["Velo", p.velo != null ? p.velo.toFixed(1) + " mph" : "—"],
      ["Movement", fmtMovement(p)],
      ["Miss", fmtIn(p.miss_in)],
      ["Outing", p.outing || "—"],
      ["Venue", p.venue || "—"],
    ];
    detailEl.innerHTML =
      '<div class="pitch-detail-grid">' +
      rows
        .map(function (row) {
          return (
            '<div class="metric"><span>' +
            row[0] +
            "</span><strong>" +
            row[1] +
            "</strong></div>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="pitch-detail-actions">' +
      (url
        ? '<button type="button" class="btn btn-primary" id="watch-video">Watch video</button>' +
          '<a class="btn btn-ghost" href="' +
          url +
          '" target="_blank" rel="noopener">Open Savant</a>'
        : '<button type="button" class="btn btn-primary" disabled>No play_id / video</button>') +
      '<button type="button" class="btn btn-ghost" id="clear-pitch">Clear</button>' +
      "</div>";

    var watch = document.getElementById("watch-video");
    if (watch && url) {
      watch.addEventListener("click", function () {
        openVideoModal(p, url);
      });
    }
    var clear = document.getElementById("clear-pitch");
    if (clear) {
      clear.addEventListener("click", function () {
        state.selectedId = null;
        renderPitchDetail(null);
        refresh();
      });
    }
  }

  function openVideoModal(p, url) {
    videoBody.innerHTML =
      "<p><strong>" +
      (p.pitch_label || p.pitch_type || "Pitch") +
      "</strong> · " +
      (p.pitch_result || p.description || "") +
      (p.velo != null ? " · " + p.velo.toFixed(1) + " mph" : "") +
      "</p>" +
      '<p>Savant clips open in a new tab (embed blocked on many hosts).</p>' +
      '<p><a class="btn btn-primary" href="' +
      url +
      '" target="_blank" rel="noopener">Open video on Baseball Savant</a></p>' +
      (p.play_id
        ? '<p class="muted" style="margin-top:0.75rem;font-size:0.75rem;font-family:var(--mono)">play_id · ' +
          p.play_id +
          "</p>"
        : '<p class="muted">No play_id available for this pitch.</p>');
    videoModal.hidden = false;
  }

  function closeVideoModal() {
    videoModal.hidden = true;
    videoBody.innerHTML = "";
  }

  function groupBy(pitches, key) {
    var map = {};
    pitches.forEach(function (p) {
      var k = p[key];
      if (!map[k]) map[k] = [];
      map[k].push(p);
    });
    return map;
  }

  function renderTables(pitches) {
    var byType = groupBy(pitches, "pitch_type");
    var typeBody = document.getElementById("by-type");
    var typeKeys = Object.keys(byType).sort();
    typeBody.innerHTML = typeKeys
      .map(function (k) {
        var g = byType[k];
        var a = aggregate(g);
        var label = g[0].pitch_label || k;
        return (
          "<tr><td>" +
          label +
          "</td><td>" +
          a.n +
          "</td><td>" +
          fmtIn(a.avgMiss) +
          "</td><td>" +
          fmtIn(a.medMiss) +
          "</td><td>" +
          fmtXZ(a.avgTarget) +
          "</td><td>" +
          fmtXZ(a.avgLoc) +
          "</td></tr>"
        );
      })
      .join("");

    var byOuting = groupBy(pitches, "outing");
    var outBody = document.getElementById("by-outing");
    var outKeys = Object.keys(byOuting).sort();
    outBody.innerHTML = outKeys
      .map(function (k) {
        var g = byOuting[k];
        var a = aggregate(g);
        var types = Object.keys(groupBy(g, "pitch_type")).join(", ");
        return (
          "<tr><td>" +
          k +
          "</td><td>" +
          a.n +
          "</td><td>" +
          fmtIn(a.avgMiss) +
          "</td><td>" +
          types +
          "</td></tr>"
        );
      })
      .join("");
  }

  function refresh() {
    var pitches = selectedPitches();
    var agg = aggregate(pitches);
    var avg = resolveAverages(agg);
    drawChart(pitches, avg);

    var missEl = document.getElementById("miss-row");
    if (agg.n === 0) {
      missEl.innerHTML =
        'Avg miss: <strong>—</strong> <span style="opacity:0.7">(no pitches in selection · showing last averages)</span>';
    } else {
      var vec = avg.missVec;
      var vecMag =
        vec != null ? hypot(vec.x, vec.z) : hypot(avg.loc.x - avg.target.x, avg.loc.z - avg.target.z);
      missEl.innerHTML =
        "Avg miss: <strong>" +
        (agg.avgMiss == null ? "—" : agg.avgMiss.toFixed(1) + "″") +
        "</strong>" +
        (agg.medMiss != null ? " · median " + agg.medMiss.toFixed(1) + "″" : "") +
        '<div class="miss-vec">Miss vector (glove → ball): <strong>' +
        fmtMissVec(vec) +
        "</strong> · |" +
        vecMag.toFixed(1) +
        "″|</div>";
    }

    document.getElementById("summary").textContent =
      pitches.length +
      " pitches · " +
      Object.keys(groupBy(pitches, "outing")).length +
      " outings · " +
      Object.keys(groupBy(pitches, "pitch_type")).length +
      " pitch types";

    document.getElementById("metrics").innerHTML = [
      ["Pitches", String(agg.n)],
      ["Avg miss |d|", fmtIn(agg.avgMiss)],
      ["Median miss |d|", fmtIn(agg.medMiss)],
      ["Miss vector", fmtMissVec(avg.missVec)],
      ["Avg target x/z", fmtXZ(avg.target)],
      ["Avg location x/z", fmtXZ(avg.loc)],
    ]
      .map(function (row) {
        return (
          '<div class="metric"><span>' + row[0] + "</span><strong>" + row[1] + "</strong></div>"
        );
      })
      .join("");

    renderTables(pitches);
    if (state.selectedId) {
      renderPitchDetail(findPitch(state.selectedId));
    }
  }

  function pickPitchAt(clientX, clientY) {
    var rect = canvas.getBoundingClientRect();
    var x = clientX - rect.left;
    var y = clientY - rect.top;
    var best = null;
    var bestD = 12;
    state.hitRegions.forEach(function (h) {
      var d = hypot(h.x - x, h.y - y);
      if (d <= h.r && d < bestD) {
        bestD = d;
        best = h;
      }
    });
    return best ? findPitch(best.id) : null;
  }

  canvas.addEventListener("click", function (ev) {
    var p = pickPitchAt(ev.clientX, ev.clientY);
    if (!p) return;
    state.selectedId = p.id;
    renderPitchDetail(p);
    refresh();
  });

  videoModal.addEventListener("click", function (ev) {
    if (ev.target.closest("[data-close-modal]")) closeVideoModal();
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && !videoModal.hidden) closeVideoModal();
  });

  function buildChips() {
    var outingCounts = {};
    var typeCounts = {};
    state.pitches.forEach(function (p) {
      outingCounts[p.outing] = (outingCounts[p.outing] || 0) + 1;
      typeCounts[p.pitch_type] = (typeCounts[p.pitch_type] || 0) + 1;
    });

    var outingRoot = document.getElementById("outing-chips");
    outingRoot.innerHTML = Object.keys(outingCounts)
      .sort()
      .map(function (k) {
        state.outings[k] = true;
        return (
          '<button type="button" class="chip is-active" data-outing="' +
          k +
          '">' +
          k +
          '<span class="n">(' +
          outingCounts[k] +
          ")</span></button>"
        );
      })
      .join("");

    var typeRoot = document.getElementById("type-chips");
    var labels = {};
    state.pitches.forEach(function (p) {
      labels[p.pitch_type] = p.pitch_label || p.pitch_type;
    });
    typeRoot.innerHTML = Object.keys(typeCounts)
      .sort()
      .map(function (k) {
        state.types[k] = true;
        return (
          '<button type="button" class="chip is-active" data-type="' +
          k +
          '">' +
          labels[k] +
          '<span class="n">(' +
          typeCounts[k] +
          ")</span></button>"
        );
      })
      .join("");

    outingRoot.addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-outing]");
      if (!btn) return;
      var key = btn.getAttribute("data-outing");
      state.outings[key] = !state.outings[key];
      btn.classList.toggle("is-active", !!state.outings[key]);
      refresh();
    });
    typeRoot.addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-type]");
      if (!btn) return;
      var key = btn.getAttribute("data-type");
      state.types[key] = !state.types[key];
      btn.classList.toggle("is-active", !!state.types[key]);
      refresh();
    });
  }

  function setAll(store, rootSel, on) {
    Object.keys(store).forEach(function (k) {
      store[k] = on;
    });
    document.querySelectorAll(rootSel + " .chip").forEach(function (btn) {
      btn.classList.toggle("is-active", on);
    });
    refresh();
  }

  document.getElementById("outings-all").addEventListener("click", function () {
    setAll(state.outings, "#outing-chips", true);
  });
  document.getElementById("outings-none").addEventListener("click", function () {
    setAll(state.outings, "#outing-chips", false);
  });
  document.getElementById("types-all").addEventListener("click", function () {
    setAll(state.types, "#type-chips", true);
  });
  document.getElementById("types-none").addEventListener("click", function () {
    setAll(state.types, "#type-chips", false);
  });

  document.querySelectorAll("[data-mode]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.mode = btn.getAttribute("data-mode");
      document.querySelectorAll("[data-mode]").forEach(function (el) {
        el.classList.toggle("is-active", el === btn);
      });
      refresh();
    });
  });

  window.addEventListener("resize", function () {
    refresh();
  });

  fetch(DATA_URL)
    .then(function (r) {
      if (!r.ok) throw new Error("Failed to load " + DATA_URL);
      return r.json();
    })
    .then(function (data) {
      zone = data.zone || {};
      X_MIN = Number(zone.chart_x_min_in != null ? zone.chart_x_min_in : -36);
      X_MAX = Number(zone.chart_x_max_in != null ? zone.chart_x_max_in : 36);
      Z_MIN = Number(zone.chart_z_min_in != null ? zone.chart_z_min_in : -12);
      Z_MAX = Number(zone.chart_z_max_in != null ? zone.chart_z_max_in : 54);
      ZONE_HALF = Number(zone.plate_half_width_in != null ? zone.plate_half_width_in : 8.5);
      ZONE_BOT = Number(zone.zone_bot_in != null ? zone.zone_bot_in : 18);
      ZONE_TOP = Number(zone.zone_top_in != null ? zone.zone_top_in : 42);
      PLATE_TIP_Z = Number(zone.plate_tip_z_in != null ? zone.plate_tip_z_in : -8.5);
      BOX_INNER = Number(zone.batter_box_inner_in != null ? zone.batter_box_inner_in : 14.5);
      BOX_OUTER = Number(zone.batter_box_outer_in != null ? zone.batter_box_outer_in : 50);
      CENTER = { x: 0, z: (ZONE_BOT + ZONE_TOP) / 2 };

      state.pitches = (data.pitches || []).map(function (p) {
        if (!p.marker) {
          // defensive defaults if seed lacks marker fields
          p.marker = "dot";
          p.marker_class = "other";
        }
        if (!p.video_url && p.play_id) {
          p.video_url = SAVANT_VIDEO + p.play_id;
        }
        return p;
      });

      var fullAgg = aggregate(state.pitches);
      if (fullAgg.avgTarget && fullAgg.avgMissVec) {
        state.lastAvgTarget = fullAgg.avgTarget;
        state.lastAvgMiss = fullAgg.avgMissVec;
      } else {
        state.lastAvgTarget = { x: CENTER.x, z: CENTER.z };
        state.lastAvgMiss = { x: 0, z: 0 };
      }

      var p = data.pitcher || {};
      document.getElementById("pitcher-name").textContent = p.name || "Pitcher";
      document.getElementById("pitcher-meta").textContent =
        (p.team || "") +
        " · " +
        (p.throws || "") +
        "HP · " +
        (p.season || "") +
        " · " +
        state.pitches.length +
        " pitches";
      document.getElementById("source-pill").textContent =
        (data.data_source && data.data_source.ui_label) ||
        "Preflight Command · mitt vs location";
      document.getElementById("foot-detail").textContent =
        (p.name || "Pitcher") + " · " + (p.season || "") + " season seed";

      buildChips();
      renderPitchDetail(null);
      refresh();
    })
    .catch(function (err) {
      document.getElementById("pitcher-name").textContent = "Failed to load data";
      document.getElementById("pitcher-meta").textContent = String(err);
    });
})();
