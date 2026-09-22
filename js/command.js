(function () {
  "use strict";

  var DATA_URL = "data/yamamoto_2026_command.json";

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

  var state = {
    pitches: [],
    mode: "selection",
    outings: {},
    types: {},
    cmittOnly: false,
  };

  var canvas = document.getElementById("chart");
  var wrap = document.getElementById("chart-wrap");
  var gloveEl = document.getElementById("glove");
  var ballEl = document.getElementById("ball");

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
    drawBox(-Math.min(BOX_OUTER, X_MAX - 0.5), -BOX_INNER, "LHB");
    drawBox(BOX_INNER, Math.min(BOX_OUTER, X_MAX - 0.5), "RHB");

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
      return state.pitches.filter(function (p) {
        return !state.cmittOnly || p.has_preflight_cmitt;
      });
    }
    var anyOuting = Object.keys(state.outings).some(function (k) {
      return state.outings[k];
    });
    var anyType = Object.keys(state.types).some(function (k) {
      return state.types[k];
    });
    return state.pitches.filter(function (p) {
      if (state.cmittOnly && !p.has_preflight_cmitt) return false;
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
      miss = [],
      cx = [],
      cz = [];
    pitches.forEach(function (p) {
      tx.push(p.target_x_in);
      tz.push(p.target_z_in);
      lx.push(p.loc_x_in);
      lz.push(p.loc_z_in);
      miss.push(p.miss_in);
      if (p.has_preflight_cmitt && p.cmitt_x_in != null && p.cmitt_z_in != null) {
        cx.push(p.cmitt_x_in);
        cz.push(p.cmitt_z_in);
      }
    });
    var atx = mean(tx),
      atz = mean(tz),
      alx = mean(lx),
      alz = mean(lz);
    return {
      n: pitches.length,
      avgTarget: atx == null ? null : { x: atx, z: atz },
      avgLoc: alx == null ? null : { x: alx, z: alz },
      avgCmitt: cx.length ? { x: mean(cx), z: mean(cz) } : null,
      avgMiss: mean(miss),
      medMiss: median(miss),
      cmittN: cx.length,
    };
  }

  function drawChart(pitches, agg) {
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

    // scatter: targets + locations
    pitches.forEach(function (p) {
      var t = inchesToPx(p.target_x_in, p.target_z_in);
      var l = inchesToPx(p.loc_x_in, p.loc_z_in);
      ctx.strokeStyle = "rgba(61, 139, 253, 0.45)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(t.x - 3.5, t.y - 3.5);
      ctx.lineTo(t.x + 3.5, t.y + 3.5);
      ctx.moveTo(t.x + 3.5, t.y - 3.5);
      ctx.lineTo(t.x - 3.5, t.y + 3.5);
      ctx.stroke();
      ctx.fillStyle = "rgba(248, 250, 252, 0.55)";
      ctx.beginPath();
      ctx.arc(l.x, l.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    if (agg.avgTarget && agg.avgLoc) {
      var ig = inchesToPx(agg.avgTarget.x, agg.avgTarget.z);
      var ab = inchesToPx(agg.avgLoc.x, agg.avgLoc.z);
      ctx.strokeStyle = "rgba(62, 207, 106, 0.55)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(ig.x, ig.y);
      ctx.lineTo(ab.x, ab.y);
      ctx.stroke();
      ctx.setLineDash([]);
      gloveEl.style.left = ig.x + "px";
      gloveEl.style.top = ig.y + "px";
      gloveEl.style.display = "block";
      ballEl.style.left = ab.x + "px";
      ballEl.style.top = ab.y + "px";
      ballEl.style.display = "block";
    } else {
      gloveEl.style.display = "none";
      ballEl.style.display = "none";
    }

    if (agg.avgCmitt) {
      var c = inchesToPx(agg.avgCmitt.x, agg.avgCmitt.z);
      ctx.strokeStyle = "#f0b429";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(240, 180, 41, 0.25)";
      ctx.fill();
    }
  }

  function fmtIn(v) {
    return v == null || isNaN(v) ? "—" : v.toFixed(1) + "″";
  }

  function fmtXZ(p) {
    if (!p) return "—";
    return p.x.toFixed(1) + " / " + p.z.toFixed(1);
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
    drawChart(pitches, agg);

    var missEl = document.getElementById("miss-row");
    missEl.innerHTML =
      "Avg miss: <strong>" +
      (agg.avgMiss == null ? "—" : agg.avgMiss.toFixed(1) + "″") +
      "</strong>" +
      (agg.medMiss != null ? " · median " + agg.medMiss.toFixed(1) + "″" : "");

    document.getElementById("summary").textContent =
      pitches.length +
      " pitches · " +
      Object.keys(groupBy(pitches, "outing")).length +
      " outings · " +
      Object.keys(groupBy(pitches, "pitch_type")).length +
      " pitch types" +
      (agg.cmittN ? " · " + agg.cmittN + " with Preflight cmitt" : "");

    document.getElementById("metrics").innerHTML = [
      ["Pitches", String(agg.n)],
      ["Avg miss", fmtIn(agg.avgMiss)],
      ["Median miss", fmtIn(agg.medMiss)],
      ["Avg target x/z", fmtXZ(agg.avgTarget)],
      ["Avg location x/z", fmtXZ(agg.avgLoc)],
      [
        "Miss vector",
        agg.avgTarget && agg.avgLoc
          ? hypot(agg.avgLoc.x - agg.avgTarget.x, agg.avgLoc.z - agg.avgTarget.z).toFixed(1) + "″"
          : "—",
      ],
    ]
      .map(function (row) {
        return (
          '<div class="metric"><span>' + row[0] + "</span><strong>" + row[1] + "</strong></div>"
        );
      })
      .join("");

    renderTables(pitches);
  }

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

  document.getElementById("cmitt-only").addEventListener("change", function (ev) {
    state.cmittOnly = !!ev.target.checked;
    refresh();
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

      state.pitches = data.pitches || [];
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
        " pitches in seed";
      var src = data.data_source || {};
      document.getElementById("source-pill").textContent =
        "OpenCommand inferred · " +
        (src.cmitt_overlap || 0) +
        " Preflight cmitt joins · season med miss ~" +
        (src.season_inferred_median_in || "—") +
        "″";
      document.getElementById("foot-detail").textContent =
        (src.primary || "") +
        " · License " +
        (src.license || "CC BY-NC-SA 4.0") +
        ". " +
        (src.attribution || "");

      buildChips();
      refresh();
    })
    .catch(function (err) {
      document.getElementById("pitcher-name").textContent = "Failed to load data";
      document.getElementById("pitcher-meta").textContent = String(err);
    });
})();
